export type RsvpErrorAction =
  | 'stay'
  | 'resend_otp'
  | 'refetch'
  | 'app_fallback'
  | 'event_not_found'
  | 'already_registered';

export interface RsvpErrorResolution {
  messageKey:
    | 'invalidPhoneNumber'
    | 'otpExpired'
    | 'otpInvalid'
    | 'otpAlreadyUsed'
    | 'termsRequired'
    | 'nightMarketingInvalid'
    | 'nameRequired'
    | 'redeemCodeStale'
    | 'notClaimableNow'
    | 'notEligibleForWeb'
    | 'timeout'
    | 'alreadyRegistered'
    | 'soldOut'
    | 'generic';
  action: RsvpErrorAction;
}

// Maps the server's stable UPPER_SNAKE_CASE codes (event-rsvp-phone-auth-
// mobile-web-guide.md §11) to a dictionary key + what the UI should do next.
const CODE_MAP: Record<string, RsvpErrorResolution> = {
  EVENT_NOT_FOUND: { messageKey: 'generic', action: 'event_not_found' },
  RSVP_REQUEST_TIMEOUT: { messageKey: 'timeout', action: 'stay' },
  INVALID_PHONE_NUMBER: { messageKey: 'invalidPhoneNumber', action: 'stay' },
  PHONE_AUTH_CODE_NOT_FOUND: { messageKey: 'otpExpired', action: 'resend_otp' },
  PHONE_AUTH_CODE_EXPIRED: { messageKey: 'otpExpired', action: 'resend_otp' },
  INVALID_PHONE_AUTH_CODE: { messageKey: 'otpInvalid', action: 'stay' },
  PHONE_AUTH_CODE_ALREADY_USED: { messageKey: 'otpAlreadyUsed', action: 'resend_otp' },
  TERMS_NOT_ACCEPTED: { messageKey: 'termsRequired', action: 'stay' },
  NIGHT_MARKETING_REQUIRES_APP_OR_SMS_OPT_IN: {
    messageKey: 'nightMarketingInvalid',
    action: 'stay',
  },
  RSVP_NAME_REQUIRED: { messageKey: 'nameRequired', action: 'stay' },
  RSVP_REDEEM_CODE_NOT_FOUND: { messageKey: 'redeemCodeStale', action: 'refetch' },
  RSVP_REDEEM_CODE_EVENT_MISMATCH: { messageKey: 'redeemCodeStale', action: 'refetch' },
  RSVP_REDEEM_CODE_NOT_GUEST_TICKET: { messageKey: 'notEligibleForWeb', action: 'app_fallback' },
  RSVP_REDEEM_CODE_NOT_CLAIMABLE: { messageKey: 'notClaimableNow', action: 'refetch' },
  RSVP_REDEEM_CODE_NOT_FOR_ALL_USERS: {
    messageKey: 'notEligibleForWeb',
    action: 'app_fallback',
  },
  RSVP_REDEEM_CODE_REQUIRES_PROFILE: {
    messageKey: 'notEligibleForWeb',
    action: 'app_fallback',
  },
  RSVP_REDEEM_CODE_REQUIRES_SOCIAL: {
    messageKey: 'notEligibleForWeb',
    action: 'app_fallback',
  },
  RSVP_REDEEM_CODE_REQUIRES_HOST_APPROVAL: {
    messageKey: 'notClaimableNow',
    action: 'refetch',
  },
  RSVP_REDEEM_RESULT_INVALID: { messageKey: 'generic', action: 'refetch' },
};

// RedemptionService (apps/api/src/redemption/redemption.service.ts) actually
// issues the ticket after event-rsvp's own checks above pass, and its errors
// are free-text English sentences rather than stable UPPER_SNAKE_CASE codes.
// apps/mobile/src/utils/redeemErrors.ts pattern-matches the same messages
// for the same reason — this mirrors that mapping for the subset reachable
// through the public RSVP path (ticket-type target, ALL_USERS, no
// host-approval requirement — event-rsvp.service.ts's assertRsvpRedeemCode
// already rejects everything else before reaching RedemptionService).
const REDEMPTION_MESSAGE_MAP: Record<string, RsvpErrorResolution> = {
  'Redeem code not found': { messageKey: 'redeemCodeStale', action: 'refetch' },
  'Ticket not found': { messageKey: 'redeemCodeStale', action: 'refetch' },
  'This redeem code is not claimable by ID': {
    messageKey: 'notClaimableNow',
    action: 'refetch',
  },
  'This redeem code is not redeemable yet': {
    messageKey: 'notClaimableNow',
    action: 'refetch',
  },
  'This redeem code has expired': { messageKey: 'notClaimableNow', action: 'refetch' },
  'This ticket is disabled': { messageKey: 'notClaimableNow', action: 'refetch' },
  'This redeem code is for approved promoters only': {
    messageKey: 'notEligibleForWeb',
    action: 'app_fallback',
  },
  'This redeem code has reached its limit': { messageKey: 'soldOut', action: 'refetch' },
  // The most common real-world case: a second RSVP submit for a phone number
  // that already holds this ticket (double-tap, or retrying after a request
  // that timed out on the client but actually succeeded on the server).
  'This redeem code has already been redeemed': {
    messageKey: 'alreadyRegistered',
    action: 'already_registered',
  },
  // Duplicate PENDING claim — only reachable if requiresHostApproval was
  // true when this user first claimed and was flipped false afterward,
  // since RSVP_REDEEM_CODE_REQUIRES_HOST_APPROVAL above already blocks
  // host-approval codes before RedemptionService is called. Mapped
  // defensively rather than assumed unreachable.
  'This redeem code has already been applied for': {
    messageKey: 'notClaimableNow',
    action: 'refetch',
  },
};

export function resolveRsvpError(code: string): RsvpErrorResolution {
  return (
    CODE_MAP[code] ??
    REDEMPTION_MESSAGE_MAP[code] ?? { messageKey: 'generic', action: 'refetch' }
  );
}
