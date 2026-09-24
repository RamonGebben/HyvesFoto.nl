import 'styled-components';

import type { AppTheme } from './index';

declare module 'styled-components' {
  // Makes `props.theme` fully typed, so `theme.color.accnt` is a compile error.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}
