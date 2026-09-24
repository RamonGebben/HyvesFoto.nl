/**
 * Target aspect ratios the editor can crop to.
 *
 * `buzz` is the reason this app exists: Hyves renders the Buzz timeline at
 * roughly 15:6 and hard-crops anything that does not match, often through
 * faces. Nothing in the geometry code hard-codes 2.5 — it all reads from
 * here, so correcting the ratio is a one-line change.
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
    width: 15,
    height: 6,
    description:
      'Past op de Buzz-tijdlijn, zonder dat Hyves er zelf nog iets afsnijdt.',
  },
] as const;

export const defaultAspectRatioId: AspectRatioId = 'buzz';

export const findAspectRatioPreset = (
  id: AspectRatioId,
): AspectRatioPreset | undefined =>
  aspectRatioPresets.find(preset => preset.id === id);
