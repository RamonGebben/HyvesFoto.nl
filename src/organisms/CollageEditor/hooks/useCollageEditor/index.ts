'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  aspectRatioPresets,
  findAspectRatioPreset,
} from '~/content/aspectRatios';
import {
  MAX_GAP_RATIO,
  MIN_GAP_RATIO,
  useEditorStore,
} from '~/stores/useEditorStore';
import type { EditorImage } from '~/stores/useEditorStore';
import { buildExportPlan } from '~/utils/buildExportPlan';
import { getLayoutOptionsForCount } from '~/utils/collageLayoutOptions';
import type { CropView } from '~/utils/computeCropRect';
import { downloadBlob } from '~/utils/downloadBlob';
import type { Ratio } from '~/utils/geometry';
import {
  clearImages as clearStoredImages,
  deleteImage,
  listImages,
  putImage,
} from '~/utils/imageStore';
import type { StoredImage } from '~/utils/imageStore';
import { loadImageElement } from '~/utils/loadImageElement';
import { loadImageSize } from '~/utils/loadImageSize';
import { renderExportPlan } from '~/utils/renderExportPlan';
import { resolveCanvasSize } from '~/utils/resolveCanvasSize';
import { resolveCollageTiles } from '~/utils/resolveCollageTiles';
import type { CollageTile } from '~/utils/resolveCollageTiles';

const COLLAGE_EXPORT_WIDTH = 1500;

type StoredImageFactoryOptions = {
  readonly createId: () => string;
  readonly now: () => number;
};

/**
 * Turns dropped files into the records that go to IndexedDB.
 *
 * Pure given its id/clock injections, so the browser-free `unit` project can
 * assert the shape without a renderer or a database.
 */
export const toStoredImages = (
  files: readonly File[],
  { createId, now }: StoredImageFactoryOptions,
): readonly StoredImage[] =>
  files.map((file, index) => ({
    id: createId(),
    name: file.name,
    blob: file,
    // Offset by index so a multi-file drop keeps its order when listed back.
    createdAt: now() + index,
  }));

const toEditorImage = (stored: StoredImage): EditorImage => ({
  id: stored.id,
  name: stored.name,
  previewUrl: URL.createObjectURL(stored.blob),
});

export type EditableImage = EditorImage & {
  readonly cropView: CropView | undefined;
};

const hasCropData = (
  image: EditableImage,
): image is EditableImage & {
  naturalSize: NonNullable<EditableImage['naturalSize']>;
  cropView: CropView;
} => Boolean(image.naturalSize && image.cropView);

export const useCollageEditor = () => {
  const aspectRatioId = useEditorStore(state => state.aspectRatioId);
  const images = useEditorStore(state => state.images);
  const cropViews = useEditorStore(state => state.cropViews);
  const gapRatio = useEditorStore(state => state.gapRatio);
  const mobileGuideOpacity = useEditorStore(state => state.mobileGuideOpacity);
  const selectedLayoutId = useEditorStore(state => state.selectedLayoutId);
  const setAspectRatioId = useEditorStore(state => state.setAspectRatioId);
  const addImages = useEditorStore(state => state.addImages);
  const removeImageFromStore = useEditorStore(state => state.removeImage);
  const clearImagesFromStore = useEditorStore(state => state.clearImages);
  const setImageNaturalSize = useEditorStore(
    state => state.setImageNaturalSize,
  );
  const setCropView = useEditorStore(state => state.setCropView);
  const setGapRatio = useEditorStore(state => state.setGapRatio);
  const setMobileGuideOpacity = useEditorStore(
    state => state.setMobileGuideOpacity,
  );
  const setSelectedLayoutId = useEditorStore(
    state => state.setSelectedLayoutId,
  );
  const moveImage = useEditorStore(state => state.moveImage);

  const [isExporting, setIsExporting] = useState(false);

  // Object URLs are leaked memory until revoked, so every one we mint is
  // tracked and released on unmount (and on a full reset).
  const objectUrlsRef = useRef<Set<string>>(new Set());

  const trackAndConvert = useCallback(
    (stored: StoredImage): EditorImage => {
      const editorImage = toEditorImage(stored);
      objectUrlsRef.current.add(editorImage.previewUrl);

      loadImageSize(editorImage.previewUrl)
        .then(naturalSize => setImageNaturalSize(editorImage.id, naturalSize))
        .catch((error: unknown) => {
          console.error(
            `Kon de afmetingen van ${editorImage.name} niet lezen`,
            error,
          );
        });

      return editorImage;
    },
    [setImageNaturalSize],
  );

  // Restore whatever the user had open before the refresh.
  useEffect(() => {
    let isActive = true;

    listImages()
      .then(stored => {
        if (!isActive || stored.length === 0) return;
        addImages(stored.map(trackAndConvert));
      })
      .catch((error: unknown) => {
        console.error('Could not restore images from IndexedDB', error);
      });

    return () => {
      isActive = false;
    };
  }, [addImages, trackAndConvert]);

  useEffect(() => {
    const objectUrls = objectUrlsRef.current;

    return () => {
      objectUrls.forEach(url => URL.revokeObjectURL(url));
      objectUrls.clear();
    };
  }, []);

  const handleFilesAccepted = useCallback(
    (files: readonly File[]) => {
      const stored = toStoredImages(files, {
        createId: () => crypto.randomUUID(),
        now: () => Date.now(),
      });

      addImages(stored.map(trackAndConvert));

      Promise.all(stored.map(putImage)).catch((error: unknown) => {
        console.error('Could not persist images to IndexedDB', error);
      });
    },
    [addImages, trackAndConvert],
  );

  const handleRemoveImage = useCallback(
    (id: string) => {
      const image = images.find(candidate => candidate.id === id);

      if (image) {
        URL.revokeObjectURL(image.previewUrl);
        objectUrlsRef.current.delete(image.previewUrl);
      }

      removeImageFromStore(id);

      deleteImage(id).catch((error: unknown) => {
        console.error('Could not delete image from IndexedDB', error);
      });
    },
    [images, removeImageFromStore],
  );

  const handleReset = useCallback(() => {
    objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    objectUrlsRef.current.clear();

    clearImagesFromStore();

    clearStoredImages().catch((error: unknown) => {
      console.error('Could not clear images from IndexedDB', error);
    });
  }, [clearImagesFromStore]);

  const outputRatio: Ratio | undefined = findAspectRatioPreset(aspectRatioId);
  if (!outputRatio) {
    throw new Error(`Unknown aspect ratio id: ${aspectRatioId}`);
  }

  const imageCount = images.length;

  const layoutOptions = useMemo(
    () => (imageCount > 0 ? getLayoutOptionsForCount(imageCount) : []),
    [imageCount],
  );

  // If the image count changes and the current pick no longer applies (or
  // nothing was picked yet), fall back to the first curated/generated option
  // for the new count.
  useEffect(() => {
    if (layoutOptions.length === 0) return;
    const isStillValid = layoutOptions.some(
      option => option.id === selectedLayoutId,
    );
    if (!isStillValid) {
      setSelectedLayoutId(layoutOptions[0]!.id);
    }
  }, [layoutOptions, selectedLayoutId, setSelectedLayoutId]);

  const selectedLayout =
    layoutOptions.find(option => option.id === selectedLayoutId) ??
    layoutOptions[0];

  const tiles = useMemo<readonly CollageTile[]>(
    () =>
      selectedLayout
        ? resolveCollageTiles(selectedLayout.tree, outputRatio, gapRatio)
        : [],
    [selectedLayout, outputRatio, gapRatio],
  );

  const editableImages = useMemo<readonly EditableImage[]>(
    () =>
      images.map(image => ({
        ...image,
        cropView: cropViews[image.id],
      })),
    [images, cropViews],
  );

  const handleCropViewChange = useCallback(
    (id: string, view: CropView) => setCropView(id, view),
    [setCropView],
  );

  const handleSwapImages = useCallback(
    (fromId: string, toId: string) => moveImage(fromId, toId),
    [moveImage],
  );

  const handleExportCollage = useCallback(async () => {
    if (
      editableImages.length === 0 ||
      tiles.length !== editableImages.length ||
      !editableImages.every(hasCropData)
    ) {
      return;
    }

    setIsExporting(true);
    try {
      const canvasSize = resolveCanvasSize(outputRatio, COLLAGE_EXPORT_WIDTH);
      const plan = buildExportPlan(editableImages, tiles, canvasSize);
      const sources = await Promise.all(
        editableImages.map(async image => ({
          id: image.id,
          element: await loadImageElement(image.previewUrl),
        })),
      );
      const blob = await renderExportPlan(plan, sources);
      downloadBlob(blob, 'buzz-collage.jpg');
    } catch (error) {
      console.error('Kon de export niet maken', error);
    } finally {
      setIsExporting(false);
    }
  }, [editableImages, tiles, outputRatio]);

  return {
    presets: aspectRatioPresets,
    selectedAspectRatioId: aspectRatioId,
    outputRatio,
    images: editableImages,
    tiles,
    layoutOptions,
    selectedLayoutId: selectedLayout?.id,
    gapRatio,
    minGapRatio: MIN_GAP_RATIO,
    maxGapRatio: MAX_GAP_RATIO,
    mobileGuideOpacity,
    onSelectAspectRatio: setAspectRatioId,
    onSelectLayout: setSelectedLayoutId,
    onGapRatioChange: setGapRatio,
    onMobileGuideOpacityChange: setMobileGuideOpacity,
    onFilesAccepted: handleFilesAccepted,
    onRemoveImage: handleRemoveImage,
    onCropViewChange: handleCropViewChange,
    onSwapImages: handleSwapImages,
    onExportCollage: () => void handleExportCollage(),
    onReset: handleReset,
    isExporting,
  };
};
