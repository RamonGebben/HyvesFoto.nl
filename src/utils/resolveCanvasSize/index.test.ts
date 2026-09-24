import { describe, expect, it } from 'vitest';

import { resolveCanvasSize } from './index';

const buzz = { width: 15, height: 6 };

describe('resolveCanvasSize', () => {
  it('sizes the canvas from the output ratio and width', () => {
    expect(resolveCanvasSize(buzz, 1500)).toEqual({
      width: 1500,
      height: 600,
    });
  });

  it('throws on an invalid ratio', () => {
    expect(() => resolveCanvasSize({ width: 0, height: 6 }, 1500)).toThrow(
      /Invalid output ratio/,
    );
  });

  it('throws on a non-positive output width', () => {
    expect(() => resolveCanvasSize(buzz, 0)).toThrow(/Invalid output width/);
    expect(() => resolveCanvasSize(buzz, -100)).toThrow(/Invalid output width/);
  });
});
