import type { Metadata } from "next";
import { EventDetailPage } from "@/components/event-detail/EventDetailPage";
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
    return buildEventMetadata(event, { noIndex: true });
  } catch {
    return { title: "TIXX", robots: { index: false, follow: true } };
  }
}

export default async function SharedEventPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { code } = await searchParams;
  return <EventDetailPage id={id} guestCode={normalizeGuestCode(code)} />;
}
