import { notFound } from 'next/navigation';
import { AppHandoff } from '@/components/detail/AppHandoff';
import { EventDetailContent } from '@/components/event-detail/EventDetailContent';
import { ApiNotFoundError } from '@/lib/api/client';
import { getEvent } from '@/lib/api/events';
import { getClaimableRedeemCodes } from '@/lib/api/redeem-codes';
import { selectRsvpCandidates } from '@/lib/rsvp/selectRsvpRedeemCode';
import { buildEventJsonLd } from '@/lib/seo/jsonLd';
import { absoluteUrl } from '@/lib/siteUrl';

export async function EventDetailPage({ id }: { id: string }) {
  let event;
  try {
    event = await getEvent(id);
  } catch (error) {
    if (error instanceof ApiNotFoundError) notFound();
    throw error;
  }

  const jsonLd = buildEventJsonLd(event, absoluteUrl(`/events/${id}`));

  // Mirrors the RSVP page's own eligibility check (app/(marketing)/events/
  // [id]/rsvp/page.tsx) so the CTA only appears when that page can actually
  // proceed — a plain coupon.code/isClaimable check on the event-detail
  // response isn't equivalent (see docs/rsvp-phone-auth-frontend-
  // implementation-audit.md §1.4).
  const claimableCodes = await getClaimableRedeemCodes(id).catch(() => []);
  const rsvpCandidates = selectRsvpCandidates(claimableCodes, event.tickets);
  const hasRsvpCandidate = rsvpCandidates.length === 1;

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppHandoff
        kind='event'
        id={event.id}
        enabledTargets={process.env.AUTO_APP_HANDOFF_TARGETS ?? ''}
      />
      <EventDetailContent event={event} hasRsvpCandidate={hasRsvpCandidate} />
    </>
  );
}
