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
  limit: number
): Promise<PaginatedEventList> {
  return apiGet<PaginatedEventList>('/events', {
    page,
    limit,
    isActive: false,
  });
}
