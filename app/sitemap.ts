import type { MetadataRoute } from 'next';
import { listAllEvents } from '@/lib/api/events';
import { absoluteUrl } from '@/lib/siteUrl';

// Regenerate hourly — event/host listings don't need to be sitemap-fresh to
// the second, and this avoids paginating through GET /events on every crawl.
export const revalidate = 3600;

const STATIC_PATHS = [
  '/',
  '/about',
  '/app',
  '/business',
  '/promoters',
  '/download',
  '/terms',
  '/privacy',
  '/refund',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.6,
  }));

  let events: Awaited<ReturnType<typeof listAllEvents>> = [];
  try {
    events = await listAllEvents();
  } catch (err) {
    console.error('sitemap: failed to fetch events, serving static pages only', err);
    // If the API is briefly unavailable, still serve the static-page
    // sitemap rather than failing the whole route.
    return staticEntries;
  }

  const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
    url: absoluteUrl(`/events/${event.id}`),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const hostIds = [...new Set(events.map((event) => event.hostId))];
  const hostEntries: MetadataRoute.Sitemap = hostIds.map((hostId) => ({
    url: absoluteUrl(`/hosts/${hostId}`),
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [...staticEntries, ...eventEntries, ...hostEntries];
}
