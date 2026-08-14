import type { Metadata } from 'next';
import { HostDetailPage } from '@/components/host-detail/HostDetailPage';
import { getHost } from '@/lib/api/hosts';
import { buildHostMetadata } from '@/lib/seo/detailMetadata';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const host = await getHost(id);
    return buildHostMetadata(host, { noIndex: true });
  } catch {
    return { title: 'TIXX', robots: { index: false, follow: true } };
  }
}

export default async function SharedHostPage({ params }: PageProps) {
  const { id } = await params;
  return <HostDetailPage id={id} />;
}
