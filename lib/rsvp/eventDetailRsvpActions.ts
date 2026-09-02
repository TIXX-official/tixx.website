export type EventDetailRsvpAction = {
  kind: 'public' | 'code';
  href: string;
};

export function buildEventDetailRsvpActions({
  eventId,
  guestCode,
  hasRsvpCandidate,
}: {
  eventId: number | string;
  guestCode?: string;
  hasRsvpCandidate: boolean;
}): EventDetailRsvpAction[] {
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
