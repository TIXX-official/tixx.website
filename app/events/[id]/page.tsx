import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventDetailContent } from '@/components/event-detail/EventDetailContent';
import { ApiNotFoundError } from '@/lib/api/client';
import { getEvent } from '@/lib/api/events';
import { buildEventJsonLd } from '@/lib/seo/jsonLd';
import { absoluteUrl } from '@/lib/siteUrl';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const event = await getEvent(id);
    const description = event.description.replace(/\s+/g, ' ').trim().slice(0, 150);
    const url = absoluteUrl(`/events/${id}`);

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
    };
  } catch {
    return { title: 'TIXX' };
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;

  let event;
  try {
    event = await getEvent(id);
  } catch (error) {
    if (error instanceof ApiNotFoundError) notFound();
    throw error;
  }

  const jsonLd = buildEventJsonLd(event, absoluteUrl(`/events/${id}`));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EventDetailContent event={event} />
    </>
  );
}
