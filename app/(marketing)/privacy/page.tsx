import type { Metadata } from 'next';
import { LegalPageContent } from '@/components/legal/LegalPageContent';
import { getLatestTerms } from '@/lib/api/terms';
import { effectiveDateKST } from '@/lib/format/termsDate';
import { absoluteUrl } from '@/lib/siteUrl';

interface PageProps {
  searchParams: Promise<{ date?: string }>;
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
  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-24 px-6">
      <div className="container mx-auto max-w-3xl">
        <LegalPageContent type="privacy_collection" searchParams={searchParams} />
      </div>
    </main>
  );
}
