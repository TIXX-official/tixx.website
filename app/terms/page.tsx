import type { Metadata } from 'next';
import { LegalDocument } from '@/components/legal/LegalDocument';
import { getLatestTerms } from '@/lib/api/terms';
import { absoluteUrl } from '@/lib/siteUrl';

export const metadata: Metadata = {
  title: '이용약관 | TIXX',
  description: 'TIXX 서비스 이용약관',
  alternates: { canonical: absoluteUrl('/terms') },
};

export default async function TermsPage() {
  const [term] = await getLatestTerms(['service_terms']);

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-24 px-6">
      <div className="container mx-auto max-w-3xl">
        <LegalDocument term={term} />
      </div>
    </main>
  );
}
