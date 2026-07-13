// Set NEXT_PUBLIC_SITE_URL in production so OG tags / JSON-LD / canonical
// URLs are absolute (required for link-preview bots). Defaults to a
// same-origin-relative fallback for local dev.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? '';

export function absoluteUrl(path: string): string {
  return SITE_URL ? `${SITE_URL}${path}` : path;
}
