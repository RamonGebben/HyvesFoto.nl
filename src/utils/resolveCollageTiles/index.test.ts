import { describe, expect, it } from 'vitest';

import type { LayoutNode } from '~/utils/flattenLayoutTree';

import { resolveCollageTiles } from './index';

const buzz = { width: 15, height: 6 };
const leaf: LayoutNode = { kind: 'leaf' };

describe('resolveCollageTiles', () => {
  it('gives a single tile the full output ratio, unchanged', () => {
    const [tile] = resolveCollageTiles(leaf, buzz, 0);

    expect(tile!.rect).toEqual({ x: 0, y: 0, width: 1, height: 1 });
    expect(tile!.ratio.width / tile!.ratio.height).toBeCloseTo(
      buzz.width / buzz.height,
      10,
    );
  });

  it('gives three equal columns the same 5:6 ratio the old fixed collage used', () => {
    const threeColumns: LayoutNode = {
      kind: 'split',
      direction: 'row',
      weights: [1 / 3, 1 / 3, 1 / 3],
      children: [leaf, leaf, leaf],
    };

    const tiles = resolveCollageTiles(threeColumns, buzz, 0);

    expect(tiles).toHaveLength(3);
    tiles.forEach(tile => {
      expect(tile.ratio.width / tile.ratio.height).toBeCloseTo(5 / 6, 10);
    });
  });

  it('derives a tall tile from a row-vs-column split correctly', () => {
    const twoRows: LayoutNode = {
      kind: 'split',
      direction: 'column',
      weights: [0.5, 0.5],
      children: [leaf, leaf],
    };

    const tiles = resolveCollageTiles(twoRows, buzz, 0);

    // Full width, half height -> twice as wide as the output ratio.
    expect(tiles[0]!.ratio.width / tiles[0]!.ratio.height).toBeCloseTo(
      (buzz.width / buzz.height) * 2,
      10,
    );
  });
});
