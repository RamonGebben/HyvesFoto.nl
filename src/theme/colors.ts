/**
 * Raw colour values live here once and nowhere else.
 *
 * Sampled from the Hyves interface: warm orange gradients, a warm grey ground,
 * white cards and blue call-to-actions. Hyves ships no dark theme, so neither
 * does this app — there is one palette and it is light.
 *
 * Components never read these directly — they read `theme.color.*`, which
 * resolves to the CSS custom properties emitted by `GlobalStyle`. Non-CSS
 * contexts (`viewport.themeColor`, a future `manifest.ts`) import the raw map
 * below so they stay in sync instead of duplicating hex.
 */

export const palette = {
  /** Warm grey page ground, as behind the Hyves feed. */
  bg: '#f4ede6',
  surface: '#ffffff',
  surfaceRaised: '#ffffff',
  /** The beige of the Hyves compose bar. */
  surfaceSunken: '#ece3d9',
  border: '#e4dace',
  borderStrong: '#cdbfb0',
  /** Cool neutral grey for the "grey" button variant — distinct from the warm beige surfaces. */
  neutral: '#e5e7eb',
  neutralHover: '#d3d7dc',
  neutralBorder: '#c3c8cf',

  text: '#1c3f63',
  textMuted: '#7a8794',

  /** Hyves dark navy — the "Instellingen"-style button. Same hue as `text`. */
  dark: '#1c3f63',
  darkHover: '#15304a',
  darkContrast: '#ffffff',

  /** Hyves orange — headers, gradients, selected state. */
  accent: '#f7941e',
  accentHover: '#e5850f',
  accentContrast: '#ffffff',
  /** The honey yellow of the hexagon badges. */
  highlight: '#f5c242',

  /** Hyves blue — primary buttons ("Nu inschrijven", "Bericht"). */
  action: '#1f6fd0',
  actionHover: '#1a5fb4',
  actionContrast: '#ffffff',

  danger: '#c62828',
  success: '#2e7d32',
  focus: '#1f6fd0',

  /** Backdrop behind the crop/collage canvas. */
  canvas: '#ece3d9',
  overlay: 'rgba(28, 63, 99, 0.5)',
} as const;

export type ColorToken = keyof typeof palette;

/** What components consume: `theme.color.accent` -> `var(--color-accent)`. */
export const color = Object.fromEntries(
  Object.keys(palette).map(token => [token, `var(--color-${token})`]),
) as { readonly [K in ColorToken]: `var(--color-${K})` };

/** The browser UI colour — the orange of the Hyves top bar. */
export const themeColor = palette.accent;
