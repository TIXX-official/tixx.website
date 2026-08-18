import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventRsvpFlow } from '@/components/event-rsvp/EventRsvpFlow';
import { ApiNotFoundError } from '@/lib/api/client';
import { getEvent } from '@/lib/api/events';
import { getClaimableRedeemCodes } from '@/lib/api/redeem-codes';
import { selectRsvpCandidates } from '@/lib/rsvp/selectRsvpRedeemCode';
import { buildEventMetadata } from '@/lib/seo/detailMetadata';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const event = await getEvent(id);
    return buildEventMetadata(event);
  } catch {
    return { title: 'TIXX' };
  }
}

export default async function EventRsvpPage({ params }: PageProps) {
  const { id } = await params;

  let event;
  try {
    event = await getEvent(id);
  } catch (error) {
    if (error instanceof ApiNotFoundError) notFound();
    throw error;
  }

  // Never cached (getClaimableRedeemCodes uses revalidate: 0) — quantity
  // moves in real time between this read and the eventual RSVP submit, so
  // this list only picks a candidate to submit; the RSVP response is the
  // only source of truth for whether the claim actually succeeded.
  const claimableCodes = await getClaimableRedeemCodes(id).catch(() => []);
  const candidates = selectRsvpCandidates(claimableCodes, event.tickets);
  // Exactly one eligible code is required to proceed — zero means nothing
  // claimable here, two or more means the "which one" policy isn't decided
  // yet (docs/rsvp-phone-auth-frontend-work-breakdown.md §2.5). Either way
  // EventRsvpFlow falls back to the app CTA rather than guessing.
  const redeemCodeId = candidates.length === 1 ? candidates[0].id : null;

  return (
    <EventRsvpFlow event={{ id: event.id, name: event.name }} redeemCodeId={redeemCodeId} />
  );
}
