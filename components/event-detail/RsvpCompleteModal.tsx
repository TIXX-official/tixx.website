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
    <div className="fixed inset-0 z-50 flex flex-col bg-black px-4 pb-6 pt-4 text-white">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/55"
        >
          <X size={22} color="white" />
        </button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <Text as="h1" variant="h1Semibold" className="mb-3">
          {already ? t.alreadyRegisteredTitle : t.completedTitle}
        </Text>
        <Text variant="body1Regular" className="max-w-md text-grayscale-300">
          {isRsvp ? t.completedDescriptionRsvp : t.completedDescription}
        </Text>
      </div>
      <AppCTA
        label={isRsvp ? t.openAppRsvp : t.openApp}
        deepLink={`tixx://event/${eventId}`}
        sourceSurface="event_rsvp_complete"
        contextType="event"
        contextId={eventId}
      />
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
