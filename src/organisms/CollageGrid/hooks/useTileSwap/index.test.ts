import { describe, expect, it } from 'vitest';

import { resolveSwapTarget } from './index';

describe('resolveSwapTarget', () => {
  it('returns the swap when dropped on a different tile', () => {
    expect(
      resolveSwapTarget({ active: { id: 'a' }, over: { id: 'b' } }),
    ).toEqual({ fromId: 'a', toId: 'b' });
  });

  it('returns null when dropped back on the same tile', () => {
    expect(
      resolveSwapTarget({ active: { id: 'a' }, over: { id: 'a' } }),
    ).toBeNull();
  });

  it('returns null when dropped outside any tile', () => {
    expect(resolveSwapTarget({ active: { id: 'a' }, over: null })).toBeNull();
  });

  it('coerces numeric ids to strings', () => {
    expect(resolveSwapTarget({ active: { id: 1 }, over: { id: 2 } })).toEqual({
      fromId: '1',
      toId: '2',
    });
  });
});
