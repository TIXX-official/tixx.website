import type { Metadata } from 'next';
import { LegalPageContent } from '@/components/legal/LegalPageContent';

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

export const metadata: Metadata = {
  title: '이용약관 | TIXX',
};

export default function WvTermsPage({ searchParams }: PageProps) {
  return (
    <main className="min-h-screen bg-black text-white px-5 py-8">
      <LegalPageContent type="service_terms" searchParams={searchParams} />
    </main>
  );
}
