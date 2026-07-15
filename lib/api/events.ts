import { apiGet } from './client';
import type { EventDetail, EventListItemDto, PaginatedEventList } from './types';

export function getEvent(id: number | string): Promise<EventDetail> {
  return apiGet<EventDetail>(`/events/${id}`);
}

export function getEventsByHost(
  hostId: number | string
): Promise<EventListItemDto[]> {
  return apiGet<EventListItemDto[]>(`/events/host/${hostId}`);
}

export function listEvents(
  page: number,
  limit: number,
  revalidate?: number
): Promise<PaginatedEventList> {
  return apiGet<PaginatedEventList>(
    '/events',
    { page, limit, isActive: false },
    revalidate
  );
}

/** Pages through GET /events to collect every event (used by app/sitemap.ts
 * — there's no dedicated "list all" endpoint, and no internal links point to
 * /events/[id] yet, so the sitemap is the only discovery path for crawlers).
 * Defaults to a 1hr cache since sitemaps don't need per-minute freshness.
 *
 * Fetches pages sequentially (not Promise.all) with one retry per page —
 * this only runs once an hour on cache expiry, so there's no latency
 * pressure, and it's gentler on the API than firing 7+ requests at once. */
export async function listAllEvents(
  revalidate = 3600
): Promise<EventListItemDto[]> {
  const PAGE_SIZE = 100;
  const items: EventListItemDto[] = [];

  const fetchPage = (page: number) => listEvents(page, PAGE_SIZE, revalidate);
  const fetchPageWithRetry = async (page: number) => {
    try {
      return await fetchPage(page);
    } catch {
      return fetchPage(page);
    }
  };

  const first = await fetchPageWithRetry(1);
  items.push(...first.items);

  for (let page = 2; page <= first.totalPages; page++) {
    const result = await fetchPageWithRetry(page);
    items.push(...result.items);
  }

  return items;
}
