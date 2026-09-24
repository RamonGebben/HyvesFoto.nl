import { breakpoint, mediaQuery } from './breakpoints';
import { color } from './colors';

export const theme = {
  color,
  breakpoint,
  mediaQuery,
  space: {
    xxs: '0.25rem',
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  radius: {
    sm: '6px',
    md: '12px',
    lg: '20px',
    pill: '999px',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.75rem',
    xxl: '2.5rem',
  },
  fontWeight: {
    regular: 400,
    medium: 600,
    bold: 700,
  },
  shadow: {
    sm: '0 1px 2px rgba(28, 63, 99, 0.06)',
    md: '0 2px 10px rgba(28, 63, 99, 0.08)',
    lg: '0 10px 30px rgba(28, 63, 99, 0.12)',
    focusRing: `0 0 0 3px rgba(31, 111, 208, 0.35)`,
  },
  gradient: {
    /** The Hyves top bar: amber on the left, deeper orange on the right. */
    brand: `linear-gradient(100deg, ${color.highlight}, ${color.accent})`,
    /** The hero wash, lighter at the top. */
    hero: `linear-gradient(160deg, ${color.highlight}, ${color.accent})`,
    /** Checkerboard used behind transparent images in the editor. */
    transparency: `repeating-conic-gradient(${color.surfaceSunken} 0% 25%, ${color.surface} 0% 50%)`,
  },
  duration: {
    fast: '120ms',
    base: '200ms',
  },
  zIndex: {
    canvasOverlay: 10,
    /** Floating per-tile controls (drag handle, focus/remove buttons) —
     * above `canvasOverlay` so they never get visually tinted by it. */
    tileControls: 20,
    header: 100,
    modal: 1000,
    toast: 1100,
  },
} as const;

export type AppTheme = typeof theme;

export { breakpoint, mediaQuery } from './breakpoints';
export { color, palette, themeColor } from './colors';
export type { ColorToken } from './colors';
export { GlobalStyle } from './GlobalStyle';
export { shouldForwardProp } from './shouldForwardProp';
