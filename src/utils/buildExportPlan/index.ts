import { computeCropRect } from '~/utils/computeCropRect';
import type { CropView } from '~/utils/computeCropRect';
import { isPositiveSize } from '~/utils/geometry';
import type { Rect, Size } from '~/utils/geometry';
import type { CollageTile } from '~/utils/resolveCollageTiles';

export type ExportImageInput = {
  readonly id: string;
  readonly naturalSize: Size;
  readonly cropView: CropView;
};

export type ExportSlot = {
  readonly imageId: string;
  /** Pixels to read from the original image. */
  readonly sourceRect: Rect;
  /** Pixels to draw them into on the output canvas. */
  readonly destRect: Rect;
};

export type ExportPlan = {
  readonly canvasSize: Size;
  readonly slots: readonly ExportSlot[];
};

/**
 * Combines each image's own crop with its resolved collage tile into a
 * single, canvas-ready plan: where in the output canvas each image lands,
 * and which pixels of its source to read for it. `images[i]` pairs
 * positionally with `tiles[i]` — both come from the same ordered `images`
 * array upstream (`resolveCollageTiles` resolves `tiles` once per render).
 * Pure — the actual `<canvas>` drawing (`renderExportPlan`) is a thin
 * wrapper around this, so the part worth getting right is the part that is
 * actually unit-tested here.
 */
export const buildExportPlan = (
  images: readonly ExportImageInput[],
  tiles: readonly CollageTile[],
  canvasSize: Size,
): ExportPlan => {
  if (images.length === 0) {
    throw new Error('Cannot build an export plan with no images.');
  }

  if (images.length !== tiles.length) {
    throw new Error(`Got ${images.length} images but ${tiles.length} tiles.`);
  }

  if (!isPositiveSize(canvasSize)) {
    throw new Error(
      `Invalid canvas size: ${canvasSize.width}x${canvasSize.height}. Both sides must be finite and positive.`,
    );
  }

  const slots = images.map((image, index) => {
    const tile = tiles[index]!;
    const destRect: Rect = {
      x: tile.rect.x * canvasSize.width,
      y: tile.rect.y * canvasSize.height,
      width: tile.rect.width * canvasSize.width,
      height: tile.rect.height * canvasSize.height,
    };

    return {
      imageId: image.id,
      sourceRect: computeCropRect(
        image.naturalSize,
        tile.ratio,
        image.cropView,
      ),
      destRect,
    };
  });

  return { canvasSize, slots };
};
