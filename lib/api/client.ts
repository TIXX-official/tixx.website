// Server-only fetch wrapper for the TIXX API. All calls here run inside
// Server Components at request time — never in the browser — so the API's
// CORS allowlist (admin.tixx.im, app.tixx.im only) never comes into play.
const API_BASE_URL = process.env.TIXX_API_BASE_URL ?? 'https://api.tixx.im';

export class ApiNotFoundError extends Error {}

export async function apiGet<T>(
  path: string,
  searchParams?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const url = new URL(path, API_BASE_URL);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url, {
    // Revalidate frequently rather than caching indefinitely — event/host
    // data (ticket stock, gallery, follower counts) changes often.
    next: { revalidate: 60 },
  });

  if (res.status === 404) {
    throw new ApiNotFoundError(`${path} not found`);
  }
  if (!res.ok) {
    throw new Error(`TIXX API ${res.status} for ${path}`);
  }
  return res.json() as Promise<T>;
}
