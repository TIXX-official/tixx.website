import { apiGet } from './client';
import type { Term, TermsListItem, TermsType } from './types';

const ALL_TYPES: TermsType[] = ['service_terms', 'privacy_collection', 'refund_policy'];

// Legal content changes far less often than event/ticket data, so cache an
// hour rather than client.ts's 60s default.
export function getLatestTerms(
  types: TermsType[] = ALL_TYPES,
  revalidate = 3600
): Promise<Term[]> {
  return apiGet<{ terms: Term[] }>(
    '/terms/latest',
    { types: types.join(',') },
    revalidate
  ).then((res) => res.terms);
}

// Full version history (past/current/upcoming), metadata only — used to
// populate the version selector. Same 1hr cache as getLatestTerms since new
// versions can be published at any time.
export function listTerms(
  types: TermsType[] = ALL_TYPES,
  revalidate = 3600
): Promise<TermsListItem[]> {
  return apiGet<{ terms: TermsListItem[] }>(
    '/terms',
    { types: types.join(',') },
    revalidate
  ).then((res) => res.terms);
}

// A specific version's content never changes once created (there's no edit
// API — new versions are always new rows), so this can be cached far longer.
export function getTermById(id: number | string, revalidate = 86400): Promise<Term> {
  return apiGet<Term>(`/terms/${id}`, undefined, revalidate);
}
