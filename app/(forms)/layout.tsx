import type { Metadata } from 'next';
import {
  Noto_Sans_KR,
  Noto_Serif_KR,
  Nanum_Myeongjo,
  Nanum_Gothic,
  Gowun_Dodum,
  Do_Hyeon,
  Black_Han_Sans,
  Jua,
  Nanum_Pen_Script,
  IBM_Plex_Sans_KR,
} from 'next/font/google';
import '../globals.css';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

const notoSerifKr = Noto_Serif_KR({
  subsets: ['latin'],
  variable: '--font-noto-serif-kr',
  display: 'swap',
});

const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-nanum-myeongjo',
  display: 'swap',
});

const nanumGothic = Nanum_Gothic({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-nanum-gothic',
  display: 'swap',
});

const gowunDodum = Gowun_Dodum({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-gowun-dodum',
  display: 'swap',
});

const doHyeon = Do_Hyeon({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-do-hyeon',
  display: 'swap',
});

const blackHanSans = Black_Han_Sans({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-black-han-sans',
  display: 'swap',
});

const jua = Jua({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-jua',
  display: 'swap',
});

const nanumPenScript = Nanum_Pen_Script({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-nanum-pen-script',
  display: 'swap',
});

const ibmPlexSansKr = IBM_Plex_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-sans-kr',
  display: 'swap',
});

const FONT_VARIABLE_CLASSES = [
  notoSansKr.variable,
  notoSerifKr.variable,
  nanumMyeongjo.variable,
  nanumGothic.variable,
  gowunDodum.variable,
  doHyeon.variable,
  blackHanSans.variable,
  jua.variable,
  nanumPenScript.variable,
  ibmPlexSansKr.variable,
].join(' ');

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
      <body className={`${FONT_VARIABLE_CLASSES} antialiased bg-black text-white`}>
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </body>
    </html>
  );
}
