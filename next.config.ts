import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  images: {
    unoptimized: true,
  },
  // github pages 배포 시 repository 이름을 base path로 사용
  basePath: isProd ? '/tixx.website' : '',
  assetPrefix: isProd ? '/tixx.website' : '',
};

export default nextConfig;
