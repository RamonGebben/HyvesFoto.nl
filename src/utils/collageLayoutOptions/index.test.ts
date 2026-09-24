import { describe, expect, it } from 'vitest';

import { flattenLayoutTree } from '~/utils/flattenLayoutTree';

import { getLayoutOptionsForCount } from './index';

const buzz = { width: 15, height: 6 };

describe('getLayoutOptionsForCount', () => {
  it('returns multiple curated variants for counts with more than one shape', () => {
    const options = getLayoutOptionsForCount(3);
    expect(options.length).toBeGreaterThan(1);
    options.forEach(option => expect(option.imageCount).toBe(3));
  });

  it('every curated option resolves to exactly imageCount tiles covering the canvas', () => {
    for (let n = 1; n <= 6; n += 1) {
      getLayoutOptionsForCount(n).forEach(option => {
        const rects = flattenLayoutTree(option.tree, buzz, 0);
        expect(rects).toHaveLength(option.imageCount);

        const totalArea = rects.reduce(
          (sum, rect) => sum + rect.width * rect.height,
          0,
        );
        expect(totalArea).toBeCloseTo(1, 10);
      });
    }
  });

  it('falls back to a single generated grid beyond the curated range', () => {
    const options = getLayoutOptionsForCount(9);
    expect(options).toHaveLength(1);
    expect(flattenLayoutTree(options[0]!.tree, buzz, 0)).toHaveLength(9);
  });

  it('throws on a non-positive or non-integer count', () => {
    expect(() => getLayoutOptionsForCount(0)).toThrow(/image count/i);
    expect(() => getLayoutOptionsForCount(1.5)).toThrow(/image count/i);
  });
});
