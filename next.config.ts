import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Standalone output for containerized deployment (Docker/Cloud Run).
  // NOTE: switched off static `output: 'export'` because /events/[id] and
  // /hosts/[id] need per-request SSR against the live API (real-time data +
  // correct OG tags for link sharing) — see docs/event-host-detail-pages.md.
  output: 'standalone',
  // Allow LAN devices (e.g. phones on the same network) to hit the dev server's
  // HMR/websocket endpoints during local testing.
  allowedDevOrigins: ['172.30.1.12'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.dev',
      },
    ],
  },
};

export default nextConfig;
