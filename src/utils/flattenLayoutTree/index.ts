import { isPositiveSize } from '~/utils/geometry';
import type { Ratio, Rect } from '~/utils/geometry';

export type LayoutLeaf = { readonly kind: 'leaf' };

export type LayoutSplit = {
  readonly kind: 'split';
  /** row = children side by side; column = children stacked. */
  readonly direction: 'row' | 'column';
  /** One weight per child, summing to 1 (epsilon-tolerant). */
  readonly weights: readonly number[];
  readonly children: readonly LayoutNode[];
};

export type LayoutNode = LayoutLeaf | LayoutSplit;

const WEIGHT_SUM_EPSILON = 1e-6;

const flattenNode = (
  node: LayoutNode,
  bounds: Rect,
  gap: { readonly x: number; readonly y: number },
): readonly Rect[] => {
  if (node.kind === 'leaf') {
    if (!(bounds.width > 0) || !(bounds.height > 0)) {
      throw new Error(
        `Layout gap leaves no room for a tile (${bounds.width}x${bounds.height}).`,
      );
    }
    return [bounds];
  }

  const { direction, weights, children } = node;

  if (children.length === 0) {
    throw new Error('A split must have at least one child.');
  }

  if (weights.length !== children.length) {
    throw new Error(
      `A split has ${children.length} children but ${weights.length} weights.`,
    );
  }

  if (weights.some(weight => !(weight > 0))) {
    throw new Error('Split weights must all be positive.');
  }

  const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
  if (Math.abs(weightSum - 1) > WEIGHT_SUM_EPSILON) {
    throw new Error(`Split weights must sum to 1, got ${weightSum}.`);
  }

  const axisGap = direction === 'row' ? gap.x : gap.y;
  const available =
    (direction === 'row' ? bounds.width : bounds.height) -
    axisGap * (children.length - 1);

  if (!(available > 0)) {
    throw new Error(
      `A gap of ${axisGap} leaves no room for ${children.length} tiles.`,
    );
  }

  let offset = direction === 'row' ? bounds.x : bounds.y;

  return children.flatMap((child, index) => {
    const size = weights[index]! * available;
    const childBounds: Rect =
      direction === 'row'
        ? { x: offset, y: bounds.y, width: size, height: bounds.height }
        : { x: bounds.x, y: offset, width: bounds.width, height: size };

    offset += size + axisGap;

    return flattenNode(child, childBounds, gap);
  });
};

/**
 * Resolves a layout tree to normalized (0..1) tile rects, in depth-first
 * leaf order — leaf `i` pairs with `images[i]`.
 *
 * The gap is baked directly into each split's arithmetic (subtracted from
 * the available space before weights are distributed), not applied as a
 * post-hoc inset on every leaf. That matters: an inset-every-side approach
 * would also pull tiles away from the canvas' own outer edges, breaking
 * "the grid always fills the output ratio." Baking it into the split means
 * a gap only ever appears *between* adjacent tiles, at any nesting depth —
 * the canvas' own edges stay flush at any gap value, including 0.
 *
 * A gap expressed as a fraction of canvas width needs a different fraction
 * on the y-axis to read as the same absolute pixel thickness, since the
 * canvas itself is not square — `gap.y = gapRatio * canvasAspect`.
 */
export const flattenLayoutTree = (
  node: LayoutNode,
  outputRatio: Ratio,
  gapRatio: number,
): readonly Rect[] => {
  if (!isPositiveSize(outputRatio)) {
    throw new Error(
      `Invalid output ratio: ${outputRatio.width}x${outputRatio.height}. Both sides must be finite and positive.`,
    );
  }

  if (!Number.isFinite(gapRatio) || gapRatio < 0) {
    throw new Error(
      `Invalid gap ratio: ${gapRatio}. Expected a non-negative number.`,
    );
  }

  const canvasAspect = outputRatio.width / outputRatio.height;
  const gap = { x: gapRatio, y: gapRatio * canvasAspect };

  return flattenNode(node, { x: 0, y: 0, width: 1, height: 1 }, gap);
};
