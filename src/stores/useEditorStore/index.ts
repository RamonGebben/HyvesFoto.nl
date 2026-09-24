'use client';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { defaultAspectRatioId } from '~/content/aspectRatios';
import type { AspectRatioId } from '~/content/aspectRatios';
import { defaultCropView } from '~/utils/computeCropRect';
import type { CropView } from '~/utils/computeCropRect';
import type { Size } from '~/utils/geometry';

/**
 * Ephemeral editor state. The image bytes themselves live in IndexedDB
 * (`~/utils/imageStore`); this store only holds what the UI needs to render
 * right now, keyed by the same ids.
 */

export type EditorImage = {
  readonly id: string;
  readonly name: string;
  /** Object URL for previewing. Revoked when the image is removed. */
  readonly previewUrl: string;
  /** Set once the image has decoded — crop math needs it, decoding is async. */
  readonly naturalSize?: Size;
};

/** Space between grid tiles, as a fraction of the output canvas width. */
export const MIN_GAP_RATIO = 0;
export const MAX_GAP_RATIO = 0.04;
const DEFAULT_GAP_RATIO = 0.012;

/** How visible the mobile safe-zone guide is, from 0 (hidden) to 1 (full). */
const DEFAULT_MOBILE_GUIDE_OPACITY = 1;

type EditorState = {
  aspectRatioId: AspectRatioId;
  images: readonly EditorImage[];
  cropViews: Readonly<Record<string, CropView>>;
  gapRatio: number;
  mobileGuideOpacity: number;
  /** Which curated/generated layout is picked for the current image count. */
  selectedLayoutId: string | undefined;
  setAspectRatioId: (aspectRatioId: AspectRatioId) => void;
  addImages: (images: readonly EditorImage[]) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
  setImageNaturalSize: (id: string, naturalSize: Size) => void;
  setCropView: (id: string, view: CropView) => void;
  setGapRatio: (gapRatio: number) => void;
  setMobileGuideOpacity: (mobileGuideOpacity: number) => void;
  setSelectedLayoutId: (id: string) => void;
  /** Swaps two images' positions, i.e. which grid tile each one occupies. */
  moveImage: (fromId: string, toId: string) => void;
};

export const useEditorStore = create<EditorState>()(
  immer(set => ({
    aspectRatioId: defaultAspectRatioId,
    images: [],
    cropViews: {},
    gapRatio: DEFAULT_GAP_RATIO,
    mobileGuideOpacity: DEFAULT_MOBILE_GUIDE_OPACITY,
    selectedLayoutId: undefined,

    setAspectRatioId: aspectRatioId =>
      set(state => {
        state.aspectRatioId = aspectRatioId;
      }),

    addImages: images =>
      set(state => {
        state.images = [...state.images, ...images];
      }),

    removeImage: id =>
      set(state => {
        state.images = state.images.filter(image => image.id !== id);
        delete state.cropViews[id];
      }),

    // "Begin opnieuw": a full reset, not just the images — a stale gap or
    // layout pick from the previous set of photos shouldn't carry over.
    clearImages: () =>
      set(state => {
        state.images = [];
        state.cropViews = {};
        state.gapRatio = DEFAULT_GAP_RATIO;
        state.selectedLayoutId = undefined;
      }),

    setImageNaturalSize: (id, naturalSize) =>
      set(state => {
        state.images = state.images.map(image =>
          image.id === id ? { ...image, naturalSize } : image,
        );
        // Seed a starting crop the first time we learn an image's size.
        // A later re-decode (shouldn't happen, but harmless) must not
        // clobber a crop the user has already adjusted.
        state.cropViews[id] ??= defaultCropView(naturalSize);
      }),

    setCropView: (id, view) =>
      set(state => {
        state.cropViews[id] = view;
      }),

    setGapRatio: gapRatio =>
      set(state => {
        state.gapRatio = gapRatio;
      }),

    setMobileGuideOpacity: mobileGuideOpacity =>
      set(state => {
        state.mobileGuideOpacity = mobileGuideOpacity;
      }),

    setSelectedLayoutId: id =>
      set(state => {
        state.selectedLayoutId = id;
      }),

    moveImage: (fromId, toId) =>
      set(state => {
        const fromIndex = state.images.findIndex(image => image.id === fromId);
        const toIndex = state.images.findIndex(image => image.id === toId);
        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
          return;
        }

        const images = [...state.images];
        [images[fromIndex], images[toIndex]] = [
          images[toIndex]!,
          images[fromIndex]!,
        ];
        state.images = images;
      }),
  })),
);
