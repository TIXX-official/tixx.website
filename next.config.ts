import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  images: {
    unoptimized: true,
  },
  // github pages 배포 시 repository 이름을 base path로 사용
  basePath: '/tixx.website',
  assetPrefix: '/tixx.website',
};

export default nextConfig;
