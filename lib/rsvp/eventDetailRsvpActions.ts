export type EventDetailRsvpAction = {
  kind: 'public' | 'code' | 'rsvp';
  href: string;
};

export function buildEventDetailRsvpActions({
  eventId,
  guestCode,
  hasRsvpCandidate,
  isRsvp = false,
}: {
  eventId: number | string;
  guestCode?: string;
  hasRsvpCandidate: boolean;
  /** rsvp-type event: attendance registration with no redeem or guest code.
   * Exactly one action, and any ?code= is ignored (the API rejects it). */
  isRsvp?: boolean;
}): EventDetailRsvpAction[] {
  if (isRsvp) {
    return [{ kind: 'rsvp', href: `/events/${eventId}/rsvp` }];
  }

  const actions: EventDetailRsvpAction[] = [];
  const normalizedGuestCode = guestCode?.trim() || undefined;

  if (hasRsvpCandidate) {
    actions.push({ kind: 'public', href: `/events/${eventId}/rsvp` });
  }

  if (normalizedGuestCode) {
    actions.push({
      kind: 'code',
      href: `/events/${eventId}/rsvp?code=${encodeURIComponent(normalizedGuestCode)}`,
    });
  }

  return actions;
}
