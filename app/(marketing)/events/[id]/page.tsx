import type { Metadata } from "next";
import { EventDetailPage as EventDetailPageContent } from "@/components/event-detail/EventDetailPage";
import { getEvent } from "@/lib/api/events";
import { normalizeGuestCode } from "@/lib/guestCode";
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

export default async function EventDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { code } = await searchParams;
  return (
    <EventDetailPageContent id={id} guestCode={normalizeGuestCode(code)} />
  );
}
