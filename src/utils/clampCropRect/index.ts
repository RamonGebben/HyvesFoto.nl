import { clamp } from '~/utils/clamp';
import { isPositiveSize } from '~/utils/geometry';
import type { Rect, Size } from '~/utils/geometry';

/**
 * Keeps a crop rect fully inside the source image.
 *
 * Called on every pan and zoom: the rect is first shrunk to fit the bounds
 * (preserving its aspect ratio is the caller's concern), then nudged back
 * inside them. Never grows a rect.
 */
export const clampCropRect = (crop: Rect, bounds: Size): Rect => {
  if (!isPositiveSize(bounds)) {
    throw new Error(
      `Invalid bounds: ${bounds.width}x${bounds.height}. Both sides must be finite and positive.`,
    );
  }

  const width = clamp(crop.width, 0, bounds.width);
  const height = clamp(crop.height, 0, bounds.height);

  return {
    x: clamp(crop.x, 0, bounds.width - width),
    y: clamp(crop.y, 0, bounds.height - height),
    width,
    height,
  };
};
