import { flattenLayoutTree } from '~/utils/flattenLayoutTree';
import type { LayoutNode } from '~/utils/flattenLayoutTree';
import type { Ratio, Rect } from '~/utils/geometry';

export type CollageTile = {
  /** Normalized 0..1 rect on the output canvas, gap already applied. */
  readonly rect: Rect;
  /** The crop ratio this tile implies for whichever image lands on it. */
  readonly ratio: Ratio;
};

/**
 * Resolves a layout tree into tiles ready for both on-screen percentage
 * positioning and the export canvas.
 *
 * A tile's crop ratio comes directly from its own normalized rect: since
 * `rect.width`/`rect.height` are fractions of the canvas' width/height
 * respectively, and the canvas' own width/height ratio is `canvasAspect`,
 * the tile's true on-canvas pixel aspect ratio is
 * `(rect.width * canvasAspect) / rect.height`. A single full-bleed tile
 * (n=1) works out to `outputRatio` itself, unchanged — the same shared
 * formula covers a lone photo and every tile of a magazine layout.
 */
export const resolveCollageTiles = (
  tree: LayoutNode,
  outputRatio: Ratio,
  gapRatio: number,
): readonly CollageTile[] => {
  const canvasAspect = outputRatio.width / outputRatio.height;
  const tiles = flattenLayoutTree(tree, outputRatio, gapRatio);

  return tiles.map(rect => ({
    rect,
    ratio: { width: rect.width * canvasAspect, height: rect.height },
  }));
};
