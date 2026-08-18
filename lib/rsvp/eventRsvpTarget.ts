import type { EventRsvpRedeemTarget } from "@/lib/api/types";

export function hasGuestCodeValue(value: string): boolean {
  return value.trim().length > 0;
}

export function buildEventRsvpRedeemTarget(
  target: EventRsvpRedeemTarget,
  editedGuestCode: string,
): EventRsvpRedeemTarget {
  if ("code" in target) {
    return { code: editedGuestCode.trim() };
  }

  return { redeemCodeId: target.redeemCodeId };
}
