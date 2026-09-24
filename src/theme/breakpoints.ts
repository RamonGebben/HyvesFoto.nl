/** Mobile-first breakpoints. Always used via `theme.mediaQuery.*`. */
export const breakpoint = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export type Breakpoint = keyof typeof breakpoint;

export const mediaQuery = Object.fromEntries(
  Object.entries(breakpoint).map(([name, width]) => [
    name,
    `@media (min-width: ${width}px)`,
  ]),
) as { readonly [K in Breakpoint]: string };
