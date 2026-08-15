import { describe, expect, it } from 'vitest';
import { resolveRsvpError } from './resolveRsvpError';

describe('resolveRsvpError', () => {
  it('maps INVALID_PHONE_NUMBER to staying on the phone step', () => {
    expect(resolveRsvpError('INVALID_PHONE_NUMBER')).toEqual({
      messageKey: 'invalidPhoneNumber',
      action: 'stay',
    });
  });

  it('maps expired/not-found OTP codes to resend_otp', () => {
    expect(resolveRsvpError('PHONE_AUTH_CODE_NOT_FOUND').action).toBe('resend_otp');
    expect(resolveRsvpError('PHONE_AUTH_CODE_EXPIRED').action).toBe('resend_otp');
  });

  it('maps requirement codes the web flow cannot satisfy to app_fallback', () => {
    expect(resolveRsvpError('RSVP_REDEEM_CODE_NOT_GUEST_TICKET').action).toBe(
      'app_fallback'
    );
    expect(resolveRsvpError('RSVP_REDEEM_CODE_NOT_FOR_ALL_USERS').action).toBe(
      'app_fallback'
    );
    expect(resolveRsvpError('RSVP_REDEEM_CODE_REQUIRES_PROFILE').action).toBe(
      'app_fallback'
    );
    expect(resolveRsvpError('RSVP_REDEEM_CODE_REQUIRES_SOCIAL').action).toBe(
      'app_fallback'
    );
  });

  it('maps stale-redeem-code codes to refetch', () => {
    expect(resolveRsvpError('RSVP_REDEEM_CODE_NOT_FOUND').action).toBe('refetch');
    expect(resolveRsvpError('RSVP_REDEEM_CODE_EVENT_MISMATCH').action).toBe('refetch');
  });

  it('falls back to a generic refetch resolution for unknown codes', () => {
    expect(resolveRsvpError('SOME_UNMAPPED_CODE')).toEqual({
      messageKey: 'generic',
      action: 'refetch',
    });
  });
});
