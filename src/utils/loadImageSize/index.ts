import type { Size } from '~/utils/geometry';
import { loadImageElement } from '~/utils/loadImageElement';

/**
 * Decodes just enough of an image to know its pixel dimensions.
 *
 * Browser-only IO, so — like `loadImageElement` — it is not part of the
 * `unit` test project. Exercised through Storybook and e2e.
 */
export const loadImageSize = async (src: string): Promise<Size> => {
  const image = await loadImageElement(src);
  return { width: image.naturalWidth, height: image.naturalHeight };
};
