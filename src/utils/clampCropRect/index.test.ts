import { describe, expect, it } from 'vitest';

import { clampCropRect } from './index';

const bounds = { width: 1000, height: 800 };

describe('clampCropRect', () => {
  it('leaves a rect already inside the bounds untouched', () => {
    const crop = { x: 100, y: 100, width: 500, height: 200 };
    expect(clampCropRect(crop, bounds)).toEqual(crop);
  });

  it('pushes a rect dragged past the right edge back inside', () => {
    expect(
      clampCropRect({ x: 900, y: 0, width: 500, height: 200 }, bounds),
    ).toEqual({ x: 500, y: 0, width: 500, height: 200 });
  });

  it('pushes a rect dragged past the top-left corner back inside', () => {
    expect(
      clampCropRect({ x: -50, y: -30, width: 500, height: 200 }, bounds),
    ).toEqual({ x: 0, y: 0, width: 500, height: 200 });
  });

  it('shrinks a rect larger than the bounds rather than overflowing', () => {
    expect(
      clampCropRect({ x: 0, y: 0, width: 4000, height: 4000 }, bounds),
    ).toEqual({ x: 0, y: 0, width: 1000, height: 800 });
  });

  it('never grows a rect that is smaller than the bounds', () => {
    const crop = { x: 10, y: 10, width: 20, height: 20 };
    const clamped = clampCropRect(crop, bounds);

    expect(clamped.width).toBe(20);
    expect(clamped.height).toBe(20);
  });

  it('throws on degenerate bounds', () => {
    expect(() =>
      clampCropRect(
        { x: 0, y: 0, width: 10, height: 10 },
        { width: 0, height: 800 },
      ),
    ).toThrow(/Invalid bounds/);
  });
});
