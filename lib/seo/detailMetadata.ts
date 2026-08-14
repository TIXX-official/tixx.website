import type { Metadata } from 'next';
import type { EventDetail, HostDetail } from '@/lib/api/types';
import { absoluteUrl } from '@/lib/siteUrl';

interface DetailMetadataOptions {
  noIndex?: boolean;
}

export function buildEventMetadata(
  event: EventDetail,
  options: DetailMetadataOptions = {},
): Metadata {
  const description = event.description.replace(/\s+/g, ' ').trim().slice(0, 150);
  const url = absoluteUrl(`/events/${event.id}`);

  return {
    title: `${event.name} | TIXX`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: event.name,
      description,
      url,
      images: [{ url: event.imageUrl }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: event.name,
      description,
      images: [event.imageUrl],
    },
    robots: options.noIndex ? { index: false, follow: true } : undefined,
  };
}

export function buildHostMetadata(
  host: HostDetail,
  options: DetailMetadataOptions = {},
): Metadata {
  const description = (host.description ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 150);
  const url = absoluteUrl(`/hosts/${host.id}`);

  return {
    title: `${host.name} | TIXX`,
    description: description || undefined,
    alternates: { canonical: url },
    openGraph: {
      title: host.name,
      description,
      url,
      images: host.imageUrl ? [{ url: host.imageUrl }] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: host.name,
      description,
      images: host.imageUrl ? [host.imageUrl] : undefined,
    },
    robots: options.noIndex ? { index: false, follow: true } : undefined,
  };
}
