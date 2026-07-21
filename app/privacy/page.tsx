import type { Metadata } from 'next';
import { LegalPageContent } from '@/components/legal/LegalPageContent';
import { getLatestTerms } from '@/lib/api/terms';
import { effectiveDateKST } from '@/lib/format/termsDate';
import { absoluteUrl } from '@/lib/siteUrl';

interface PageProps {
  searchParams: Promise<{ date?: string; embed?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { date } = await searchParams;
  let isCurrent = true;
  if (date) {
    const [current] = await getLatestTerms(['privacy_collection']);
    isCurrent = current ? effectiveDateKST(current.effectiveAt) === date : false;
  }

  return {
    title: '개인정보처리방침 | TIXX',
    description: 'TIXX 개인정보처리방침',
    alternates: { canonical: absoluteUrl('/privacy') },
    ...(isCurrent ? {} : { robots: { index: false } }),
  };
}

export default function PrivacyPage({ searchParams }: PageProps) {
  return <LegalPageContent type="privacy_collection" searchParams={searchParams} />;
}
