'use client';

import { createGlobalStyle, css } from 'styled-components';

import { palette } from './colors';

const customProperties = css`
  :root {
    /* Hyves has no dark theme, so neither does this app. */
    color-scheme: light;
    ${Object.entries(palette)
      .map(([token, value]) => `--color-${token}: ${value};`)
      .join('\n')}
  }
`;

export const GlobalStyle = createGlobalStyle`
  ${customProperties}

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }

  body {
    background: ${props => props.theme.color.bg};
    color: ${props => props.theme.color.text};
    font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
    font-size: ${props => props.theme.fontSize.md};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    min-height: 100dvh;
  }

  h1, h2, h3, h4, p, figure, blockquote {
    margin: 0;
  }

  img, picture, canvas, svg {
    display: block;
    max-width: 100%;
  }

  button, input, select, textarea {
    font: inherit;
    color: inherit;
  }

  :focus-visible {
    outline: 2px solid ${props => props.theme.color.focus};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
