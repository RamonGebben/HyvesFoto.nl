import { describe, expect, it } from 'vitest';

import { coverCrop } from '~/utils/coverCrop';

import { computeCropRect, defaultCropView, MAX_ZOOM, MIN_ZOOM } from './index';

const buzz = { width: 15, height: 6 };

describe('defaultCropView', () => {
  it('starts fully zoomed out', () => {
    expect(defaultCropView({ width: 4000, height: 1000 }).zoom).toBe(1);
  });

  it('centres on the source regardless of its own shape', () => {
    expect(defaultCropView({ width: 4000, height: 1000 }).center).toEqual({
      x: 2000,
      y: 500,
    });
    expect(defaultCropView({ width: 3000, height: 4000 }).center).toEqual({
      x: 1500,
      y: 2000,
    });
  });

  it('throws on a degenerate source', () => {
    expect(() => defaultCropView({ width: 0, height: 600 })).toThrow(
      /Invalid source size/,
    );
  });
});

describe('computeCropRect', () => {
  const source = { width: 4000, height: 1000 };

  it('matches coverCrop exactly at zoom 1', () => {
    const view = defaultCropView(source);
    expect(computeCropRect(source, buzz, view)).toEqual(
      coverCrop(source, buzz),
    );
  });

  it('halves both dimensions at zoom 2, around the given center', () => {
    const base = coverCrop(source, buzz);
    const view = { zoom: 2, center: defaultCropView(source).center };
    const rect = computeCropRect(source, buzz, view);

    expect(rect.width).toBeCloseTo(base.width / 2, 10);
    expect(rect.height).toBeCloseTo(base.height / 2, 10);
  });

  it('keeps the requested ratio at every zoom level', () => {
    const view = { zoom: 3, center: defaultCropView(source).center };
    const rect = computeCropRect(source, buzz, view);
    expect(rect.width / rect.height).toBeCloseTo(2.5, 10);
  });

  it('clamps zoom below the minimum instead of growing past coverCrop', () => {
    const view = { zoom: 0.2, center: defaultCropView(source).center };
    expect(computeCropRect(source, buzz, view)).toEqual(
      coverCrop(source, buzz),
    );
  });

  it('clamps zoom above the maximum', () => {
    const view = { zoom: 999, center: defaultCropView(source).center };
    const rectAtMax = computeCropRect(source, buzz, {
      zoom: MAX_ZOOM,
      center: defaultCropView(source).center,
    });
    expect(computeCropRect(source, buzz, view)).toEqual(rectAtMax);
  });

  it('never lets the rect leave the source when centered near an edge', () => {
    const view = { zoom: MAX_ZOOM, center: { x: 0, y: 0 } };
    const rect = computeCropRect(source, buzz, view);

    expect(rect.x).toBeGreaterThanOrEqual(0);
    expect(rect.y).toBeGreaterThanOrEqual(0);
    expect(rect.x + rect.width).toBeLessThanOrEqual(source.width);
    expect(rect.y + rect.height).toBeLessThanOrEqual(source.height);
  });

  it('stays sane when the center is dragged far outside the source', () => {
    const view = { zoom: MIN_ZOOM, center: { x: -5000, y: 5000 } };
    const rect = computeCropRect(source, buzz, view);

    expect(rect.x).toBe(0);
    expect(rect.x + rect.width).toBeLessThanOrEqual(source.width);
  });
});
