/** Shared geometry vocabulary for every crop/collage calculation. */

export type Size = {
  readonly width: number;
  readonly height: number;
};

export type Point = {
  readonly x: number;
  readonly y: number;
};

export type Rect = Point & Size;

/** A target shape. Only `width / height` matters, not the absolute units. */
export type Ratio = {
  readonly width: number;
  readonly height: number;
};

export const isPositiveSize = (size: Size): boolean =>
  Number.isFinite(size.width) &&
  Number.isFinite(size.height) &&
  size.width > 0 &&
  size.height > 0;

/** `{ width: 15, height: 6 }` -> `2.5`. */
export const toRatioValue = (ratio: Ratio): number => {
  if (!isPositiveSize(ratio)) {
    throw new Error(
      `Invalid ratio: ${ratio.width}x${ratio.height}. Both sides must be finite and positive.`,
    );
  }

  return ratio.width / ratio.height;
};
