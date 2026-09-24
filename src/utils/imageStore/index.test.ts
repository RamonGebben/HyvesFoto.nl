import 'fake-indexeddb/auto';

import { beforeEach, describe, expect, it } from 'vitest';

import {
  clearImages,
  deleteImage,
  getImage,
  listImages,
  putImage,
  resetImageStoreConnection,
} from './index';

const makeImage = (id: string, createdAt: number) => ({
  id,
  name: `${id}.jpg`,
  blob: new Blob(['fake-jpeg-bytes'], { type: 'image/jpeg' }),
  createdAt,
});

describe('imageStore', () => {
  beforeEach(async () => {
    resetImageStoreConnection();
    await clearImages();
  });

  it('round-trips an image', async () => {
    await putImage(makeImage('a', 1));

    const stored = await getImage('a');
    expect(stored?.name).toBe('a.jpg');
    expect(await stored?.blob.text()).toBe('fake-jpeg-bytes');
  });

  it('returns undefined for an unknown id', async () => {
    expect(await getImage('missing')).toBeUndefined();
  });

  it('lists images oldest first', async () => {
    await putImage(makeImage('second', 2000));
    await putImage(makeImage('first', 1000));
    await putImage(makeImage('third', 3000));

    expect((await listImages()).map(image => image.id)).toEqual([
      'first',
      'second',
      'third',
    ]);
  });

  it('overwrites an image stored under the same id', async () => {
    await putImage(makeImage('a', 1));
    await putImage({ ...makeImage('a', 1), name: 'renamed.jpg' });

    expect(await listImages()).toHaveLength(1);
    expect((await getImage('a'))?.name).toBe('renamed.jpg');
  });

  it('deletes a single image without touching the others', async () => {
    await putImage(makeImage('a', 1));
    await putImage(makeImage('b', 2));

    await deleteImage('a');

    expect((await listImages()).map(image => image.id)).toEqual(['b']);
  });

  it('clears every image', async () => {
    await putImage(makeImage('a', 1));
    await putImage(makeImage('b', 2));

    await clearImages();

    expect(await listImages()).toEqual([]);
  });
});
