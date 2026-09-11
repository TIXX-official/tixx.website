import { useCallback, useSyncExternalStore } from 'react';

const KEY_PREFIX = 'rsvp:ticketHolder:';

// sessionStorage (not localStorage) on purpose: this only needs to last for
// the current tab's session, and can throw in private-browsing/storage-
// blocked contexts, so every access is guarded.

/** Call after a visitor successfully registers (or is told they already
 * registered) on the web RSVP flow for `eventId` — records that this
 * session has confirmed attendance, which is the only signal this
 * session-less site has for "holds a ticket" (see useHasTicketHolderSession
 * below, used by EventDetailContent to gate the guest list). */
export function markTicketHolderSession(eventId: number | string): void {
  try {
    sessionStorage.setItem(`${KEY_PREFIX}${eventId}`, '1');
  } catch {
    // storage unavailable — nothing to do, just means this visitor won't
    // see the guest list for a ticket-holders-only event this session
  }
}

export function hasTicketHolderSession(eventId: number | string): boolean {
  try {
    return sessionStorage.getItem(`${KEY_PREFIX}${eventId}`) === '1';
  } catch {
    return false;
  }
}

const noSubscription = () => () => {};

/** SSR-safe read of hasTicketHolderSession: sessionStorage isn't available
 * during server rendering, so useSyncExternalStore renders `false` there
 * and on the client's first paint (matching the server, no hydration
 * mismatch), then re-renders with the real value right after. There's
 * nothing to subscribe to — this session's own markTicketHolderSession call
 * is the only writer, and it always causes a navigation/state update of its
 * own that re-mounts this hook's caller anyway. */
export function useHasTicketHolderSession(eventId: number | string): boolean {
  const getSnapshot = useCallback(
    () => hasTicketHolderSession(eventId),
    [eventId],
  );
  const getServerSnapshot = useCallback(() => false, []);
  return useSyncExternalStore(noSubscription, getSnapshot, getServerSnapshot);
}
