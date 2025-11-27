import type { Metadata } from 'next';
import { Outfit, Inter, Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TIX - Nightlife, Reimagined.',
  description:
    'Nightlife operating solution. Data-driven nightlife revolution.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/android-icon-36x36.png', sizes: '36x36', type: 'image/png' },
      { url: '/android-icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/android-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/android-icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/android-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/android-icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-57x57.png', sizes: '57x57' },
      { url: '/apple-icon-60x60.png', sizes: '60x60' },
      { url: '/apple-icon-72x72.png', sizes: '72x72' },
      { url: '/apple-icon-76x76.png', sizes: '76x76' },
      { url: '/apple-icon-114x114.png', sizes: '114x114' },
      { url: '/apple-icon-120x120.png', sizes: '120x120' },
      { url: '/apple-icon-144x144.png', sizes: '144x144' },
      { url: '/apple-icon-152x152.png', sizes: '152x152' },
      { url: '/apple-icon-180x180.png', sizes: '180x180' },
      { url: '/apple-icon-precomposed.png', rel: 'apple-touch-icon-precomposed' },
    ],
  },
  manifest: '/manifest.json',
  other: {
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileImage': '/ms-icon-144x144.png',
    'msapplication-TileColor': '#ffffff',
    'theme-color': '#ffffff',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='dark'>
      <body
        className={`${outfit.variable} ${inter.variable} ${notoSansKr.variable} antialiased bg-black text-white`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
