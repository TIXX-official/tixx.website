import { describe, expect, it } from 'vitest';
import { buildEventDetailRsvpActions } from './eventDetailRsvpActions';

describe('buildEventDetailRsvpActions', () => {
  it('returns only the public registration action without a guest code', () => {
    expect(
      buildEventDetailRsvpActions({
        eventId: 100,
        hasRsvpCandidate: true,
      })
    ).toEqual([{ kind: 'public', href: '/events/100/rsvp' }]);
  });

  it('returns public registration before the encoded code action', () => {
    expect(
      buildEventDetailRsvpActions({
        eventId: 100,
        guestCode: ' VIP 2026 ',
        hasRsvpCandidate: true,
      })
    ).toEqual([
      { kind: 'public', href: '/events/100/rsvp' },
      { kind: 'code', href: '/events/100/rsvp?code=VIP%202026' },
    ]);
  });

  it('keeps the code action when no public candidate is available', () => {
    expect(
      buildEventDetailRsvpActions({
        eventId: 100,
        guestCode: 'VIP-2026',
        hasRsvpCandidate: false,
      })
    ).toEqual([
      { kind: 'code', href: '/events/100/rsvp?code=VIP-2026' },
    ]);
  });

  it('returns no actions without a public candidate or guest code', () => {
    expect(
      buildEventDetailRsvpActions({
        eventId: 100,
        guestCode: '   ',
        hasRsvpCandidate: false,
      })
    ).toEqual([]);
  });
});
