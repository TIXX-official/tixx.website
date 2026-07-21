'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { TermsListItem } from '@/lib/api/types';
import { effectiveDateKST } from '@/lib/format/termsDate';

export function TermsVersionSelector({
  versions,
  currentDate,
  selectedDate,
}: {
  versions: TermsListItem[];
  currentDate: string;
  selectedDate: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (versions.length <= 1) return null;

  const statusLabel = (v: TermsListItem) => {
    const d = effectiveDateKST(v.effectiveAt);
    if (d === currentDate) return '현재';
    if (d > currentDate) return '시행예정';
    return null;
  };

  const handleChange = (date: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('date', date);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-8">
      <label className="block text-xs text-zinc-600 mb-1">버전 선택</label>
      <select
        value={selectedDate}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-zinc-900 border border-zinc-800 text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-neon-lime"
      >
        {versions.map((v) => {
          const d = effectiveDateKST(v.effectiveAt);
          const status = statusLabel(v);
          return (
            <option key={v.id} value={d}>
              {d} 시행{status ? ` (${status})` : ''}
            </option>
          );
        })}
      </select>
    </div>
  );
}
