import type { Metadata } from 'next';
import { LegalDocument } from '@/components/legal/LegalDocument';
import { getLatestTerms } from '@/lib/api/terms';
import { absoluteUrl } from '@/lib/siteUrl';

export const metadata: Metadata = {
  title: '취소 및 환불 정책 | TIXX',
  description: 'TIXX 취소 및 환불 정책',
  alternates: { canonical: absoluteUrl('/refund') },
};

export default async function RefundPage() {
  const [term] = await getLatestTerms(['refund_policy']);

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-24 px-6">
      <div className="container mx-auto max-w-3xl">
        <LegalDocument term={term} />
      </div>
    </main>
  );
}
