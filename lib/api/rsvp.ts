import type { EventRsvpRequest, EventRsvpResponse } from './types';

// Both calls here run from the browser (no login/session to proxy through a
// server action — OTP is the auth), so like submitRsvpForm in rsvp-forms.ts
// this needs the build-time-inlined public base URL, not the server-only
// TIXX_API_BASE_URL. The API's CORS allowlist includes https://tixx.im and
// https://www.tixx.im (apps/api/src/main.ts) for this reason.
const CLIENT_API_BASE_URL =
  process.env.NEXT_PUBLIC_TIXX_API_BASE_URL ?? 'https://api.tixx.im';

export class RsvpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string
  ) {
    super(code);
  }
}

// Server error bodies are `{ statusCode, message, ... }`. `message` is
// usually a stable UPPER_SNAKE_CASE code (e.g. INVALID_PHONE_AUTH_CODE), but
// Zod validation failures can send an array or nested object instead — this
// never throws on shape, it always resolves to a string RsvpError.code.
function extractErrorCode(body: unknown, status: number): string {
  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message: unknown }).message;
    if (typeof message === 'string' && message.length > 0) return message;
    if (Array.isArray(message)) {
      const first = message.find((item) => typeof item === 'string');
      if (first) return first;
    }
  }
  return `RSVP_REQUEST_FAILED_${status}`;
}

const REQUEST_TIMEOUT_MS = 15_000;

async function postJson<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${CLIENT_API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    // AbortSignal.timeout() aborts with a TimeoutError DOMException (some
    // runtimes surface it as AbortError instead) — the server's commit state
    // is unknown here, so this must not be treated as a definite failure.
    if (
      error instanceof DOMException &&
      (error.name === 'TimeoutError' || error.name === 'AbortError')
    ) {
      throw new RsvpError(0, 'RSVP_REQUEST_TIMEOUT');
    }
    throw error;
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new RsvpError(res.status, extractErrorCode(errorBody, res.status));
  }

  return res.json() as Promise<T>;
}

export function issuePhoneAuthCode(
  phone: string
): Promise<{ phone: string; expiredAt: string }> {
  return postJson('/auth/issue-phone-auth-code', { phone });
}

export function createEventRsvp(
  eventId: number | string,
  body: EventRsvpRequest
): Promise<EventRsvpResponse> {
  return postJson(`/events/${eventId}/rsvp`, body);
}

// GET /users?phoneNumber= is an unauthenticated lookup (no @UseGuards on
// UsersController.getUsers) — apps/mobile's checkPhoneNumber.ts already
// calls it pre-login for the same reason. Used here to skip the name/terms
// step for phone numbers that already have an account, since the RSVP
// endpoint silently ignores that input for existing users anyway
// (event-rsvp.service.ts only applies it when creating a brand-new user).
// Never throws: a failed/timed-out check just falls back to treating the
// number as new, which only costs the user an unnecessary name/terms step.
export async function checkPhoneRegistered(phone: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${CLIENT_API_BASE_URL}/users?phoneNumber=${encodeURIComponent(phone)}`,
      { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) }
    );
    if (!res.ok) return false;
    const body = await res.json().catch(() => null);
    return Boolean(body && typeof body === 'object' && 'id' in body);
  } catch {
    return false;
  }
}
