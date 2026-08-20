"use client";

import { type CSSProperties } from "react";
import { Text } from "@/components/detail/Text";
import type { EventRsvpSnsPlatform, EventRsvpSnsProfile } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full border-b border-current bg-transparent px-2 py-2 outline-none placeholder:text-[color:var(--rsvp-answer-placeholder-color)]";
const inputStyle: CSSProperties = { color: "var(--rsvp-answer-color)" };

const PLATFORMS: EventRsvpSnsPlatform[] = ["instagram", "tiktok", "youtube"];

interface SnsProfileFieldProps {
  value: EventRsvpSnsProfile | null;
  onChange: (value: EventRsvpSnsProfile | null) => void;
  disabled?: boolean;
  label: string;
  handlePlaceholder: string;
  platformLabels: Record<EventRsvpSnsPlatform, string>;
}

export function SnsProfileField({
  value,
  onChange,
  disabled,
  label,
  handlePlaceholder,
  platformLabels,
}: SnsProfileFieldProps) {
  const platform = value?.platform ?? "instagram";
  const handle = value?.handle ?? "";

  const setPlatform = (next: EventRsvpSnsPlatform) => {
    onChange(handle.trim().length > 0 ? { platform: next, handle } : null);
  };

  const setHandle = (next: string) => {
    // Displayed without a leading @ — the server strips it too, but this
    // avoids a mismatch between what's shown and what's submitted.
    const trimmed = next.replace(/^@+/, "");
    onChange(trimmed.length > 0 ? { platform, handle: trimmed } : null);
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
