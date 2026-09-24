import { type Ratio, toRatioValue } from '~/utils/geometry';

export type MobileCutoff = {
  readonly leftPercent: number;
  readonly rightPercent: number;
};

/**
 * How much of a `desktopRatio`-framed crop a narrower `mobileRatio` would
 * additionally hard-crop off the left/right edges, as a percentage of the
 * frame's width on each side.
 */
export const computeMobileCutoff = (
  desktopRatio: Ratio,
  mobileRatio: Ratio,
): MobileCutoff => {
  const desktopValue = toRatioValue(desktopRatio);
  const mobileValue = toRatioValue(mobileRatio);

  if (mobileValue > desktopValue) {
    throw new Error(
      `Mobile ratio ${mobileValue} must not be wider than desktop ratio ${desktopValue} — a wider mobile ratio would crop top/bottom, not left/right.`,
    );
  }

  const sidePercent = ((1 - mobileValue / desktopValue) / 2) * 100;
  return { leftPercent: sidePercent, rightPercent: sidePercent };
};
