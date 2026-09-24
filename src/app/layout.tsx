import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { Nunito_Sans } from 'next/font/google';

import { AppProviders } from '~/components/AppProviders';
import { themeColor } from '~/theme';

import { StyledComponentsRegistry } from './registry';

// Closest widely available match to the warm, rounded humanist sans Hyves uses.
const nunitoSans = Nunito_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HyvesFoto.nl',
  description: 'Jouw foto. Jouw uitsnede. Klaar voor Hyves.',
  openGraph: {
    title: 'HyvesFoto.nl',
    description: 'Jouw foto. Jouw uitsnede. Klaar voor Hyves.',
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'HyvesFoto.nl',
    description: 'Jouw foto. Jouw uitsnede. Klaar voor Hyves.',
  },
};

export const viewport: Viewport = {
  themeColor,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="nl" className={nunitoSans.variable}>
      <body>
        <StyledComponentsRegistry>
          <AppProviders>{children}</AppProviders>
        </StyledComponentsRegistry>
        <Analytics />
      </body>
    </html>
  );
}
