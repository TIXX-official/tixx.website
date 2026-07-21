import { LegalPageContent } from '@/components/legal/LegalPageContent';

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

export default function WvRefundPage({ searchParams }: PageProps) {
  return (
    <main className="min-h-screen bg-black text-white px-5 py-8">
      <LegalPageContent type="refund_policy" searchParams={searchParams} />
    </main>
  );
}
