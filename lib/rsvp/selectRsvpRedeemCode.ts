import type { ClaimableRedeemCode, Ticket } from '@/lib/api/types';

/** Filters claimable redeem codes down to the ones eligible for the public
 * web RSVP flow — mirrors the mobile app's event-detail matching logic
 * (guide §4): a guest ticket, open to all users, without a host-approval
 * requirement. requiresProfileImage/requiresSns are no longer exclusion
 * conditions — the RSVP flow now collects that info itself (guide §4/§7)
 * instead of hard-rejecting the candidate. */
export function selectRsvpCandidates(
  codes: ClaimableRedeemCode[],
  tickets: Ticket[]
): ClaimableRedeemCode[] {
  return codes.filter((code) => {
    const ticket = tickets.find((t) => t.id === code.ticketId);
    return (
      code.targetType === 'ticket' &&
      ticket?.type === 'guest' &&
      code.targetUserType === 'ALL_USERS' &&
      !code.requiresHostApproval
    );
  });
}
