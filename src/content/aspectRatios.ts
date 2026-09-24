import type { Ratio } from '~/utils/geometry';

/**
 * Target aspect ratios the editor can crop to.
 *
 * `buzz` is the reason this app exists: Hyves renders the Buzz timeline at
 * roughly 52:25 and hard-crops anything that does not match, often through
 * faces. Nothing in the geometry code hard-codes that value — it all reads
 * from here, so correcting the ratio is a one-line change.
 *
 * Only one preset ships for now — the picker UI already supports more, so
 * adding a second is just another entry in this array.
 */

export type AspectRatioId = 'buzz';

export type AspectRatioPreset = {
  readonly id: AspectRatioId;
  readonly label: string;
  /** Ratio numerator, in arbitrary units — only width / height matters. */
  readonly width: number;
  readonly height: number;
  readonly description: string;
};

export const aspectRatioPresets: readonly AspectRatioPreset[] = [
  {
    id: 'buzz',
    label: 'Buzz',
    width: 52,
    height: 25,
    description:
      'Past op de Buzz-tijdlijn, zonder dat Hyves er zelf nog iets afsnijdt.',
  },
] as const;

export const defaultAspectRatioId: AspectRatioId = 'buzz';

export const findAspectRatioPreset = (
  id: AspectRatioId,
): AspectRatioPreset | undefined =>
  aspectRatioPresets.find(preset => preset.id === id);

/**
 * The Hyves mobile timeline ratio — narrower than `buzz`, so mobile
 * additionally hard-crops from the left/right of whatever fits desktop.
 * Measured 311×200px (311:200, ≈1.56) from a real mobile feed screenshot.
 * Overlay-only guide, never a selectable crop target — so it lives outside
 * `aspectRatioPresets`/`AspectRatioId`.
 */
export const mobileAspectRatio: Ratio = { width: 311, height: 200 };
