import { clamp } from '~/utils/clamp';
import { clampCropRect } from '~/utils/clampCropRect';
import { coverCrop } from '~/utils/coverCrop';
import { isPositiveSize } from '~/utils/geometry';
import type { Point, Ratio, Rect, Size } from '~/utils/geometry';

/**
 * Pan-and-zoom state for a single image's crop.
 *
 * `zoom` is relative, not absolute: 1 always means "as much of the image as
 * the target ratio allows" (`coverCrop`'s rect), regardless of what that
 * ratio is. `center` is the focus point in source image pixels, so it stays
 * meaningful even if the ratio later changes — e.g. when a second and third
 * photo join a collage and every slot narrows.
 */
export type CropView = {
  readonly zoom: number;
  readonly center: Point;
};

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 4;

/**
 * Fully zoomed out and centred on the image — the starting point for every
 * crop. Centred works out the same regardless of ratio: `coverCrop`'s rect
 * is always centred on the source, by construction.
 */
export const defaultCropView = (source: Size): CropView => {
  if (!isPositiveSize(source)) {
    throw new Error(
      `Invalid source size: ${source.width}x${source.height}. Both sides must be finite and positive.`,
    );
  }

  return {
    zoom: MIN_ZOOM,
    center: { x: source.width / 2, y: source.height / 2 },
  };
};

/**
 * Resolves a zoom/center pair to the actual rect to read from the source
 * image. zoom=1 always yields `coverCrop`'s rect; higher zoom shrinks that
 * rect around `center`. The result is always clamped inside the source, so
 * callers never have to guard against an out-of-bounds crop.
 */
export const computeCropRect = (
  source: Size,
  ratio: Ratio,
  view: CropView,
): Rect => {
  const base = coverCrop(source, ratio);
  const zoom = clamp(view.zoom, MIN_ZOOM, MAX_ZOOM);
  const width = base.width / zoom;
  const height = base.height / zoom;

  return clampCropRect(
    {
      x: view.center.x - width / 2,
      y: view.center.y - height / 2,
      width,
      height,
    },
    source,
  );
};
