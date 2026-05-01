import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://react-radial-dock.vercel.app'),
  title: 'react-radial-dock — pie-menu for React',
  description:
    'A GSAP-animated radial action dock for React. Right-click anywhere. Headless, themable, tree-shakable.',
  openGraph: {
    title: 'react-radial-dock',
    description: 'Right-click anywhere. A pie-menu for React, engineered.',
    url: 'https://react-radial-dock.vercel.app',
    siteName: 'react-radial-dock',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'react-radial-dock',
    description: 'Right-click anywhere. A pie-menu for React, engineered.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Boldonse&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
