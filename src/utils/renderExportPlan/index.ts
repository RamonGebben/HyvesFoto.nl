import { palette } from '~/theme';
import type { ExportPlan } from '~/utils/buildExportPlan';

export type ExportImageSource = {
  readonly id: string;
  readonly element: CanvasImageSource;
};

export type ExportFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export type RenderExportOptions = {
  readonly type?: ExportFormat;
  /** 0–1. Ignored for `image/png`. */
  readonly quality?: number;
};

/**
 * Draws an `ExportPlan` to an off-DOM canvas and returns the result as a
 * Blob. Deliberately thin: all the "what goes where" logic already happened
 * in `buildExportPlan`, which is what the unit tests actually exercise. This
 * wrapper needs a real `<canvas>` 2D context, so it is covered by e2e instead.
 */
export const renderExportPlan = (
  plan: ExportPlan,
  sources: readonly ExportImageSource[],
  { type = 'image/jpeg', quality = 0.92 }: RenderExportOptions = {},
): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(plan.canvasSize.width);
  canvas.height = Math.round(plan.canvasSize.height);

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Could not get a 2D canvas context.');
  }

  // Fills any gap between collage slots so it reads as intentional, not
  // as a transparent hole (also the backdrop for a jpeg's opaque canvas).
  context.fillStyle = palette.bg;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const sourceById = new Map(
    sources.map(source => [source.id, source.element]),
  );

  plan.slots.forEach(slot => {
    const element = sourceById.get(slot.imageId);
    if (!element) {
      throw new Error(`No image source provided for slot "${slot.imageId}".`);
    }

    context.drawImage(
      element,
      slot.sourceRect.x,
      slot.sourceRect.y,
      slot.sourceRect.width,
      slot.sourceRect.height,
      slot.destRect.x,
      slot.destRect.y,
      slot.destRect.width,
      slot.destRect.height,
    );
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas could not be encoded to a blob.'));
      },
      type,
      quality,
    );
  });
};
