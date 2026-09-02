import type { ClaimableRedeemCode, Ticket } from '@/lib/api/types';

/** Filters claimable redeem codes down to the ones eligible for the public
 * web RSVP flow — mirrors the mobile app's event-detail matching logic
 * (guide §4): a guest ticket, open to all users, without a host-approval
 * requirement. requiresProfileImage/requiresSns are no longer exclusion
 * conditions — the RSVP flow now collects that info itself (guide §4/§7)
 * instead of hard-rejecting the candidate. Eligible codes are returned in
 * event-ticket order so the first candidate matches the mobile app policy. */
export function selectRsvpCandidates(
  codes: ClaimableRedeemCode[],
  tickets: Ticket[]
): ClaimableRedeemCode[] {
  const ticketOrder = new Map(
    tickets.map((ticket, index) => [ticket.id, index])
  );

  return codes.filter((code) => {
    const ticket = tickets.find((t) => t.id === code.ticketId);
    return (
      code.targetType === 'ticket' &&
      ticket?.type === 'guest' &&
      code.targetUserType === 'ALL_USERS' &&
      !code.requiresHostApproval
    );
  }).sort(
    (left, right) =>
      (ticketOrder.get(left.ticketId ?? -1) ?? Number.MAX_SAFE_INTEGER) -
      (ticketOrder.get(right.ticketId ?? -1) ?? Number.MAX_SAFE_INTEGER)
  );
}
