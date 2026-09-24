import { describe, expect, it } from 'vitest';

import { clamp } from './index';

describe('clamp', () => {
  it('leaves a value inside the range untouched', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('pulls a value up to the minimum', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it('pulls a value down to the maximum', () => {
    expect(clamp(42, 0, 10)).toBe(10);
  });

  it('treats the bounds as inclusive', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it('throws on an inverted range instead of silently picking a bound', () => {
    expect(() => clamp(5, 10, 0)).toThrow(/Invalid range/);
  });
});
