import type { Decorator, Preview } from '@storybook/nextjs-vite';
import { StyleSheetManager, ThemeProvider } from 'styled-components';

import { GlobalStyle, palette, shouldForwardProp, theme } from '../src/theme';

/** Mirrors `AppProviders`, so stories render exactly like the real app. */
const withTheme: Decorator = Story => (
  <StyleSheetManager shouldForwardProp={shouldForwardProp}>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Story />
    </ThemeProvider>
  </StyleSheetManager>
);

const preview: Preview = {
  decorators: [withTheme],
  initialGlobals: {
    backgrounds: { value: 'app' },
  },
  parameters: {
    layout: 'centered',
    backgrounds: {
      options: {
        app: { name: 'App', value: palette.bg },
        surface: { name: 'Card', value: palette.surface },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Surface violations in the Storybook UI without failing the run.
      test: 'todo',
    },
  },
};

export default preview;
