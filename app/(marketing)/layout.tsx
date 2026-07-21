import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Outfit, Inter, Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/lib/LanguageContext';
import { absoluteUrl, SITE_URL } from '@/lib/siteUrl';

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
  metadataBase: new URL(SITE_URL || 'http://localhost:3000'),
  title: 'TIXX (틱스) - 2030 컬처 라이프스타일 플랫폼 | 파티·팝업·행사 대행',
  description:
    '서울 핫한 클럽 파티, 성수 팝업스토어, 전시회 예약은 틱스(TIXX)에서! 기업 행사 대행, 브랜드 런칭 파티 기획, DJ 섭외부터 티켓팅/QR 입장 관리 솔루션까지 제공하는 올인원 이벤트 플랫폼입니다.',
  keywords: [
    '틱스',
    'TIXX',
    '틱스 파티',
    '틱스 앱',
    '주식회사 틱스',
    '파티 앱',
    '클럽 게스트',
    '페스티벌 예매',
    '놀거리 추천',
    '기업 행사 대행',
    '파티 기획사',
    '팝업스토어 운영 대행',
    '행사 대행사',
    '이벤트 대행',
    'DJ 섭외',
    '행사 음향 렌탈',
    '공연 기획',
    '티켓팅 시스템',
    '입장 관리 솔루션',
    '브랜드 런칭 파티 기획',
    '팝업',
    '팝업스토어',
    '서울 팝업',
    '파티',
    '클럽',
    'DJ',
    '전시',
    '예약',
    '공연',
    '연극',
    '이벤트',
    '이벤트 예약',
    '파티 앱',
    '클럽 앱',
    '전시 앱',
    '공연 앱',
    '팝업 앱',
    '팝업 플랫폼',
    '전시 플랫폼',
    '파티 플랫폼',
    '클럽 플랫폼',
    '이벤트 대행사',
    '파티 대행사',
    '이벤트 기획',
  ],
  openGraph: {
    title: 'TIXX (틱스) - 2030 컬처 라이프스타일 플랫폼 | 파티·팝업·행사 대행',
    description:
      '서울 핫한 클럽 파티, 성수 팝업스토어, 전시회 예약은 틱스(TIXX)에서! 기업 행사 대행, 브랜드 런칭 파티 기획, DJ 섭외부터 티켓팅/QR 입장 관리 솔루션까지 제공하는 올인원 이벤트 플랫폼입니다.',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'TIXX',
    images: [{ url: absoluteUrl('/tixx-logo.png'), width: 1024, height: 1024 }],
  },
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
    'naver-site-verification': 'ab83712eddcfcbb154353ca17156e709d7d37c09',
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
    <html lang='ko' className='dark'>
      <body
        className={`${outfit.variable} ${inter.variable} ${notoSansKr.variable} antialiased bg-black text-white`}
      >
        <LanguageProvider>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          {children}
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </LanguageProvider>
      </body>
    </html>
  );
}
