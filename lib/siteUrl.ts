// Server-only — only read in Server Components/route handlers (generateMetadata,
// sitemap.ts, robots.ts, jsonLd.ts), never in client components, so this
// deliberately has no NEXT_PUBLIC_ prefix: it's read at request time from the
// container's runtime env, not inlined into the JS bundle at build time. That
// matters for a single Docker image reused across environments (Cloud Run
// dev/staging/prod) without rebuilding per domain.
//
// Set SITE_URL in production so OG tags / JSON-LD / canonical URLs are
// absolute (required for link-preview bots). Defaults to a same-origin-
// relative fallback for local dev.
export const SITE_URL = process.env.SITE_URL ?? '';

export function absoluteUrl(path: string): string {
  return SITE_URL ? `${SITE_URL}${path}` : path;
}
