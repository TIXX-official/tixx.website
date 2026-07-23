import { apiGet } from './client';
import type {
  CreateRsvpSubmissionRequest,
  RsvpForm,
  RsvpSubmissionErrorResponse,
} from './types';

/** GET /rsvp-forms/:id — public, unauthenticated, called server-side at render time. */
export function getRsvpForm(id: number | string): Promise<RsvpForm> {
  return apiGet<RsvpForm>(`/rsvp-forms/${id}`);
}

// Submission happens from the browser (no login, so there's no session to
// proxy through a server action), which means it needs a build-time-inlined
// base URL rather than server-only `TIXX_API_BASE_URL` — see
// NEXT_PUBLIC_TIXX_API_BASE_URL in .env.example. The API's CORS allowlist
// must include this site's origin(s) for the request to succeed (see
// docs/rsvp-form-api-requirements.md section 1).
const CLIENT_API_BASE_URL =
  process.env.NEXT_PUBLIC_TIXX_API_BASE_URL ?? 'https://api.tixx.im';

export class RsvpSubmissionError extends Error {
  constructor(public readonly response: RsvpSubmissionErrorResponse) {
    super(response.message ?? response.code);
  }
}

export async function submitRsvpForm(
  id: number | string,
  payload: CreateRsvpSubmissionRequest
): Promise<void> {
  const res = await fetch(`${CLIENT_API_BASE_URL}/rsvp-forms/${id}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (res.status === 404) {
    throw new RsvpSubmissionError({ code: 'FORM_NOT_FOUND' });
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as RsvpSubmissionErrorResponse | null;
    throw new RsvpSubmissionError(
      body ?? { code: 'VALIDATION_ERROR', message: `RSVP submission failed (${res.status})` }
    );
  }
}
