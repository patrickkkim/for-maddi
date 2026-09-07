import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'A little note',
  icons: { icon: `${process.env.SITE_BASE_PATH || ''}/favicon.svg` },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
