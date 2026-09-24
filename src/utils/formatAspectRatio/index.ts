import type { Ratio } from '~/utils/geometry';

/**
 * Renders a ratio as a human label: `{ width: 15, height: 6 }` -> `"15:6"`.
 *
 * Deliberately does *not* reduce to simplest form — 15:6 would become 5:2,
 * which is the same shape but not the number anyone recognises the Hyves
 * timeline by. Presets are authored in the numbers users expect to see.
 * Non-integer ratios are normalised against 1 (`"2.4:1"`).
 */
export const formatAspectRatio = ({ width, height }: Ratio): string => {
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    throw new Error(
      `Invalid ratio: ${width}x${height}. Both sides must be finite and positive.`,
    );
  }

  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    return `${Number((width / height).toFixed(1))}:1`;
  }

  return `${width}:${height}`;
};
