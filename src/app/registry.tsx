'use client';

import { useServerInsertedHTML } from 'next/navigation';
import { useState } from 'react';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

type StyledComponentsRegistryProps = {
  children: React.ReactNode;
};

/**
 * Collects styled-components rules during SSR and flushes them into <head>
 * before any markup that uses them. In the browser styled-components takes
 * over, so this renders children untouched — which is why `shouldForwardProp`
 * lives in `AppProviders` (always mounted) rather than here.
 */
export const StyledComponentsRegistry = ({
  children,
}: StyledComponentsRegistryProps) => {
  // Lazy initial state so the sheet is created exactly once per render pass.
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== 'undefined') return <>{children}</>;

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
};
