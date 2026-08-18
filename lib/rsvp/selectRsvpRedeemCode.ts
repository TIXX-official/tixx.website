import type { ClaimableRedeemCode, Ticket } from '@/lib/api/types';

/** Filters claimable redeem codes down to the ones eligible for the public
 * web RSVP flow — mirrors the mobile app's event-detail matching logic
 * (guide §4): a guest ticket, open to all users, with none of the
 * profile/SNS/host-approval requirements that only the app flow supports. */
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
      !code.requiresProfileImage &&
      !code.requiresSns &&
      !code.requiresHostApproval
    );
  });
}
