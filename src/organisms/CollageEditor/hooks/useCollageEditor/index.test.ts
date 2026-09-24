import { describe, expect, it } from 'vitest';

import { toStoredImages } from './index';

const makeFile = (name: string) =>
  new File(['bytes'], name, { type: 'image/jpeg' });

describe('toStoredImages', () => {
  const options = {
    createId: (() => {
      let counter = 0;
      return () => `id-${++counter}`;
    })(),
    now: () => 1_700_000_000_000,
  };

  it('maps each file to a storable record', () => {
    const [first] = toStoredImages([makeFile('strand.jpg')], options);

    expect(first?.name).toBe('strand.jpg');
    expect(first?.id).toMatch(/^id-\d+$/);
    expect(first?.blob).toBeInstanceOf(Blob);
  });

  it('gives every file a distinct id', () => {
    const stored = toStoredImages(
      [makeFile('a.jpg'), makeFile('b.jpg'), makeFile('c.jpg')],
      options,
    );

    expect(new Set(stored.map(image => image.id)).size).toBe(3);
  });

  it('staggers createdAt so a multi-file drop keeps its order', () => {
    const stored = toStoredImages(
      [makeFile('a.jpg'), makeFile('b.jpg'), makeFile('c.jpg')],
      options,
    );

    const timestamps = stored.map(image => image.createdAt);
    expect(timestamps).toEqual([...timestamps].sort((a, b) => a - b));
    expect(new Set(timestamps).size).toBe(3);
  });

  it('handles an empty drop', () => {
    expect(toStoredImages([], options)).toEqual([]);
  });
});
