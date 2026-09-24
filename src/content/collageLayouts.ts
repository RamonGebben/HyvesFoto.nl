import type { LayoutNode } from '~/utils/flattenLayoutTree';

export type CollageLayoutOption = {
  readonly id: string;
  readonly label: string;
  readonly imageCount: number;
  readonly tree: LayoutNode;
};

const leaf: LayoutNode = { kind: 'leaf' };

const leaves = (count: number): readonly LayoutNode[] =>
  Array.from({ length: count }, () => leaf);

const evenSplit = (
  direction: 'row' | 'column',
  children: readonly LayoutNode[],
): LayoutNode => ({
  kind: 'split',
  direction,
  weights: children.map(() => 1 / children.length),
  children,
});

const evenRow = (count: number): LayoutNode => evenSplit('row', leaves(count));
const evenColumn = (count: number): LayoutNode =>
  evenSplit('column', leaves(count));

const weightedSplit = (
  direction: 'row' | 'column',
  parts: readonly { readonly weight: number; readonly node: LayoutNode }[],
): LayoutNode => ({
  kind: 'split',
  direction,
  weights: parts.map(part => part.weight),
  children: parts.map(part => part.node),
});

/**
 * Hand-authored grid layout options, curated for image counts 1 through 6 —
 * a mix of plain uniform grids and magazine-style asymmetric splits, so
 * every photo count offers a genuine choice of shapes. Beyond 6 images,
 * `getLayoutOptionsForCount` (in `~/utils/collageLayoutOptions`) falls back
 * to a single generated grid instead — hand-authoring stops scaling there.
 */
export const collageLayoutOptions: readonly CollageLayoutOption[] = [
  { id: '1-full', label: 'Volledig', imageCount: 1, tree: leaf },

  { id: '2-columns', label: '2 kolommen', imageCount: 2, tree: evenRow(2) },
  { id: '2-rows', label: '2 rijen', imageCount: 2, tree: evenColumn(2) },

  { id: '3-columns', label: '3 kolommen', imageCount: 3, tree: evenRow(3) },
  {
    id: '3-big-left',
    label: 'Groot links',
    imageCount: 3,
    tree: weightedSplit('row', [
      { weight: 0.6, node: leaf },
      { weight: 0.4, node: evenColumn(2) },
    ]),
  },
  { id: '3-rows', label: '3 rijen', imageCount: 3, tree: evenColumn(3) },
  {
    id: '3-big-top',
    label: 'Groot boven',
    imageCount: 3,
    tree: weightedSplit('column', [
      { weight: 0.6, node: leaf },
      { weight: 0.4, node: evenRow(2) },
    ]),
  },

  {
    id: '4-grid',
    label: 'Raster 2x2',
    imageCount: 4,
    tree: evenSplit('column', [evenRow(2), evenRow(2)]),
  },
  { id: '4-columns', label: '4 kolommen', imageCount: 4, tree: evenRow(4) },
  {
    id: '4-big-left',
    label: 'Groot links',
    imageCount: 4,
    tree: weightedSplit('row', [
      { weight: 0.5, node: leaf },
      { weight: 0.5, node: evenColumn(3) },
    ]),
  },
  {
    id: '4-big-top',
    label: 'Groot boven',
    imageCount: 4,
    tree: weightedSplit('column', [
      { weight: 0.5, node: leaf },
      { weight: 0.5, node: evenRow(3) },
    ]),
  },

  { id: '5-columns', label: '5 kolommen', imageCount: 5, tree: evenRow(5) },
  {
    id: '5-two-rows',
    label: '3 boven, 2 onder',
    imageCount: 5,
    tree: evenSplit('column', [evenRow(3), evenRow(2)]),
  },
  {
    id: '5-big-left',
    label: 'Groot links',
    imageCount: 5,
    tree: weightedSplit('row', [
      { weight: 0.5, node: leaf },
      { weight: 0.5, node: evenSplit('column', [evenRow(2), evenRow(2)]) },
    ]),
  },

  {
    id: '6-grid-3x2',
    label: 'Raster 3x2',
    imageCount: 6,
    tree: evenSplit('column', [evenRow(3), evenRow(3)]),
  },
  {
    id: '6-grid-2x3',
    label: 'Raster 2x3',
    imageCount: 6,
    tree: evenSplit('column', [evenRow(2), evenRow(2), evenRow(2)]),
  },
  { id: '6-columns', label: '6 kolommen', imageCount: 6, tree: evenRow(6) },
  {
    id: '6-big-left',
    label: 'Groot links',
    imageCount: 6,
    tree: weightedSplit('row', [
      { weight: 0.5, node: leaf },
      { weight: 0.5, node: evenColumn(5) },
    ]),
  },
];
