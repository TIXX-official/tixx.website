import { describe, expect, it } from "vitest";
import {
  buildAppDeepLink,
  type InitialBrowserEntry,
  resolveAutomaticHandoffTarget,
} from "./appHandoff";

const KAKAO_IOS_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) KAKAOTALK 11.0";
const INSTAGRAM_ANDROID_UA =
  "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Instagram 390.0";

function entry(
  overrides: Partial<InitialBrowserEntry> = {},
): InitialBrowserEntry {
  return {
    pathname: "/events/123",
    referrer: "https://story.example/link",
    navigationType: "navigate",
    ...overrides,
  };
}

function resolve(
  overrides: Partial<Parameters<typeof resolveAutomaticHandoffTarget>[0]> = {},
) {
  return resolveAutomaticHandoffTarget({
    entry: entry(),
    currentPathname: "/events/123",
    currentOrigin: "https://tixx.im",
    search: "",
    userAgent: KAKAO_IOS_UA,
    kind: "event",
    id: 123,
    enabledTargets: "kakao-ios",
    ...overrides,
  });
}

describe("resolveAutomaticHandoffTarget", () => {
  it("allows an enabled Kakao iOS external canonical entry", () => {
    expect(resolve()).toBe("kakao-ios");
  });

  it("allows an enabled Instagram Android sharing gateway entry", () => {
    expect(
      resolve({
        entry: entry({ pathname: "/open/events/123", referrer: "" }),
        currentPathname: "/open/events/123",
        userAgent: INSTAGRAM_ANDROID_UA,
        enabledTargets: "kakao-ios, instagram-android",
      }),
    ).toBe("instagram-android");
  });

  it("does not run for an environment that is not enabled", () => {
    expect(resolve({ enabledTargets: "instagram-ios" })).toBeNull();
  });

  it("does not run in a regular mobile browser", () => {
    expect(
      resolve({
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Version/18.0 Mobile Safari/604.1",
      }),
    ).toBeNull();
  });

  it("does not run after a same-origin full-page navigation", () => {
    expect(
      resolve({ entry: entry({ referrer: "https://tixx.im/" }) }),
    ).toBeNull();
  });

  it("does not run after a Next.js client navigation", () => {
    expect(resolve({ entry: entry({ pathname: "/" }) })).toBeNull();
  });

  it.each(["reload", "back_forward"])(
    "does not run for %s navigation",
    (type) => {
      expect(resolve({ entry: entry({ navigationType: type }) })).toBeNull();
    },
  );

  it.each(["?noapp=1", "?web=1"])("honors the %s opt-out", (search) => {
    expect(resolve({ search })).toBeNull();
  });

  it("does not hand an event id to a different detail path", () => {
    expect(
      resolve({
        entry: entry({ pathname: "/events/456" }),
        currentPathname: "/events/456",
      }),
    ).toBeNull();
  });
});

describe("buildAppDeepLink", () => {
  it("builds the app contract for events and hosts", () => {
    expect(buildAppDeepLink("event", 123)).toBe("tixx://event/123");
    expect(buildAppDeepLink("host", 456)).toBe("tixx://host/456");
  });

  it("encodes an event guest code without applying it to host links", () => {
    expect(buildAppDeepLink("event", 123, " VIP/2026?A ")).toBe(
      "tixx://event/123?code=VIP%2F2026%3FA",
    );
    expect(buildAppDeepLink("host", 456, "VIP-2026")).toBe("tixx://host/456");
  });
});
