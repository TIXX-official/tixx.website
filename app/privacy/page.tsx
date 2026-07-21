import type { Metadata } from 'next';
import { LegalDocument } from '@/components/legal/LegalDocument';
import { getLatestTerms } from '@/lib/api/terms';
import { absoluteUrl } from '@/lib/siteUrl';

export const metadata: Metadata = {
  title: '개인정보처리방침 | TIXX',
  description: 'TIXX 개인정보처리방침',
  alternates: { canonical: absoluteUrl('/privacy') },
};

export default async function PrivacyPage() {
  const [term] = await getLatestTerms(['privacy_collection']);

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-24 px-6">
      <div className="container mx-auto max-w-3xl">
        <LegalDocument term={term} />
      </div>
    </main>
  );
}
