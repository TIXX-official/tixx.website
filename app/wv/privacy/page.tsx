import type { Metadata } from 'next';
import { LegalPageContent } from '@/components/legal/LegalPageContent';

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

export const metadata: Metadata = {
  title: '개인정보처리방침 | TIXX',
};

export default function WvPrivacyPage({ searchParams }: PageProps) {
  return (
    <main className="min-h-screen bg-black text-white px-5 py-8">
      <LegalPageContent type="privacy_collection" searchParams={searchParams} />
    </main>
  );
}
