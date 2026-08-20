import { describe, expect, it } from "vitest";
import { normalizeGuestCode } from "./guestCode";

describe("normalizeGuestCode", () => {
  it("trims a scalar query value and rejects blank input", () => {
    expect(normalizeGuestCode(" VIP-2026 ")).toBe("VIP-2026");
    expect(normalizeGuestCode("   ")).toBeUndefined();
  });

  it("uses the first repeated query value", () => {
    expect(normalizeGuestCode([" VIP-2026 ", "OTHER"])).toBe("VIP-2026");
    expect(normalizeGuestCode([])).toBeUndefined();
  });
});
