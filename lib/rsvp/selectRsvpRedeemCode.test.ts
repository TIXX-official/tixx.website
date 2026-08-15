import { describe, expect, it } from 'vitest';
import { selectRsvpCandidates } from './selectRsvpRedeemCode';
import type { ClaimableRedeemCode, Ticket } from '@/lib/api/types';

function ticket(overrides: Partial<Ticket> = {}): Ticket {
  return {
    id: 1,
    eventId: 100,
    hostId: null,
    scopeType: 'event',
    name: 'Guest',
    type: 'guest',
    description: null,
    startAt: '2026-08-01T00:00:00.000Z',
    endAt: '2026-08-31T00:00:00.000Z',
    originalPrice: null,
    price: null,
    quantity: null,
    remainQuantity: 10,
    coupons: [],
    ...overrides,
  };
}

function code(overrides: Partial<ClaimableRedeemCode> = {}): ClaimableRedeemCode {
  return {
    id: 1,
    targetType: 'ticket',
    ticketId: 1,
    targetUserType: 'ALL_USERS',
    requiresProfileImage: false,
    requiresSns: false,
    requiresHostApproval: false,
    label: null,
    description: null,
    available: 5,
    ...overrides,
  };
}

describe('selectRsvpCandidates', () => {
  it('passes a guest ticket code open to all users with no extra requirements', () => {
    const tickets = [ticket()];
    const codes = [code()];
    expect(selectRsvpCandidates(codes, tickets)).toEqual(codes);
  });

  it('excludes codes whose ticket is not a guest ticket', () => {
    const tickets = [ticket({ id: 2, type: 'paid' })];
    const codes = [code({ ticketId: 2 })];
    expect(selectRsvpCandidates(codes, tickets)).toEqual([]);
  });

  it('excludes non-ticket target types', () => {
    const tickets = [ticket()];
    const codes = [code({ targetType: 'voucher' })];
    expect(selectRsvpCandidates(codes, tickets)).toEqual([]);
  });

  it('excludes codes not targeted at all users', () => {
    const tickets = [ticket()];
    const codes = [code({ targetUserType: 'FOLLOWERS' })];
    expect(selectRsvpCandidates(codes, tickets)).toEqual([]);
  });

  it('excludes codes requiring profile image, SNS, or host approval', () => {
    const tickets = [ticket()];
    expect(
      selectRsvpCandidates([code({ requiresProfileImage: true })], tickets)
    ).toEqual([]);
    expect(
      selectRsvpCandidates([code({ requiresSns: true })], tickets)
    ).toEqual([]);
    expect(
      selectRsvpCandidates([code({ requiresHostApproval: true })], tickets)
    ).toEqual([]);
  });

  it('returns zero, one, or multiple candidates depending on the input', () => {
    const tickets = [ticket({ id: 1 }), ticket({ id: 2 })];
    expect(selectRsvpCandidates([], tickets)).toHaveLength(0);
    expect(
      selectRsvpCandidates([code({ id: 1, ticketId: 1 })], tickets)
    ).toHaveLength(1);
    expect(
      selectRsvpCandidates(
        [code({ id: 1, ticketId: 1 }), code({ id: 2, ticketId: 2 })],
        tickets
      )
    ).toHaveLength(2);
  });
});
