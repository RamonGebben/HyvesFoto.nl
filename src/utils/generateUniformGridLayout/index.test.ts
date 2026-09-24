import { describe, expect, it } from 'vitest';

import { flattenLayoutTree } from '~/utils/flattenLayoutTree';

import { generateUniformGridLayout } from './index';

const buzz = { width: 15, height: 6 };

describe('generateUniformGridLayout', () => {
  it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])(
    'produces exactly n=%i tiles covering the full unit square',
    n => {
      const rects = flattenLayoutTree(generateUniformGridLayout(n), buzz, 0);

      expect(rects).toHaveLength(n);
      rects.forEach(rect => {
        expect(rect.width).toBeGreaterThan(0);
        expect(rect.height).toBeGreaterThan(0);
      });

      const totalArea = rects.reduce(
        (sum, rect) => sum + rect.width * rect.height,
        0,
      );
      expect(totalArea).toBeCloseTo(1, 10);
    },
  );

  it('also works with a gap applied', () => {
    const rects = flattenLayoutTree(generateUniformGridLayout(7), buzz, 0.02);
    expect(rects).toHaveLength(7);
  });

  it('throws on a non-positive or non-integer count', () => {
    expect(() => generateUniformGridLayout(0)).toThrow(/image count/i);
    expect(() => generateUniformGridLayout(-1)).toThrow(/image count/i);
    expect(() => generateUniformGridLayout(1.5)).toThrow(/image count/i);
  });
});
