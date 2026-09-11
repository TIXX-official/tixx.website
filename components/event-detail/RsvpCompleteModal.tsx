"use client";

import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { AppCTA } from "@/components/detail/AppCTA";
import { Text } from "@/components/detail/Text";
import { dictionary } from "@/lib/dictionary";
import { useLanguage } from "@/lib/LanguageContext";

function RsvpCompleteModal({
  eventId,
  already,
  isRsvp,
  onClose,
}: {
  eventId: number;
  already: boolean;
  isRsvp: boolean;
  onClose: () => void;
}) {
  const { language } = useLanguage();
  const t = dictionary[language].eventRsvp;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-grayscale-900 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end px-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30"
          >
            <X size={18} color="white" />
          </button>
        </div>
        <div className="flex flex-col items-center px-6 pb-6 pt-1 text-center">
          <Text as="h1" variant="h1Semibold" className="mb-2">
            {already ? t.alreadyRegisteredTitle : t.completedTitle}
          </Text>
          <Text variant="body1Regular" className="text-grayscale-300">
            {isRsvp ? t.completedDescriptionRsvp : t.completedDescription}
          </Text>
        </div>
        {/* AppCTA's own padding collapses to 0 at the lg breakpoint (it
            assumes a full-width mobile footer vs. a desktop sidebar with
            parent-provided spacing) — neither fits this small card, so
            padding is forced here regardless of viewport. */}
        <div className="px-6 pb-6">
          <AppCTA
            label={isRsvp ? t.openAppRsvp : t.openApp}
            deepLink={`tixx://event/${eventId}`}
            sourceSurface="event_rsvp_complete"
            contextType="event"
            contextId={eventId}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Reads the ?guestRegistered=1 query param that EventRsvpFlow's
 * goToCompletedOnDetail redirects to after a guest finishes (or already
 * completed) the /events/[id]/rsvp flow, and shows the completion state as a
 * modal on top of the event detail page instead of that flow rendering its
 * own full-page completion screen. Isolated in its own component (rather
 * than reading useSearchParams directly in EventDetailContent) so only this
 * leaf needs the Suspense boundary useSearchParams requires.
 */
export function RsvpCompleteModalGate({ eventId }: { eventId: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (searchParams.get("guestRegistered") !== "1") return null;

  return (
    <RsvpCompleteModal
      eventId={eventId}
      already={searchParams.get("already") === "1"}
      isRsvp={searchParams.get("rsvp") === "1"}
      onClose={() => router.replace(`/events/${eventId}`, { scroll: false })}
    />
  );
}
