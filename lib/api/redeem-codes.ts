import { apiGet } from './client';
import type { ClaimableRedeemCode } from './types';

/** GET /events/:eventId/redeem-codes/claimable — server-side, unauthenticated.
 * Remaining quantity changes in real time, so this is never cached: the list
 * is only used to pick a candidate redeemCodeId to submit with, and the
 * actual claim result is decided by the RSVP response, not this list. */
export function getClaimableRedeemCodes(
  eventId: number | string
): Promise<ClaimableRedeemCode[]> {
  return apiGet<ClaimableRedeemCode[]>(
    `/events/${eventId}/redeem-codes/claimable`,
    undefined,
    0
  );
}
