import { describe, expect, it } from "vitest";
import {
  buildEventRsvpRedeemTarget,
  hasGuestCodeValue,
} from "./eventRsvpTarget";

describe("event RSVP redeem target", () => {
  it("requires a non-blank code", () => {
    expect(hasGuestCodeValue(" VIP-2026 ")).toBe(true);
    expect(hasGuestCodeValue("   ")).toBe(false);
  });

  it("trims edited code targets and excludes redeemCodeId", () => {
    expect(
      buildEventRsvpRedeemTarget({ code: "ORIGINAL" }, " EDITED-2026 "),
    ).toEqual({ code: "EDITED-2026" });
  });

  it("preserves public RSVP ids and excludes code", () => {
    expect(
      buildEventRsvpRedeemTarget({ redeemCodeId: 123 }, "EDITED-2026"),
    ).toEqual({ redeemCodeId: 123 });
  });
});
