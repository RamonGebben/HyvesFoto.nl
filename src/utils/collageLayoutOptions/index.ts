import { collageLayoutOptions } from '~/content/collageLayouts';
import type { CollageLayoutOption } from '~/content/collageLayouts';
import { generateUniformGridLayout } from '~/utils/generateUniformGridLayout';

const MAX_CURATED_IMAGE_COUNT = 6;

/**
 * The layout choices offered for `n` images: curated hand-authored options
 * up to `MAX_CURATED_IMAGE_COUNT`, or a single generated grid beyond that —
 * hand-authoring several magazine-style variants per count stops scaling
 * past that point.
 */
export const getLayoutOptionsForCount = (
  n: number,
): readonly CollageLayoutOption[] => {
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(`Invalid image count: ${n}. Expected a positive integer.`);
  }

  if (n <= MAX_CURATED_IMAGE_COUNT) {
    const options = collageLayoutOptions.filter(
      option => option.imageCount === n,
    );

    if (options.length === 0) {
      throw new Error(`No curated layout options for ${n} images.`);
    }

    return options;
  }

  return [
    {
      id: 'grid',
      label: 'Raster',
      imageCount: n,
      tree: generateUniformGridLayout(n),
    },
  ];
};
