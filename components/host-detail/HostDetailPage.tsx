import { notFound } from 'next/navigation';
import { AppHandoff } from '@/components/detail/AppHandoff';
import { HostDetailContent } from '@/components/host-detail/HostDetailContent';
import { ApiNotFoundError } from '@/lib/api/client';
import { getEventsByHost } from '@/lib/api/events';
import { getHost } from '@/lib/api/hosts';
import { buildHostJsonLd } from '@/lib/seo/jsonLd';
import { absoluteUrl } from '@/lib/siteUrl';

export async function HostDetailPage({ id }: { id: string }) {
  let host;
  try {
    host = await getHost(id);
  } catch (error) {
    if (error instanceof ApiNotFoundError) notFound();
    throw error;
  }

  const hostedEvents = await getEventsByHost(id).catch(() => []);
  const jsonLd = buildHostJsonLd(host, absoluteUrl(`/hosts/${id}`));

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppHandoff
        kind='host'
        id={host.id}
        enabledTargets={process.env.AUTO_APP_HANDOFF_TARGETS ?? ''}
      />
      <HostDetailContent host={host} hostedEvents={hostedEvents} />
    </>
  );
}
