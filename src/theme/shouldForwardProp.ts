/**
 * Transient styling props are prefixed with `$` so styled-components keeps them
 * out of the DOM. Passed to `StyleSheetManager` once, in `AppProviders`.
 */
export const shouldForwardProp = (prop: string): boolean =>
  !prop.startsWith('$');
