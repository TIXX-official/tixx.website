import type { Metadata } from 'next';
import { LegalPageContent } from '@/components/legal/LegalPageContent';

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

export const metadata: Metadata = {
  title: '취소 및 환불 정책 | TIXX',
};

export default function WvRefundPage({ searchParams }: PageProps) {
  return (
    <main className="min-h-screen bg-black text-white px-5 py-8">
      <LegalPageContent type="refund_policy" searchParams={searchParams} />
    </main>
  );
}
