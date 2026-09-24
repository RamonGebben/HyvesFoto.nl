import { render } from '@testing-library/react';
import type { RenderOptions, RenderResult } from '@testing-library/react';

import { AppProviders } from '~/components/AppProviders';

/**
 * Renders a component inside the same providers the app mounts, so component
 * tests exercise real theme values instead of a stub.
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): RenderResult =>
  render(ui, {
    wrapper: ({ children }) => <AppProviders>{children}</AppProviders>,
    ...options,
  });
