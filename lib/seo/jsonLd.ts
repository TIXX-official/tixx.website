import type { EventDetail, HostDetail } from '@/lib/api/types';
import { parseEventDateTime } from '@/lib/format/eventDateTime';

export function buildEventJsonLd(event: EventDetail, url: string) {
  const startDate = parseEventDateTime(event.startDate, event.startTime).toISOString();
  const endDate = parseEventDateTime(event.endDate, event.endTime).toISOString();
  const cheapestTicket = event.tickets
    .filter((t) => typeof t.price === 'number')
    .sort((a, b) => (a.price ?? 0) - (b.price ?? 0))[0];

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate,
    endDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    image: [event.imageUrl],
    url,
    location: {
      '@type': 'Place',
      name: event.place.name,
      address: event.place.address,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: event.place.latitude,
        longitude: event.place.longitude,
      },
    },
    organizer: {
      '@type': 'Organization',
      name: event.host.name,
    },
    ...(cheapestTicket
      ? {
          offers: {
            '@type': 'Offer',
            price: cheapestTicket.price,
            priceCurrency: 'KRW',
            availability:
              cheapestTicket.remainQuantity > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/SoldOut',
            url,
          },
        }
      : {}),
  };
}

export function buildHostJsonLd(host: HostDetail, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': host.category === 'Venue' ? 'LocalBusiness' : 'Organization',
    name: host.name,
    description: host.description ?? undefined,
    image: host.imageUrl ?? undefined,
    url,
  };
}
