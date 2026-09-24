/**
 * Decodes an image URL into a `HTMLImageElement`, ready for `drawImage`.
 *
 * Browser-only IO — jsdom's `<img>` never actually decodes bytes, so this is
 * not part of the `unit` test project. Exercised through Storybook and e2e.
 */
export const loadImageElement = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error(`Could not decode image at ${src}.`));
    image.src = src;
  });
