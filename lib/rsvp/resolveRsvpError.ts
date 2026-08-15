export type RsvpErrorAction = 'stay' | 'resend_otp' | 'refetch' | 'app_fallback';

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
    | 'generic';
  action: RsvpErrorAction;
}

// Maps the server's stable UPPER_SNAKE_CASE codes (event-rsvp-phone-auth-
// mobile-web-guide.md §11) to a dictionary key + what the UI should do next.
// Codes not listed here (duplicate RSVP / quantity-exhausted messages from
// RedemptionService aren't normalized to a code yet, per the guide) fall
// through to 'generic' + 'refetch' rather than pattern-matching on message
// text, which the guide explicitly says not to treat as a stable contract.
const CODE_MAP: Record<string, RsvpErrorResolution> = {
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

export function resolveRsvpError(code: string): RsvpErrorResolution {
  return CODE_MAP[code] ?? { messageKey: 'generic', action: 'refetch' };
}
