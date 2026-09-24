import { describe, expect, it } from 'vitest';

import { coverCrop } from './index';

const hyvesTimeline = { width: 15, height: 6 };

describe('coverCrop', () => {
  it('trims the sides of a source wider than the target', () => {
    // 4000x1000 (4:1) cropped to 2.5:1 -> 2500x1000, centred horizontally.
    expect(coverCrop({ width: 4000, height: 1000 }, hyvesTimeline)).toEqual({
      x: 750,
      y: 0,
      width: 2500,
      height: 1000,
    });
  });

  it('trims the top and bottom of a portrait source', () => {
    // A phone photo: 3000x4000 -> full width, 1200 tall, centred vertically.
    expect(coverCrop({ width: 3000, height: 4000 }, hyvesTimeline)).toEqual({
      x: 0,
      y: 1400,
      width: 3000,
      height: 1200,
    });
  });

  it('returns the whole image when it already matches the target', () => {
    expect(coverCrop({ width: 1500, height: 600 }, hyvesTimeline)).toEqual({
      x: 0,
      y: 0,
      width: 1500,
      height: 600,
    });
  });

  it('never scales beyond the source bounds', () => {
    const source = { width: 800, height: 1200 };
    const crop = coverCrop(source, hyvesTimeline);

    expect(crop.x).toBeGreaterThanOrEqual(0);
    expect(crop.y).toBeGreaterThanOrEqual(0);
    expect(crop.x + crop.width).toBeLessThanOrEqual(source.width);
    expect(crop.y + crop.height).toBeLessThanOrEqual(source.height);
  });

  it('produces a rect matching the requested ratio', () => {
    const crop = coverCrop({ width: 1234, height: 987 }, hyvesTimeline);
    expect(crop.width / crop.height).toBeCloseTo(2.5, 10);
  });

  it('throws on a degenerate source instead of emitting NaN', () => {
    expect(() => coverCrop({ width: 0, height: 600 }, hyvesTimeline)).toThrow(
      /Invalid source size/,
    );
  });
});
