import { describe, expect, it } from 'vitest';

import { defaultCropView } from '~/utils/computeCropRect';
import { coverCrop } from '~/utils/coverCrop';
import type { LayoutNode } from '~/utils/flattenLayoutTree';
import { resolveCanvasSize } from '~/utils/resolveCanvasSize';
import { resolveCollageTiles } from '~/utils/resolveCollageTiles';

import { buildExportPlan } from './index';

const buzz = { width: 15, height: 6 };
const leaf: LayoutNode = { kind: 'leaf' };
const threeColumns: LayoutNode = {
  kind: 'split',
  direction: 'row',
  weights: [1 / 3, 1 / 3, 1 / 3],
  children: [leaf, leaf, leaf],
};

const makeImage = (
  id: string,
  naturalSize: { width: number; height: number },
) => ({
  id,
  naturalSize,
  cropView: defaultCropView(naturalSize),
});

describe('buildExportPlan', () => {
  it('sizes the canvas from the output ratio and width', () => {
    const canvasSize = resolveCanvasSize(buzz, 1500);
    const plan = buildExportPlan(
      [makeImage('a', { width: 4000, height: 1000 })],
      resolveCollageTiles(leaf, buzz, 0),
      canvasSize,
    );

    expect(plan.canvasSize).toEqual({ width: 1500, height: 600 });
  });

  it('gives a single image the full canvas as both source and dest ratio', () => {
    const source = { width: 4000, height: 1000 };
    const canvasSize = resolveCanvasSize(buzz, 1500);
    const plan = buildExportPlan(
      [makeImage('a', source)],
      resolveCollageTiles(leaf, buzz, 0),
      canvasSize,
    );

    expect(plan.slots).toHaveLength(1);
    expect(plan.slots[0]?.destRect).toEqual({
      x: 0,
      y: 0,
      width: 1500,
      height: 600,
    });
    expect(plan.slots[0]?.sourceRect).toEqual(coverCrop(source, buzz));
  });

  it('splits three images into equal gapped destination slots', () => {
    const canvasSize = resolveCanvasSize(buzz, 1500);
    const tiles = resolveCollageTiles(threeColumns, buzz, 0.012);
    const plan = buildExportPlan(
      [
        makeImage('a', { width: 2000, height: 3000 }),
        makeImage('b', { width: 3000, height: 2000 }),
        makeImage('c', { width: 1000, height: 1000 }),
      ],
      tiles,
      canvasSize,
    );

    expect(plan.slots).toHaveLength(3);

    const totalSlotWidth = plan.slots
      .map(slot => slot.destRect.width)
      .reduce((sum, width) => sum + width, 0);
    expect(totalSlotWidth).toBeLessThan(1500);

    const [first, second, third] = plan.slots;
    expect(
      (first?.destRect.x ?? 0) + (first?.destRect.width ?? 0),
    ).toBeLessThanOrEqual(second?.destRect.x ?? 0);
    expect(
      (second?.destRect.x ?? 0) + (second?.destRect.width ?? 0),
    ).toBeLessThanOrEqual(third?.destRect.x ?? 0);
  });

  it('gives every image in a three-column layout a 5:6 source crop', () => {
    const canvasSize = resolveCanvasSize(buzz, 1500);
    const tiles = resolveCollageTiles(threeColumns, buzz, 0);
    const plan = buildExportPlan(
      [
        makeImage('a', { width: 2000, height: 3000 }),
        makeImage('b', { width: 3000, height: 2000 }),
        makeImage('c', { width: 1000, height: 1000 }),
      ],
      tiles,
      canvasSize,
    );

    plan.slots.forEach(slot => {
      expect(slot.sourceRect.width / slot.sourceRect.height).toBeCloseTo(
        5 / 6,
        10,
      );
    });
  });

  it('applies no gap for a single image', () => {
    const canvasSize = resolveCanvasSize(buzz, 1500);
    const plan = buildExportPlan(
      [makeImage('a', { width: 1500, height: 600 })],
      resolveCollageTiles(leaf, buzz, 0),
      canvasSize,
    );
    expect(plan.slots[0]?.destRect).toEqual({
      x: 0,
      y: 0,
      width: 1500,
      height: 600,
    });
  });

  it('throws on an empty image list', () => {
    expect(() =>
      buildExportPlan([], [], resolveCanvasSize(buzz, 1500)),
    ).toThrow(/no images/);
  });

  it('throws when the number of images and tiles differ', () => {
    expect(() =>
      buildExportPlan(
        [makeImage('a', { width: 100, height: 100 })],
        resolveCollageTiles(threeColumns, buzz, 0),
        resolveCanvasSize(buzz, 1500),
      ),
    ).toThrow(/images but 3 tiles/);
  });

  it('throws on an invalid canvas size', () => {
    expect(() =>
      buildExportPlan(
        [makeImage('a', { width: 100, height: 100 })],
        resolveCollageTiles(leaf, buzz, 0),
        { width: 0, height: 0 },
      ),
    ).toThrow(/Invalid canvas size/);
  });
});
