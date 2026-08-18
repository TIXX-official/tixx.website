import type { Ticket, TicketType } from '@/lib/api/types';

// Port of apps/mobile/src/utils/formatters.ts isPurchasableTicketType.
export function isPurchasableTicketType(type: TicketType): boolean {
  return type === 'paid' || type === 'table';
}

export type EventCtaState =
  | { kind: 'buy' }
  | { kind: 'claim' }
  | { kind: 'waitlist' }
  | { kind: 'none' };

/** Mirrors the button-priority logic in EventDetailScreenContent.tsx /
 * HostDetailScreen.tsx: buy > claim guest ticket > waitlist > nothing. */
export function resolveEventCtaState(tickets: Ticket[]): EventCtaState {
  const now = new Date();
  const purchasable = tickets.filter(
    (t) => isPurchasableTicketType(t.type) && t.remainQuantity > 0
  );
  if (purchasable.length > 0) return { kind: 'buy' };

  const hasClaimableCoupon = tickets.some((t) =>
    t.coupons.some((c) => c.isClaimable)
  );
  if (hasClaimableCoupon) return { kind: 'claim' };

  const hasSoldOutWaitlistTicket = tickets.some(
    (t) =>
      (t.type === 'guest' || t.type === 'paid' || t.type === 'table') &&
      t.remainQuantity <= 0 &&
      new Date(t.endAt) > now
  );
  if (hasSoldOutWaitlistTicket) return { kind: 'waitlist' };

  return { kind: 'none' };
}
