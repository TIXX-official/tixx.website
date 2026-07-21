import { formatInTimeZone } from 'date-fns-tz';

const KST = 'Asia/Seoul';

// effectiveAt is always stored as KST midnight (e.g. "...T15:00:00.000Z" ==
// 00:00 KST the next day) — format in KST so the displayed/linked date
// matches the date admins actually scheduled, not the UTC calendar date
// (which reads a day behind).
export function effectiveDateKST(effectiveAt: string): string {
  return formatInTimeZone(new Date(effectiveAt), KST, 'yyyy-MM-dd');
}

// Isolated in its own function (rather than inlined at the call site) since
// `Date.now()` is flagged as an impure call by the React purity lint rule
// when it appears directly inside a component body.
export function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}
