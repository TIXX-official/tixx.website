import { notFound } from 'next/navigation';
import { LegalDocument } from '@/components/legal/LegalDocument';
import { TermsVersionSelector } from '@/components/legal/TermsVersionSelector';
import { ApiNotFoundError } from '@/lib/api/client';
import { getLatestTerms, getTermById, listTerms } from '@/lib/api/terms';
import type { TermsType } from '@/lib/api/types';
import { daysFromNow, effectiveDateKST } from '@/lib/format/termsDate';

const PRE_NOTICE_WINDOW_DAYS = 30; // mirrors apps/api/src/terms/terms.service.ts

export async function LegalPageContent({
  type,
  searchParams,
}: {
  type: TermsType;
  searchParams: Promise<{ date?: string; embed?: string }>;
}) {
  const { date } = await searchParams;

  const [versions, latest] = await Promise.all([
    listTerms([type]),
    getLatestTerms([type]),
  ]);
  const currentTerm = latest[0];
  if (!currentTerm) notFound();

  let term = currentTerm;
  if (date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();
    // Matching is scoped to this type's own version list, so the resolved
    // id is guaranteed to belong to `type` — no separate cross-type check
    // needed the way an `?id=` param would have required.
    const match = versions.find((v) => effectiveDateKST(v.effectiveAt) === date);
    if (!match) notFound();
    try {
      term = await getTermById(match.id);
    } catch (error) {
      if (error instanceof ApiNotFoundError) notFound();
      throw error;
    }
  }

  const windowEnd = daysFromNow(PRE_NOTICE_WINDOW_DAYS);
  const selectableVersions = versions.filter((v) => new Date(v.effectiveAt) <= windowEnd);

  const badge =
    term.id === currentTerm.id
      ? undefined
      : new Date(term.effectiveAt) > new Date(currentTerm.effectiveAt)
        ? `시행 예정 버전입니다 — 시행일 ${effectiveDateKST(term.effectiveAt)}`
        : '이전 버전입니다';

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-24 px-6">
      <div className="container mx-auto max-w-3xl">
        <TermsVersionSelector
          versions={selectableVersions}
          currentDate={effectiveDateKST(currentTerm.effectiveAt)}
          selectedDate={effectiveDateKST(term.effectiveAt)}
        />
        <LegalDocument term={term} badge={badge} />
      </div>
    </main>
  );
}
