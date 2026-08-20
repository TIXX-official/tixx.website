import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createEventRsvp,
  getRsvpRequirements,
  issuePhoneAuthCode,
  prepareEventRsvp,
  requestProfileImageUpload,
  RsvpError,
  uploadToPresignedUrl,
} from "./rsvp";

function mockFetchOnce(status: number, body: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: async () => body,
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("createEventRsvp", () => {
  it("resolves with the parsed response on success", async () => {
    const response = {
      jwt: "jwt-token",
      user: { id: 1, uuid: "u", name: "Guest", phone: "+821012345678" },
      isNew: 1,
      rsvp: {
        eventId: 100,
        redeemCodeId: 5,
        redeemHistoryId: 900,
        eventTicketId: 901,
        status: "issued",
      },
    };
    mockFetchOnce(200, response);

    await expect(
      createEventRsvp(100, {
        phone: "+821012345678",
        authCode: "123456",
        marketingOptIn: 0,
        marketingSmsOptIn: 0,
        marketingEmailOptIn: 0,
        marketingNightOptIn: 0,
        redeemCodeId: 5,
      }),
    ).resolves.toEqual(response);
  });

  it("submits a code target without sending redeemCodeId", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        jwt: "jwt-token",
        user: { id: 1, uuid: "u", name: "Guest", phone: "+821012345678" },
        isNew: 1,
        rsvp: {
          eventId: 100,
          redeemCodeId: 5,
          redeemHistoryId: 900,
          eventTicketId: 901,
          status: "issued",
        },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await createEventRsvp(100, {
      phone: "+821012345678",
      authCode: "123456",
      marketingOptIn: 0,
      marketingSmsOptIn: 0,
      marketingEmailOptIn: 0,
      marketingNightOptIn: 0,
      code: "VIP-2026",
    });

    const request = fetchMock.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(String(request.body)) as Record<string, unknown>;
    expect(body.code).toBe("VIP-2026");
    expect(body).not.toHaveProperty("redeemCodeId");
  });

  it("converts a string message error body into RsvpError.code", async () => {
    mockFetchOnce(400, { statusCode: 400, message: "INVALID_PHONE_AUTH_CODE" });

    const error = await createEventRsvp(100, {
      phone: "+821012345678",
      authCode: "wrong",
      marketingOptIn: 0,
      marketingSmsOptIn: 0,
      marketingEmailOptIn: 0,
      marketingNightOptIn: 0,
      redeemCodeId: 5,
    }).catch((e) => e);

    expect(error).toBeInstanceOf(RsvpError);
    expect((error as RsvpError).code).toBe("INVALID_PHONE_AUTH_CODE");
    expect((error as RsvpError).status).toBe(400);
  });

  it("converts an array message (Zod validation) error body into RsvpError.code", async () => {
    mockFetchOnce(400, {
      statusCode: 400,
      message: ["name should not be empty"],
    });

    const error = await createEventRsvp(100, {
      phone: "+821012345678",
      authCode: "123456",
      marketingOptIn: 0,
      marketingSmsOptIn: 0,
      marketingEmailOptIn: 0,
      marketingNightOptIn: 0,
      redeemCodeId: 5,
    }).catch((e) => e);

    expect(error).toBeInstanceOf(RsvpError);
    expect((error as RsvpError).code).toBe("name should not be empty");
  });

  it("falls back to a status-derived code when the body has no usable message", async () => {
    mockFetchOnce(500, null);

    const error = await createEventRsvp(100, {
      phone: "+821012345678",
      authCode: "123456",
      marketingOptIn: 0,
      marketingSmsOptIn: 0,
      marketingEmailOptIn: 0,
      marketingNightOptIn: 0,
      redeemCodeId: 5,
    }).catch((e) => e);

    expect(error).toBeInstanceOf(RsvpError);
    expect((error as RsvpError).code).toBe("RSVP_REQUEST_FAILED_500");
  });

  it("converts an AbortSignal.timeout() abort into RSVP_REQUEST_TIMEOUT, not a definite failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockRejectedValue(
          new DOMException("The operation timed out.", "TimeoutError"),
        ),
    );

    const error = await createEventRsvp(100, {
      phone: "+821012345678",
      authCode: "123456",
      marketingOptIn: 0,
      marketingSmsOptIn: 0,
      marketingEmailOptIn: 0,
      marketingNightOptIn: 0,
      redeemCodeId: 5,
    }).catch((e) => e);

    expect(error).toBeInstanceOf(RsvpError);
    expect((error as RsvpError).code).toBe("RSVP_REQUEST_TIMEOUT");
  });
});

describe("issuePhoneAuthCode", () => {
  it("resolves with the normalized phone and expiry", async () => {
    mockFetchOnce(200, {
      phone: "+821012345678",
      expiredAt: "2026-08-13T12:03:00.000Z",
    });

    await expect(issuePhoneAuthCode("010-1234-5678")).resolves.toEqual({
      phone: "+821012345678",
      expiredAt: "2026-08-13T12:03:00.000Z",
    });
  });
});

describe("getRsvpRequirements", () => {
  it("resolves with the requirement flags on success", async () => {
    mockFetchOnce(200, { requiresProfileImage: true, requiresSns: false });

    await expect(
      getRsvpRequirements(100, { redeemCodeId: 5 }),
    ).resolves.toEqual({ requiresProfileImage: true, requiresSns: false });
  });

  it("sends Cache-Control: no-store", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ requiresProfileImage: false, requiresSns: false }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await getRsvpRequirements(100, { redeemCodeId: 5 });

    const request = fetchMock.mock.calls[0][1] as RequestInit;
    expect((request.headers as Record<string, string>)["Cache-Control"]).toBe(
      "no-store",
    );
  });

  it("prefers a `code` field over `message` when both are present", async () => {
    mockFetchOnce(429, {
      statusCode: 429,
      code: "RSVP_REQUIREMENTS_RATE_LIMITED",
      message: "Too many RSVP requirement checks",
      retryAfterSeconds: 327,
    });

    const error = await getRsvpRequirements(100, { redeemCodeId: 5 }).catch(
      (e) => e,
    );

    expect(error).toBeInstanceOf(RsvpError);
    expect((error as RsvpError).code).toBe("RSVP_REQUIREMENTS_RATE_LIMITED");
    expect((error as RsvpError).status).toBe(429);
    expect((error as RsvpError).retryAfterSeconds).toBe(327);
  });
});

describe("prepareEventRsvp", () => {
  it("resolves with the prepare response on success", async () => {
    const response = {
      isExistingUser: true,
      requiresProfileImage: true,
      requiresSns: true,
      missingProfileImage: false,
      missingSns: true,
    };
    mockFetchOnce(200, response);

    await expect(
      prepareEventRsvp(100, {
        phone: "+821012345678",
        authCode: "123456",
        redeemCodeId: 5,
      }),
    ).resolves.toEqual(response);
  });
});

describe("requestProfileImageUpload", () => {
  it("resolves with the presigned URL and mediaUrl", async () => {
    mockFetchOnce(200, {
      presignedUrl: "https://r2.example.com/put",
      mediaUrl: "https://static.example.com/users/rsvp-abc/def",
    });

    await expect(
      requestProfileImageUpload("rsvp-abc", "image/webp"),
    ).resolves.toEqual({
      presignedUrl: "https://r2.example.com/put",
      mediaUrl: "https://static.example.com/users/rsvp-abc/def",
    });
  });
});

describe("uploadToPresignedUrl", () => {
  it("PUTs the file with its content type and resolves on success", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", fetchMock);
    const file = new File(["data"], "photo.webp", { type: "image/webp" });

    await uploadToPresignedUrl("https://r2.example.com/put", file);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://r2.example.com/put",
      expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "image/webp" },
        body: file,
      }),
    );
  });

  it("throws a plain Error (not RsvpError) on a failed upload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 403 }),
    );
    const file = new File(["data"], "photo.webp", { type: "image/webp" });

    const error = await uploadToPresignedUrl(
      "https://r2.example.com/put",
      file,
    ).catch((e) => e);

    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBeInstanceOf(RsvpError);
  });
});
