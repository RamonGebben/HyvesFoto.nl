import type { LayoutNode } from '~/utils/flattenLayoutTree';

const leaf: LayoutNode = { kind: 'leaf' };

const evenSplit = (
  direction: 'row' | 'column',
  children: readonly LayoutNode[],
): LayoutNode => ({
  kind: 'split',
  direction,
  weights: children.map(() => 1 / children.length),
  children,
});

/**
 * A plain rows-of-columns grid for `n` images — the fallback layout for
 * image counts beyond the curated library in `~/content/collageLayouts`
 * (see `~/utils/collageLayoutOptions`), since hand-authoring several
 * magazine-style variants per count stops scaling somewhere.
 *
 * `cols = ceil(sqrt(n))`, `rows = ceil(n/cols)` keeps the grid close to
 * square, but `cols * rows` generally overshoots `n` (7 images -> 3x3 = 9
 * cells) — so this always produces exactly `n` leaves by giving the last
 * row whatever is left over, its tiles proportionally wider so the row
 * still spans the full width.
 */
export const generateUniformGridLayout = (n: number): LayoutNode => {
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(`Invalid image count: ${n}. Expected a positive integer.`);
  }

  if (n === 1) {
    return leaf;
  }

  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);

  const rowNodes = Array.from({ length: rows }, (_unused, rowIndex) => {
    const count = Math.min(cols, n - rowIndex * cols);
    return count === 1
      ? leaf
      : evenSplit(
          'row',
          Array.from({ length: count }, () => leaf),
        );
  });

  return rows === 1 ? rowNodes[0]! : evenSplit('column', rowNodes);
};
