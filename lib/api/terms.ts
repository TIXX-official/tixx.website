import { apiGet } from './client';
import type { Term, TermsType } from './types';

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
