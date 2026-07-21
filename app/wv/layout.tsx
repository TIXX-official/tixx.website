import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import '../globals.css';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

// Webview-only content embedded in the native app — never meant to be
// crawled, shared, or browsed directly, so no OG/canonical metadata here.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function WebviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className={`${notoSansKr.variable} antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
