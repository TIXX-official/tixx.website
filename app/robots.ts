import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/siteUrl';

// Force per-request evaluation. Without this, Next prerenders robots.txt once
// during `next build` (Docker build stage), where SITE_URL isn't set (it's
// only injected as a Cloud Run runtime env var — see lib/siteUrl.ts), baking
// in a relative Sitemap URL that Search Console rejects. Cloud Run's
// min-instances=0 means containers rarely live long enough for ISR to
// self-heal this, so it must be dynamic instead of relying on revalidation.
export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/wv/' },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
