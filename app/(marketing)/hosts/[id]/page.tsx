import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HostDetailContent } from '@/components/host-detail/HostDetailContent';
import { ApiNotFoundError } from '@/lib/api/client';
import { getEventsByHost } from '@/lib/api/events';
import { getHost } from '@/lib/api/hosts';
import { buildHostJsonLd } from '@/lib/seo/jsonLd';
import { absoluteUrl } from '@/lib/siteUrl';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const host = await getHost(id);
    const description = (host.description ?? '').replace(/\s+/g, ' ').trim().slice(0, 150);
    const url = absoluteUrl(`/hosts/${id}`);

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
    };
  } catch {
    return { title: 'TIXX' };
  }
}

export default async function HostDetailPage({ params }: PageProps) {
  const { id } = await params;

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
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HostDetailContent host={host} hostedEvents={hostedEvents} />
    </>
  );
}
