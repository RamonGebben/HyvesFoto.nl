import { describe, expect, it } from 'vitest';

import { flattenLayoutTree } from './index';
import type { LayoutNode } from './index';

const buzz = { width: 15, height: 6 };
const canvasAspect = buzz.width / buzz.height;

const row = (children: readonly LayoutNode[]): LayoutNode => ({
  kind: 'split',
  direction: 'row',
  weights: children.map(() => 1 / children.length),
  children,
});

const column = (children: readonly LayoutNode[]): LayoutNode => ({
  kind: 'split',
  direction: 'column',
  weights: children.map(() => 1 / children.length),
  children,
});

const leaf: LayoutNode = { kind: 'leaf' };
const leaves = (count: number) => Array.from({ length: count }, () => leaf);

describe('flattenLayoutTree', () => {
  it('gives a single leaf the full unit square, regardless of gap', () => {
    expect(flattenLayoutTree(leaf, buzz, 0)).toEqual([
      { x: 0, y: 0, width: 1, height: 1 },
    ]);
    expect(flattenLayoutTree(leaf, buzz, 0.05)).toEqual([
      { x: 0, y: 0, width: 1, height: 1 },
    ]);
  });

  it('splits a row of equal-weight leaves evenly, with no gap', () => {
    const rects = flattenLayoutTree(row(leaves(3)), buzz, 0);

    expect(rects).toEqual([
      { x: 0, y: 0, width: 1 / 3, height: 1 },
      { x: 1 / 3, y: 0, width: 1 / 3, height: 1 },
      { x: 2 / 3, y: 0, width: 1 / 3, height: 1 },
    ]);
  });

  it('applies gap only between tiles, never at the canvas edges', () => {
    const [first, second] = flattenLayoutTree(row(leaves(2)), buzz, 0.1);

    expect(first!.x).toBe(0);
    expect(second!.x + second!.width).toBeCloseTo(1, 10);
    // Full gap sits between them.
    expect(second!.x - (first!.x + first!.width)).toBeCloseTo(0.1, 10);
  });

  it('converts gap to an aspect-corrected fraction on the y-axis', () => {
    const [first, second] = flattenLayoutTree(column(leaves(2)), buzz, 0.1);

    expect(first!.y).toBe(0);
    expect(second!.y + second!.height).toBeCloseTo(1, 10);
    expect(second!.y - (first!.y + first!.height)).toBeCloseTo(
      0.1 * canvasAspect,
      10,
    );
  });

  it('covers the full unit square exactly when gap is 0, for a nested tree', () => {
    const tree = row([leaf, column(leaves(2))]);
    const rects = flattenLayoutTree(tree, buzz, 0);

    const totalArea = rects.reduce(
      (sum, rect) => sum + rect.width * rect.height,
      0,
    );
    expect(totalArea).toBeCloseTo(1, 10);
    expect(rects).toHaveLength(3);
  });

  it('produces one rect per leaf, in depth-first order', () => {
    const tree = column([row(leaves(2)), leaf]);
    expect(flattenLayoutTree(tree, buzz, 0)).toHaveLength(3);
  });

  it('throws on a negative gap ratio', () => {
    expect(() => flattenLayoutTree(leaf, buzz, -0.01)).toThrow(/gap ratio/i);
  });

  it('throws when weights do not sum to 1', () => {
    const bad: LayoutNode = {
      kind: 'split',
      direction: 'row',
      weights: [0.5, 0.6],
      children: leaves(2),
    };
    expect(() => flattenLayoutTree(bad, buzz, 0)).toThrow(/sum to 1/);
  });

  it('throws when a gap leaves no room for the tiles', () => {
    expect(() => flattenLayoutTree(row(leaves(4)), buzz, 0.5)).toThrow(
      /no room/,
    );
  });
});
