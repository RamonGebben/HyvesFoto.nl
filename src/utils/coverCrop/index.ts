import { isPositiveSize, toRatioValue } from '~/utils/geometry';
import type { Ratio, Rect, Size } from '~/utils/geometry';

/**
 * The largest centred rect of `ratio` that fits inside `source`.
 *
 * This is the crop the user starts from: it keeps as much of the original
 * image as the target shape allows, and never scales up or leaves letterbox
 * bars. Panning and zooming from here is `clampCropRect`'s job.
 */
export const coverCrop = (source: Size, ratio: Ratio): Rect => {
  if (!isPositiveSize(source)) {
    throw new Error(
      `Invalid source size: ${source.width}x${source.height}. Both sides must be finite and positive.`,
    );
  }

  const targetRatio = toRatioValue(ratio);
  const sourceRatio = source.width / source.height;

  // Source is wider than the target: full height, trim the sides.
  if (sourceRatio > targetRatio) {
    const width = source.height * targetRatio;
    return {
      x: (source.width - width) / 2,
      y: 0,
      width,
      height: source.height,
    };
  }

  // Source is taller than (or equal to) the target: full width, trim top and
  // bottom. This is the case that saves faces from the Hyves auto-crop.
  const height = source.width / targetRatio;
  return {
    x: 0,
    y: (source.height - height) / 2,
    width: source.width,
    height,
  };
};
