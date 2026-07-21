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
    const [current] = await getLatestTerms(['refund_policy']);
    isCurrent = current ? effectiveDateKST(current.effectiveAt) === date : false;
  }

  return {
    title: '취소 및 환불 정책 | TIXX',
    description: 'TIXX 취소 및 환불 정책',
    alternates: { canonical: absoluteUrl('/refund') },
    ...(isCurrent ? {} : { robots: { index: false } }),
  };
}

export default function RefundPage({ searchParams }: PageProps) {
  return <LegalPageContent type="refund_policy" searchParams={searchParams} />;
}
