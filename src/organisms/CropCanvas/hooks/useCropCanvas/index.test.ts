import { describe, expect, it } from 'vitest';

import {
  computeImageDisplayStyle,
  pointDistance,
  pointMidpoint,
  screenDeltaToSourceDelta,
} from './index';

describe('computeImageDisplayStyle', () => {
  it('matches the worked example: a wide source cropped to Buzz', () => {
    // source 4000x1000, cropRect from coverCrop(source, 15:6) at zoom 1.
    const source = { width: 4000, height: 1000 };
    const cropRect = { x: 750, y: 0, width: 2500, height: 1000 };

    expect(computeImageDisplayStyle(source, cropRect)).toEqual({
      widthPercent: 160,
      leftPercent: -30,
      topPercent: 0,
    });
  });

  it('returns 100% and no offset when the crop rect is the whole image', () => {
    const source = { width: 1500, height: 600 };
    expect(computeImageDisplayStyle(source, { x: 0, y: 0, ...source })).toEqual(
      {
        widthPercent: 100,
        leftPercent: 0,
        topPercent: 0,
      },
    );
  });

  it('offsets vertically for a crop that trims top and bottom', () => {
    const source = { width: 3000, height: 4000 };
    const cropRect = { x: 0, y: 1400, width: 3000, height: 1200 };

    const style = computeImageDisplayStyle(source, cropRect);
    expect(style.leftPercent).toBe(0);
    expect(style.topPercent).toBeCloseTo((-1400 / 1200) * 100, 10);
  });

  it('throws on a degenerate source or crop rect', () => {
    expect(() =>
      computeImageDisplayStyle(
        { width: 0, height: 600 },
        { x: 0, y: 0, width: 100, height: 100 },
      ),
    ).toThrow(/Invalid source size/);

    expect(() =>
      computeImageDisplayStyle(
        { width: 100, height: 100 },
        { x: 0, y: 0, width: 0, height: 100 },
      ),
    ).toThrow(/Invalid crop rect/);
  });
});

describe('screenDeltaToSourceDelta', () => {
  it('scales a screen drag into source pixels', () => {
    // container displays 2500 source px across 500 screen px -> 5x scale.
    const cropRect = { x: 0, y: 0, width: 2500, height: 1000 };
    expect(screenDeltaToSourceDelta(cropRect, 500, { x: 10, y: 4 })).toEqual({
      x: 50,
      y: 20,
    });
  });

  it('is a no-op at 1:1 scale', () => {
    const cropRect = { x: 0, y: 0, width: 500, height: 200 };
    expect(screenDeltaToSourceDelta(cropRect, 500, { x: 7, y: -3 })).toEqual({
      x: 7,
      y: -3,
    });
  });

  it('throws on an invalid container width', () => {
    const cropRect = { x: 0, y: 0, width: 500, height: 200 };
    expect(() => screenDeltaToSourceDelta(cropRect, 0, { x: 1, y: 1 })).toThrow(
      /Invalid container width/,
    );
    expect(() =>
      screenDeltaToSourceDelta(cropRect, -10, { x: 1, y: 1 }),
    ).toThrow(/Invalid container width/);
  });
});

describe('pointDistance', () => {
  it('measures the straight-line distance between two points', () => {
    expect(pointDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });

  it('is zero for the same point', () => {
    expect(pointDistance({ x: 10, y: 10 }, { x: 10, y: 10 })).toBe(0);
  });
});

describe('pointMidpoint', () => {
  it('averages two points', () => {
    expect(pointMidpoint({ x: 0, y: 0 }, { x: 10, y: 20 })).toEqual({
      x: 5,
      y: 10,
    });
  });
});
