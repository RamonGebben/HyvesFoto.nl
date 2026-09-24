import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

/**
 * Durable storage for the images a user dropped in.
 *
 * Images are far too large for localStorage and must survive a refresh or an
 * accidental tab close, so they live as Blobs in IndexedDB. This layer is
 * deliberately generic — it knows about images, not about crops or collages —
 * so the editing model can change without a migration.
 */

export type StoredImage = {
  readonly id: string;
  readonly name: string;
  readonly blob: Blob;
  readonly createdAt: number;
};

type ImageStoreSchema = DBSchema & {
  images: {
    key: string;
    value: StoredImage;
    indexes: { createdAt: number };
  };
};

const DATABASE_NAME = 'hyves-collage';
const DATABASE_VERSION = 1;
const STORE_NAME = 'images';

let databasePromise: Promise<IDBPDatabase<ImageStoreSchema>> | undefined;

const getDatabase = (): Promise<IDBPDatabase<ImageStoreSchema>> => {
  databasePromise ??= openDB<ImageStoreSchema>(
    DATABASE_NAME,
    DATABASE_VERSION,
    {
      upgrade(database) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt');
      },
    },
  );

  return databasePromise;
};

export const putImage = async (image: StoredImage): Promise<void> => {
  const database = await getDatabase();
  await database.put(STORE_NAME, image);
};

export const getImage = async (
  id: string,
): Promise<StoredImage | undefined> => {
  const database = await getDatabase();
  return database.get(STORE_NAME, id);
};

/** Oldest first, so the editor restores images in the order they were added. */
export const listImages = async (): Promise<readonly StoredImage[]> => {
  const database = await getDatabase();
  return database.getAllFromIndex(STORE_NAME, 'createdAt');
};

export const deleteImage = async (id: string): Promise<void> => {
  const database = await getDatabase();
  await database.delete(STORE_NAME, id);
};

export const clearImages = async (): Promise<void> => {
  const database = await getDatabase();
  await database.clear(STORE_NAME);
};

/** Test-only: drops the cached connection so a fresh fake DB can be opened. */
export const resetImageStoreConnection = (): void => {
  databasePromise = undefined;
};
