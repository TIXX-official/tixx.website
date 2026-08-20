import type {
  EventRsvpPrepareRequest,
  EventRsvpPrepareResponse,
  EventRsvpRequest,
  EventRsvpRequirementsRequest,
  EventRsvpRequirementsResponse,
  EventRsvpResponse,
  FileUploadRequest,
  FileUploadResponse,
} from './types';

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
    public readonly code: string,
    // Only set for 429 RSVP_REQUIREMENTS_RATE_LIMITED responses.
    public readonly retryAfterSeconds?: number
  ) {
    super(code);
  }
}

// Server error bodies are `{ statusCode, message, ... }`. `message` is
// usually a stable UPPER_SNAKE_CASE code (e.g. INVALID_PHONE_AUTH_CODE), but
// Zod validation failures can send an array or nested object instead — this
// never throws on shape, it always resolves to a string RsvpError.code.
function extractErrorCode(body: unknown, status: number): string {
  if (body && typeof body === 'object' && 'code' in body) {
    const code = (body as { code: unknown }).code;
    if (typeof code === 'string' && code.length > 0) return code;
  }
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

function extractRetryAfterSeconds(body: unknown): number | undefined {
  if (body && typeof body === 'object' && 'retryAfterSeconds' in body) {
    const value = (body as { retryAfterSeconds: unknown }).retryAfterSeconds;
    if (typeof value === 'number' && Number.isFinite(value)) return value;
  }
  return undefined;
}

const REQUEST_TIMEOUT_MS = 15_000;

async function postJson<T>(
  path: string,
  body: unknown,
  options: { noStore?: boolean } = {}
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${CLIENT_API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.noStore ? { 'Cache-Control': 'no-store' } : {}),
      },
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
    throw new RsvpError(
      res.status,
      extractErrorCode(errorBody, res.status),
      extractRetryAfterSeconds(errorBody)
    );
  }

  return res.json() as Promise<T>;
}

export function issuePhoneAuthCode(
  phone: string
): Promise<{ phone: string; expiredAt: string }> {
  return postJson('/auth/issue-phone-auth-code', { phone });
}

// Called from the browser before OTP issuance (guide §4.2) so the event+IP
// rate limit is scoped to the actual visitor, not this server's own IP.
export function getRsvpRequirements(
  eventId: number | string,
  body: EventRsvpRequirementsRequest
): Promise<EventRsvpRequirementsResponse> {
  return postJson(`/events/${eventId}/rsvp/requirements`, body, {
    noStore: true,
  });
}

// Validates the OTP without consuming it (guide §6) — safe to call more than
// once for the same code while the visitor fills in additional info.
export function prepareEventRsvp(
  eventId: number | string,
  body: EventRsvpPrepareRequest
): Promise<EventRsvpPrepareResponse> {
  return postJson(`/events/${eventId}/rsvp/prepare`, body, {
    noStore: true,
  });
}

export function createEventRsvp(
  eventId: number | string,
  body: EventRsvpRequest
): Promise<EventRsvpResponse> {
  return postJson(`/events/${eventId}/rsvp`, body);
}

// POST /upload (guide §7 "프로필 이미지 업로드") — unauthenticated, returns a
// presigned PUT URL plus the mediaUrl to send back as profileImageUrl.
export function requestProfileImageUpload(
  uploadId: string,
  mimetype: string
): Promise<FileUploadResponse> {
  const body: FileUploadRequest = { folder: 'users', id: uploadId, mimetype };
  return postJson('/upload', body);
}

// Uploads the file directly to R2 via the presigned URL. Accepts a Blob (not
// just File) so a canvas-recompressed image can be uploaded without wrapping
// it in a File first. Throws a plain Error (not RsvpError) on failure — this
// isn't a TIXX API call and has no stable error code to surface.
export async function uploadToPresignedUrl(
  presignedUrl: string,
  file: Blob
): Promise<void> {
  const res = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`Profile image upload failed with status ${res.status}`);
  }
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
