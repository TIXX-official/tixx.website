"use client";

import { type CSSProperties, useState } from "react";
import { Text } from "@/components/detail/Text";
import type { EventRsvpSnsPlatform, EventRsvpSnsProfile } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full border-b border-current bg-transparent px-2 py-2 outline-none placeholder:text-[color:var(--rsvp-answer-placeholder-color)]";
const inputStyle: CSSProperties = { color: "var(--rsvp-answer-color)" };

// Instagram/TikTok only — the third platform the backend still accepts
// (youtube) isn't offered here per product decision.
const PLATFORMS: EventRsvpSnsPlatform[] = ["instagram", "tiktok"];

interface SnsProfileFieldProps {
  value: EventRsvpSnsProfile | null;
  onChange: (value: EventRsvpSnsProfile | null) => void;
  disabled?: boolean;
  label: string;
  handlePlaceholder: string;
  platformLabels: Partial<Record<EventRsvpSnsPlatform, string>>;
}

export function SnsProfileField({
  value,
  onChange,
  disabled,
  label,
  handlePlaceholder,
  platformLabels,
}: SnsProfileFieldProps) {
  // Tracked locally rather than derived from `value` — value collapses to
  // null while the handle is still empty (nothing to submit yet), which
  // would otherwise make a platform click before typing anything look like
  // it did nothing, since the derived platform would snap back to the
  // default on every render.
  const [platform, setPlatformState] = useState<EventRsvpSnsPlatform>(
    value?.platform ?? "instagram",
  );
  const [handle, setHandleState] = useState(value?.handle ?? "");

  const emit = (nextPlatform: EventRsvpSnsPlatform, nextHandle: string) => {
    onChange(nextHandle.length > 0 ? { platform: nextPlatform, handle: nextHandle } : null);
  };

  const setPlatform = (next: EventRsvpSnsPlatform) => {
    setPlatformState(next);
    emit(next, handle);
  };

  const setHandle = (next: string) => {
    // Displayed without a leading @ — the server strips it too, but this
    // avoids a mismatch between what's shown and what's submitted.
    const trimmed = next.replace(/^@+/, "");
    setHandleState(trimmed);
    emit(platform, trimmed);
  };

  return (
    <div className="flex flex-col gap-2">
      <Text variant="body3Regular" className="text-grayscale-300">
        {label}
      </Text>
      <div className="flex gap-2">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            type="button"
            disabled={disabled}
            onClick={() => setPlatform(p)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-opacity disabled:opacity-50",
              p === platform
                ? "border-point-500 text-point-500"
                : "border-grayscale-600 text-grayscale-300",
            )}
          >
            {platformLabels[p]}
          </button>
        ))}
      </div>
      <input
        type="text"
        autoComplete="off"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
        placeholder={handlePlaceholder}
        aria-label={handlePlaceholder}
        disabled={disabled}
        className={inputClass}
        style={inputStyle}
      />
    </div>
  );
}
