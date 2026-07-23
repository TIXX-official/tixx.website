import type { Metadata } from 'next';
import { Outfit, Inter, Noto_Sans_KR } from 'next/font/google';
import '../globals.css';

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

// Fallback only — /forms/[id]/page.tsx's generateMetadata supplies the real
// per-form title/OG data. No Navbar/Footer here unlike (marketing): these
// pages are meant to fill the whole screen with the host's own poster/theme,
// and unlike wv/layout.tsx they ARE meant to be shared/indexed (no noindex).
export const metadata: Metadata = {
  title: 'TIXX',
};

export default function FormsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body
        className={`${outfit.variable} ${inter.variable} ${notoSansKr.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
