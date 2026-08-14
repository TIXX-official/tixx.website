import { notFound } from 'next/navigation';
import { AppHandoff } from '@/components/detail/AppHandoff';
import { EventDetailContent } from '@/components/event-detail/EventDetailContent';
import { ApiNotFoundError } from '@/lib/api/client';
import { getEvent } from '@/lib/api/events';
import { buildEventJsonLd } from '@/lib/seo/jsonLd';
import { absoluteUrl } from '@/lib/siteUrl';

export async function EventDetailPage({ id }: { id: string }) {
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
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppHandoff
        kind='event'
        id={event.id}
        enabledTargets={process.env.AUTO_APP_HANDOFF_TARGETS ?? ''}
      />
      <EventDetailContent event={event} />
    </>
  );
}
