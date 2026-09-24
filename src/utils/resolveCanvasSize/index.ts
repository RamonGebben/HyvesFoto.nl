import { isPositiveSize } from '~/utils/geometry';
import type { Ratio, Size } from '~/utils/geometry';

/**
 * The pixel size of the export canvas for a given output ratio and width.
 * Shared by `buildExportPlan` (destination rects) and the caller that
 * decides the export resolution, so `canvasAspect` is only ever derived
 * from `outputRatio` once per export.
 */
export const resolveCanvasSize = (
  outputRatio: Ratio,
  outputWidth: number,
): Size => {
  if (!isPositiveSize(outputRatio)) {
    throw new Error(
      `Invalid output ratio: ${outputRatio.width}x${outputRatio.height}. Both sides must be finite and positive.`,
    );
  }

  if (!Number.isFinite(outputWidth) || outputWidth <= 0) {
    throw new Error(`Invalid output width: ${outputWidth}.`);
  }

  return {
    width: outputWidth,
    height: outputWidth / (outputRatio.width / outputRatio.height),
  };
};
