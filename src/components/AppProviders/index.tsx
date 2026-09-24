'use client';

import { StyleSheetManager, ThemeProvider } from 'styled-components';

import { GlobalStyle, shouldForwardProp, theme } from '~/theme';

type AppProvidersProps = {
  children: React.ReactNode;
};

/**
 * The single client boundary wrapping the app: transient-prop filtering,
 * theme and global styles. App-level providers belong here; feature UI does
 * not. Nested inside the SSR registry, so it inherits that sheet on the
 * server and uses the default one in the browser.
 */
export const AppProviders = ({ children }: AppProvidersProps) => (
  <StyleSheetManager shouldForwardProp={shouldForwardProp}>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  </StyleSheetManager>
);
