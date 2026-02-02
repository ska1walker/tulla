import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { CookieBanner } from '@/components/ui/cookie-banner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'maiflow - Kampagnenplanung für Marketing-Teams',
  description: 'Der visuelle Kampagnenplaner für Teams, die wissen: Gutes Marketing verdient ein gutes Tool. DSGVO-konform. Kostenlos bis 50 Nutzer.',
  keywords: ['Kampagnenplanung', 'Marketing', 'Timeline', 'Team', 'DSGVO', 'kostenlos'],
  authors: [{ name: 'maiflow' }],
  creator: 'maiflow',
  metadataBase: new URL('https://maiflow.app'),
  openGraph: {
    title: 'maiflow - Kampagnenplanung für Marketing-Teams',
    description: 'Der visuelle Kampagnenplaner für Teams. DSGVO-konform. Kostenlos bis 50 Nutzer.',
    url: 'https://maiflow.app',
    siteName: 'maiflow',
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'maiflow - Kampagnenplanung für Marketing-Teams',
    description: 'Der visuelle Kampagnenplaner für Teams. DSGVO-konform. Kostenlos bis 50 Nutzer.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
        <CookieBanner />
      </body>
    </html>
  );
}
