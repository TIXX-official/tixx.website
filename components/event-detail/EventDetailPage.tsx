import { notFound } from "next/navigation";
import { AppHandoff } from "@/components/detail/AppHandoff";
import { EventDetailContent } from "@/components/event-detail/EventDetailContent";
import { ApiNotFoundError } from "@/lib/api/client";
import { getEvent } from "@/lib/api/events";
import { getClaimableRedeemCodes } from "@/lib/api/redeem-codes";
import { selectRsvpCandidates } from "@/lib/rsvp/selectRsvpRedeemCode";
import { buildEventJsonLd } from "@/lib/seo/jsonLd";
import { absoluteUrl } from "@/lib/siteUrl";

export async function EventDetailPage({
  id,
  guestCode,
}: {
  id: string;
  guestCode?: string;
}) {
  let event;
  try {
    event = await getEvent(id);
  } catch (error) {
    if (error instanceof ApiNotFoundError) notFound();
    throw error;
  }

  const jsonLd = buildEventJsonLd(event, absoluteUrl(`/events/${id}`));

  const normalizedGuestCode = guestCode?.trim() || undefined;
  // Code links expose both the public RSVP and code-registration actions.
  // Each action still submits exactly one redeem target on the RSVP page.
  const claimableCodes = await getClaimableRedeemCodes(id).catch(() => []);
  const hasRsvpCandidate =
    selectRsvpCandidates(claimableCodes, event.tickets).length > 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppHandoff
        kind="event"
        id={event.id}
        guestCode={normalizedGuestCode}
        enabledTargets={process.env.AUTO_APP_HANDOFF_TARGETS ?? ""}
      />
      <EventDetailContent
        event={event}
        guestCode={normalizedGuestCode}
        hasRsvpCandidate={hasRsvpCandidate}
      />
    </>
  );
}
