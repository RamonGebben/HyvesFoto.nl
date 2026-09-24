import { describe, expect, it } from 'vitest';

import { isPositiveSize, rectToSize, toRatioValue } from './index';

describe('isPositiveSize', () => {
  it('accepts a size with both sides above zero', () => {
    expect(isPositiveSize({ width: 15, height: 6 })).toBe(true);
  });

  it.each([
    ['zero width', { width: 0, height: 6 }],
    ['negative height', { width: 15, height: -1 }],
    ['non-finite width', { width: Number.POSITIVE_INFINITY, height: 6 }],
    ['NaN height', { width: 15, height: Number.NaN }],
  ])('rejects %s', (_label, size) => {
    expect(isPositiveSize(size)).toBe(false);
  });
});

describe('toRatioValue', () => {
  it('converts the Hyves timeline ratio to 2.5', () => {
    expect(toRatioValue({ width: 15, height: 6 })).toBe(2.5);
  });

  it('is scale-invariant', () => {
    expect(toRatioValue({ width: 30, height: 12 })).toBe(
      toRatioValue({ width: 15, height: 6 }),
    );
  });

  it('throws rather than returning NaN or Infinity', () => {
    expect(() => toRatioValue({ width: 15, height: 0 })).toThrow(/Invalid/);
    expect(() => toRatioValue({ width: -1, height: 6 })).toThrow(/Invalid/);
  });
});

describe('rectToSize', () => {
  it('drops the position', () => {
    expect(rectToSize({ x: 4, y: 8, width: 15, height: 6 })).toEqual({
      width: 15,
      height: 6,
    });
  });
});
