import { describe, expect, it } from 'vitest';

import { formatAspectRatio } from './index';

describe('formatAspectRatio', () => {
  it('formats the Hyves timeline ratio', () => {
    expect(formatAspectRatio({ width: 15, height: 6 })).toBe('15:6');
  });

  it('keeps the authored numbers instead of reducing them', () => {
    // 15:6 and 5:2 are the same shape, but only one is the number people
    // recognise the Hyves timeline by.
    expect(formatAspectRatio({ width: 15, height: 6 })).not.toBe('5:2');
    expect(formatAspectRatio({ width: 1920, height: 1080 })).toBe('1920:1080');
  });

  it('formats a square', () => {
    expect(formatAspectRatio({ width: 1, height: 1 })).toBe('1:1');
  });

  it('normalises non-integer ratios against 1', () => {
    expect(formatAspectRatio({ width: 2.35, height: 1 })).toBe('2.4:1');
    expect(formatAspectRatio({ width: 5, height: 2.5 })).toBe('2:1');
  });

  it('throws on a degenerate ratio', () => {
    expect(() => formatAspectRatio({ width: 15, height: 0 })).toThrow(
      /Invalid ratio/,
    );
    expect(() => formatAspectRatio({ width: -15, height: 6 })).toThrow(
      /Invalid ratio/,
    );
  });
});
