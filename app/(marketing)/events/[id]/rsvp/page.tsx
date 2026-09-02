import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventRsvpFlow } from "@/components/event-rsvp/EventRsvpFlow";
import { ApiNotFoundError } from "@/lib/api/client";
import { getEvent } from "@/lib/api/events";
import { getClaimableRedeemCodes } from "@/lib/api/redeem-codes";
import type { EventRsvpRedeemTarget } from "@/lib/api/types";
import { normalizeGuestCode } from "@/lib/guestCode";
import { selectRsvpCandidates } from "@/lib/rsvp/selectRsvpRedeemCode";
import { buildEventMetadata } from "@/lib/seo/detailMetadata";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ code?: string | string[] }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const event = await getEvent(id);
    return buildEventMetadata(event);
  } catch {
    return { title: "TIXX" };
  }
}

export default async function EventRsvpPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { code } = await searchParams;

  let event;
  try {
    event = await getEvent(id);
  } catch (error) {
    if (error instanceof ApiNotFoundError) notFound();
    throw error;
  }

  const guestCode = normalizeGuestCode(code);
  let redeemTarget: EventRsvpRedeemTarget | null = guestCode
    ? { code: guestCode }
    : null;

  if (!redeemTarget) {
    // Never cached (getClaimableRedeemCodes uses revalidate: 0) — quantity
    // moves in real time between this read and the eventual RSVP submit, so
    // this list only picks a candidate to submit; the RSVP response is the
    // only source of truth for whether the claim actually succeeded.
    const claimableCodes = await getClaimableRedeemCodes(id).catch(() => []);
    const candidates = selectRsvpCandidates(claimableCodes, event.tickets);
    // Candidate order follows event.tickets, matching the mobile app. The
    // RSVP response remains the source of truth if availability changed.
    redeemTarget = candidates[0]
      ? { redeemCodeId: candidates[0].id }
      : null;
  }

  return (
    <EventRsvpFlow
      event={{ id: event.id, name: event.name }}
      redeemTarget={redeemTarget}
    />
  );
}
