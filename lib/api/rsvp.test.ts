import { afterEach, describe, expect, it, vi } from 'vitest';
import { createEventRsvp, issuePhoneAuthCode, RsvpError } from './rsvp';

function mockFetchOnce(status: number, body: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: async () => body,
    })
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('createEventRsvp', () => {
  it('resolves with the parsed response on success', async () => {
    const response = {
      jwt: 'jwt-token',
      user: { id: 1, uuid: 'u', name: 'Guest', phone: '+821012345678' },
      isNew: 1,
      rsvp: {
        eventId: 100,
        redeemCodeId: 5,
        redeemHistoryId: 900,
        eventTicketId: 901,
        status: 'issued',
      },
    };
    mockFetchOnce(200, response);

    await expect(
      createEventRsvp(100, {
        phone: '+821012345678',
        authCode: '123456',
        marketingOptIn: 0,
        marketingSmsOptIn: 0,
        marketingEmailOptIn: 0,
        marketingNightOptIn: 0,
        redeemCodeId: 5,
      })
    ).resolves.toEqual(response);
  });

  it('converts a string message error body into RsvpError.code', async () => {
    mockFetchOnce(400, { statusCode: 400, message: 'INVALID_PHONE_AUTH_CODE' });

    const error = await createEventRsvp(100, {
      phone: '+821012345678',
      authCode: 'wrong',
      marketingOptIn: 0,
      marketingSmsOptIn: 0,
      marketingEmailOptIn: 0,
      marketingNightOptIn: 0,
      redeemCodeId: 5,
    }).catch((e) => e);

    expect(error).toBeInstanceOf(RsvpError);
    expect((error as RsvpError).code).toBe('INVALID_PHONE_AUTH_CODE');
    expect((error as RsvpError).status).toBe(400);
  });

  it('converts an array message (Zod validation) error body into RsvpError.code', async () => {
    mockFetchOnce(400, { statusCode: 400, message: ['name should not be empty'] });

    const error = await createEventRsvp(100, {
      phone: '+821012345678',
      authCode: '123456',
      marketingOptIn: 0,
      marketingSmsOptIn: 0,
      marketingEmailOptIn: 0,
      marketingNightOptIn: 0,
      redeemCodeId: 5,
    }).catch((e) => e);

    expect(error).toBeInstanceOf(RsvpError);
    expect((error as RsvpError).code).toBe('name should not be empty');
  });

  it('falls back to a status-derived code when the body has no usable message', async () => {
    mockFetchOnce(500, null);

    const error = await createEventRsvp(100, {
      phone: '+821012345678',
      authCode: '123456',
      marketingOptIn: 0,
      marketingSmsOptIn: 0,
      marketingEmailOptIn: 0,
      marketingNightOptIn: 0,
      redeemCodeId: 5,
    }).catch((e) => e);

    expect(error).toBeInstanceOf(RsvpError);
    expect((error as RsvpError).code).toBe('RSVP_REQUEST_FAILED_500');
  });

  it('converts an AbortSignal.timeout() abort into RSVP_REQUEST_TIMEOUT, not a definite failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new DOMException('The operation timed out.', 'TimeoutError'))
    );

    const error = await createEventRsvp(100, {
      phone: '+821012345678',
      authCode: '123456',
      marketingOptIn: 0,
      marketingSmsOptIn: 0,
      marketingEmailOptIn: 0,
      marketingNightOptIn: 0,
      redeemCodeId: 5,
    }).catch((e) => e);

    expect(error).toBeInstanceOf(RsvpError);
    expect((error as RsvpError).code).toBe('RSVP_REQUEST_TIMEOUT');
  });
});

describe('issuePhoneAuthCode', () => {
  it('resolves with the normalized phone and expiry', async () => {
    mockFetchOnce(200, {
      phone: '+821012345678',
      expiredAt: '2026-08-13T12:03:00.000Z',
    });

    await expect(issuePhoneAuthCode('010-1234-5678')).resolves.toEqual({
      phone: '+821012345678',
      expiredAt: '2026-08-13T12:03:00.000Z',
    });
  });
});
