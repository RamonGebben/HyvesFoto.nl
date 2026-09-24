import { describe, expect, it } from 'vitest';

import { computeMobileCutoff } from './index';

const desktop = { width: 52, height: 25 }; // Buzz, ≈2.08
const mobile = { width: 311, height: 200 }; // ≈1.56

describe('computeMobileCutoff', () => {
  it('splits the cut evenly between the left and right edges', () => {
    const { leftPercent, rightPercent } = computeMobileCutoff(desktop, mobile);

    expect(leftPercent).toBeCloseTo(12.62, 1);
    expect(rightPercent).toBeCloseTo(12.62, 1);
  });

  it('returns zero on both sides when the ratios match', () => {
    expect(computeMobileCutoff(desktop, desktop)).toEqual({
      leftPercent: 0,
      rightPercent: 0,
    });
  });

  it('throws when the mobile ratio is wider than the desktop ratio', () => {
    expect(() => computeMobileCutoff(mobile, desktop)).toThrow(
      /must not be wider than desktop ratio/,
    );
  });

  it('throws on a degenerate ratio instead of emitting NaN', () => {
    expect(() => computeMobileCutoff({ width: 0, height: 6 }, mobile)).toThrow(
      /Invalid ratio/,
    );
  });
});
