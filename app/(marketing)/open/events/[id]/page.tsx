import type { Metadata } from 'next';
import { EventDetailPage } from '@/components/event-detail/EventDetailPage';
import { getEvent } from '@/lib/api/events';
import { buildEventMetadata } from '@/lib/seo/detailMetadata';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const event = await getEvent(id);
    return buildEventMetadata(event, { noIndex: true });
  } catch {
    return { title: 'TIXX', robots: { index: false, follow: true } };
  }
}

export default async function SharedEventPage({ params }: PageProps) {
  const { id } = await params;
  return <EventDetailPage id={id} />;
}
