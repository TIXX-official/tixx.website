import type { Metadata } from 'next';
import { LegalDocument } from '@/components/legal/LegalDocument';
import { getLatestTerms } from '@/lib/api/terms';
import { absoluteUrl } from '@/lib/siteUrl';

export const metadata: Metadata = {
  title: '약관 및 정책 | TIXX',
  description: 'TIXX 이용약관, 개인정보처리방침, 취소 및 환불 정책',
  alternates: { canonical: absoluteUrl('/legal') },
};

interface PageProps {
  searchParams: Promise<{ embed?: string }>;
}

export default async function LegalPage({ searchParams }: PageProps) {
  const { embed } = await searchParams;
  const isEmbed = embed === '1';
  const terms = await getLatestTerms();

  const anchors: Record<string, string> = {
    service_terms: 'service-terms',
    privacy_collection: 'privacy-collection',
    refund_policy: 'refund-policy',
  };

  return (
    <main className={`min-h-screen bg-black text-white ${isEmbed ? 'pt-8' : 'pt-32'} pb-24 px-6`}>
      <div className="container mx-auto max-w-3xl">
        {!isEmbed && (
          <h1 className="text-3xl md:text-4xl font-black font-display mb-12">약관 및 정책</h1>
        )}
        <div className="space-y-16">
          {terms.map((term) => (
            <LegalDocument key={term.id} term={term} anchor={anchors[term.type]} />
          ))}
        </div>
      </div>
    </main>
  );
}
