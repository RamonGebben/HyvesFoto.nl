import type { Ratio } from '~/utils/geometry';

/**
 * Target aspect ratios the editor can crop to.
 *
 * `buzz` is the reason this app exists: Hyves renders the Buzz timeline at
 * roughly 480:232 and hard-crops anything that does not match, often through
 * faces — cross-checked against a comparable cropping tool's own reference
 * dimensions for the same format. `banner` is the profile cover/banner,
 * measured 930×237px from a real profile screenshot. Nothing in the
 * geometry code hard-codes either value — it all reads from here, so
 * correcting a ratio is a one-line change.
 */

export type AspectRatioId = 'buzz' | 'banner';

export type AspectRatioPreset = {
  readonly id: AspectRatioId;
  readonly label: string;
  /** Ratio numerator, in arbitrary units — only width / height matters. */
  readonly width: number;
  readonly height: number;
  readonly description: string;
  /** Short picker caption naming where this format is used, e.g. "Voor je profiel". */
  readonly usageLabel: string;
};

export const aspectRatioPresets: readonly AspectRatioPreset[] = [
  {
    id: 'buzz',
    label: 'Buzz',
    width: 480,
    height: 232,
    description:
      'Past op de Buzz-tijdlijn, zonder dat Hyves er zelf nog iets afsnijdt.',
    usageLabel: 'Voor WieWatWaar',
  },
  {
    id: 'banner',
    label: 'Banner',
    width: 930,
    height: 237,
    description:
      'Past op de omslagfoto van je profiel, zonder dat Hyves er zelf nog iets afsnijdt.',
    usageLabel: 'Voor je profiel',
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
 * Measured from a comparable cropping tool's own mobile safe-zone guide: a
 * dashed inset 10% in from each edge of its 480×232 desktop frame, i.e.
 * 384×232 (384:232, ≈1.66). Overlay-only guide, never a selectable crop
 * target — so it lives outside `aspectRatioPresets`/`AspectRatioId`.
 */
export const mobileAspectRatio: Ratio = { width: 384, height: 232 };
