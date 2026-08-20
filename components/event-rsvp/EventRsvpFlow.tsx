"use client";

import {
  AsYouType,
  isValidPhoneNumber,
  getExampleNumber,
  type CountryCode,
} from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";
import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { AppCTA } from "@/components/detail/AppCTA";
import { Button } from "@/components/detail/Button";
import { Text } from "@/components/detail/Text";
import { PhoneCountryPicker } from "@/components/rsvp-form/PhoneCountryPicker";
import { ProfileImageField } from "@/components/event-rsvp/ProfileImageField";
import { SnsProfileField } from "@/components/event-rsvp/SnsProfileField";
import { buildAppDeepLink } from "@/lib/appHandoff";
import {
  createEventRsvp,
  getRsvpRequirements,
  issuePhoneAuthCode,
  prepareEventRsvp,
  RsvpError,
} from "@/lib/api/rsvp";
import type {
  EventRsvpRedeemTarget,
  EventRsvpSnsProfile,
} from "@/lib/api/types";
import { dictionary } from "@/lib/dictionary";
import { useLanguage } from "@/lib/LanguageContext";
import { trackWebEvent } from "@/lib/analytics";
import {
  resolveRsvpError,
  type RsvpErrorAction,
} from "@/lib/rsvp/resolveRsvpError";
import {
  buildEventRsvpRedeemTarget,
  hasGuestCodeValue,
} from "@/lib/rsvp/eventRsvpTarget";

type RsvpStep =
  | "loading-requirements"
  | "phone"
  | "otp"
  | "additional-info"
  | "submitting"
  | "completed";

const RESEND_COOLDOWN_MS = 30 * 1000;

// PhoneCountryPicker's dropdown is portaled to document.body (outside this
// tree) and reads its colors back off computed styles on the trigger button,
// so these three custom properties need to exist somewhere in this
// subtree — there's no themed RSVP-form ancestor here to inherit them from,
// unlike the Typeform-style RsvpFormShell that normally provides them.
const themeVars = {
  ["--rsvp-bg-color"]: "#000000",
  ["--rsvp-answer-color"]: "#ffffff",
  ["--rsvp-answer-placeholder-color"]: "rgba(255,255,255,0.4)",
} as CSSProperties;

const answerInputClass =
  "w-full border-b border-current bg-transparent px-2 py-2 outline-none placeholder:text-[color:var(--rsvp-answer-placeholder-color)]";
const answerInputStyle: CSSProperties = { color: "var(--rsvp-answer-color)" };

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

interface EventRsvpFlowProps {
  event: { id: number; name: string };
  /** Null means no public RSVP target was resolved and the flow falls back. */
  redeemTarget: EventRsvpRedeemTarget | null;
}

export function EventRsvpFlow({ event, redeemTarget }: EventRsvpFlowProps) {
  const { language } = useLanguage();
  const t = dictionary[language].eventRsvp;

  const [step, setStep] = useState<RsvpStep>(
    redeemTarget ? "loading-requirements" : "phone",
  );
  const [country, setCountry] = useState<CountryCode>("KR");
  const [displayText, setDisplayText] = useState("");
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [expiredAt, setExpiredAt] = useState<number | null>(null);
  const [lastIssuedAt, setLastIssuedAt] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [marketingNightOptIn, setMarketingNightOptIn] = useState(false);
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAppFallback, setShowAppFallback] = useState(false);
  const [eventNotFound, setEventNotFound] = useState(false);
  const [needsRefetch, setNeedsRefetch] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  // Set by /rsvp/prepare — that endpoint's own requires* policy combined
  // with the caller's saved profile, i.e. what's actually left to collect.
  // /rsvp/requirements (loadRequirements) is only used pre-OTP to validate
  // the target and surface eligibility errors early; its requires* flags
  // aren't rendered directly.
  const [missingProfileImage, setMissingProfileImage] = useState(false);
  const [missingSns, setMissingSns] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [snsProfile, setSnsProfile] = useState<EventRsvpSnsProfile | null>(
    null,
  );
  // The guest code (trimmed) that requiresProfileImage/requiresSns above
  // were last resolved for — lets handleSendCode notice an edited code
  // link and re-check requirements before issuing an OTP for it.
  const [requirementsGuestCode, setRequirementsGuestCode] = useState<
    string | null
  >(null);
  const hasTrackedStart = useRef(false);
  const hasTrackedView = useRef(false);
  const hasLoadedRequirements = useRef(false);
  const isCodeTarget =
    redeemTarget !== null &&
    "code" in redeemTarget &&
    typeof redeemTarget.code === "string";
  const [guestCode, setGuestCode] = useState(() =>
    isCodeTarget && redeemTarget ? redeemTarget.code : "",
  );
  const [guestCodeTouched, setGuestCodeTouched] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const isSubmitting = step === "submitting";

  const guestCodeField = isCodeTarget ? (
    <div className="flex flex-col gap-2">
      <label htmlFor="guest-code" className="text-sm text-grayscale-300">
        {t.guestCodeLabel}
      </label>
      <input
        id="guest-code"
        type="text"
        autoComplete="off"
        value={guestCode}
        onChange={(e) => {
          setGuestCode(e.target.value);
          setErrorMessage(null);
        }}
        onBlur={() => setGuestCodeTouched(true)}
        placeholder={t.guestCodePlaceholder}
        aria-label={t.guestCodeLabel}
        aria-invalid={guestCodeTouched && guestCode.trim().length === 0}
        disabled={isSubmitting}
        className={answerInputClass}
        style={answerInputStyle}
      />
      {guestCodeTouched && guestCode.trim().length === 0 && (
        <Text variant="caption1Regular" className="text-red-400">
          {t.errors.invalidGuestCode}
        </Text>
      )}
    </div>
  ) : null;

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    void trackWebEvent("event_rsvp_view", { event_id: event.id });
  }, [event.id]);

  useEffect(() => {
    if (
      step !== "otp" &&
      step !== "additional-info" &&
      step !== "submitting"
    ) {
      return;
    }
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [step]);

  // 제출 중에는 새로고침/탭 닫기 및 뒤로 가기로 요청이 유실되지 않도록 막는다.
  useEffect(() => {
    if (step !== "submitting") return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [step]);

  const handleApiError = (error: unknown): RsvpErrorAction => {
    const code = error instanceof RsvpError ? error.code : "generic";
    const resolved = resolveRsvpError(code, {
      target: isCodeTarget ? "code" : "redeemCodeId",
    });
    const retrySuffix =
      error instanceof RsvpError && error.retryAfterSeconds
        ? ` (${Math.ceil(error.retryAfterSeconds / 60)}${language === "KO" ? "분 후" : "m"})`
        : "";
    setErrorMessage(t.errors[resolved.messageKey] + retrySuffix);

    if (resolved.action === "already_registered") {
      // 이 번호로 이미 티켓이 발급된 상태 — 새로고침이나 재시도로는 해결되지
      // 않으므로 실제로 등록을 마쳤을 때와 같은 완료 화면으로 보낸다.
      setAlreadyRegistered(true);
      setStep("completed");
      return resolved.action;
    }
    if (resolved.action === "app_fallback") {
      setShowAppFallback(true);
      return resolved.action;
    }
    if (resolved.action === "event_not_found") {
      setEventNotFound(true);
      return resolved.action;
    }
    if (resolved.action === "refetch") {
      setNeedsRefetch(true);
      return resolved.action;
    }
    if (resolved.action === "resend_otp") {
      // OTP가 더 이상 유효하지 않으므로 즉시 만료 상태로 표시하고, 남은
      // cooldown과 무관하게 바로 재발급받을 수 있게 한다.
      setAuthCode("");
      setExpiredAt(0);
      setLastIssuedAt(null);
    }
    return resolved.action;
  };

  // 문서 4.2절: OTP 발급 전 브라우저가 직접 호출해서 요구조건을 확인한다.
  // 성공하면 requires*를 갱신하고 phone 단계로, 실패하면 기존 에러 처리로
  // 위임하되(app_fallback/event_not_found/needsRefetch 등) phone 단계로
  // 넘어가 에러 메시지가 보이게 한다.
  const loadRequirements = async (): Promise<boolean> => {
    if (!redeemTarget) return false;
    try {
      const body = buildEventRsvpRedeemTarget(redeemTarget, guestCode);
      await getRsvpRequirements(event.id, body);
      setRequirementsGuestCode(isCodeTarget ? guestCode.trim() : null);
      return true;
    } catch (error) {
      handleApiError(error);
      return false;
    } finally {
      setStep((current) => (current === "loading-requirements" ? "phone" : current));
    }
  };

  useEffect(() => {
    if (redeemTarget === null || hasLoadedRequirements.current) return;
    hasLoadedRequirements.current = true;
    void loadRequirements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (step === "completed") {
    return (
      <main
        style={themeVars}
        className="min-h-screen bg-black px-4 pb-32 pt-24 text-white"
      >
        <div className="mx-auto max-w-md text-center">
          <Text as="h1" variant="h1Semibold" className="mb-3">
            {alreadyRegistered ? t.alreadyRegisteredTitle : t.completedTitle}
          </Text>
          <Text variant="body1Regular" className="mb-8 text-grayscale-300">
            {t.completedDescription}
          </Text>
        </div>
        <AppCTA
          label={t.openApp}
          deepLink={`tixx://event/${event.id}`}
          sourceSurface="event_rsvp_complete"
          contextType="event"
          contextId={event.id}
        />
      </main>
    );
  }

  if (eventNotFound) {
    return (
      <main
        style={themeVars}
        className="min-h-screen bg-black px-4 pb-32 pt-24 text-white"
      >
        <div className="mx-auto max-w-md text-center">
          <Text as="h1" variant="h1Semibold" className="mb-3">
            {t.eventNotFoundTitle}
          </Text>
          <Text variant="body1Regular" className="mb-8 text-grayscale-300">
            {t.eventNotFoundDescription}
          </Text>
        </div>
      </main>
    );
  }

  if (redeemTarget === null || showAppFallback) {
    return (
      <main
        style={themeVars}
        className="min-h-screen bg-black px-4 pb-32 pt-24 text-white"
      >
        <div className="mx-auto max-w-md text-center">
          <Text as="h1" variant="h1Semibold" className="mb-3">
            {t.notEligibleTitle}
          </Text>
          <Text variant="body1Regular" className="mb-8 text-grayscale-300">
            {t.notEligibleDescription}
          </Text>
        </div>
        <AppCTA
          label={t.notEligibleOpenApp}
          sourceSurface="event_rsvp_fallback"
          contextType="event"
          contextId={event.id}
          deepLink={
            isCodeTarget
              ? buildAppDeepLink("event", event.id, guestCode)
              : buildAppDeepLink("event", event.id)
          }
        />
      </main>
    );
  }

  if (step === "loading-requirements") {
    return (
      <main
        style={themeVars}
        className="min-h-screen bg-black px-4 pb-32 pt-24 text-white"
      >
        <div className="mx-auto max-w-md text-center">
          <Text variant="body1Regular" className="text-grayscale-300">
            {t.loadingRequirements}
          </Text>
        </div>
      </main>
    );
  }

  // Re-derived on every render from displayText/country rather than kept in
  // its own state — AsYouType is cheap and this keeps a single source of
  // truth for "what E.164 number does the current input resolve to".
  const isInternationalInput = displayText.trim().startsWith("+");
  const currentFormatter = new AsYouType(
    isInternationalInput ? undefined : country,
  );
  currentFormatter.input(displayText);
  const currentE164 = currentFormatter.getNumberValue() ?? "";
  const isPhoneValid = currentE164 !== "" && isValidPhoneNumber(currentE164);
  const phonePlaceholder =
    getExampleNumber(country, examples)?.formatNational() ?? "";

  const handlePhoneInputChange = (text: string) => {
    if (!hasTrackedStart.current) {
      hasTrackedStart.current = true;
      void trackWebEvent("event_rsvp_start", { event_id: event.id });
    }
    const isInternational = text.trim().startsWith("+");
    const formatter = new AsYouType(isInternational ? undefined : country);
    setDisplayText(formatter.input(text));
    if (isInternational) {
      const detected = formatter.getCountry();
      if (detected && detected !== country) setCountry(detected);
    }
  };

  const handleCountrySelect = (nextCountry: CountryCode) => {
    const wasInternational = displayText.trim().startsWith("+");
    const formatterForCurrent = new AsYouType(
      wasInternational ? undefined : country,
    );
    formatterForCurrent.input(displayText);
    const nationalDigits = formatterForCurrent.getNationalNumber();

    setCountry(nextCountry);
    const formatter = new AsYouType(nextCountry);
    setDisplayText(formatter.input(nationalDigits));
  };

  const handleSendCode = async () => {
    if (isCodeTarget && !hasGuestCodeValue(guestCode)) {
      setGuestCodeTouched(true);
      return;
    }
    if (!isPhoneValid || isRequestingCode || isSubmitting) return;
    setIsRequestingCode(true);
    setErrorMessage(null);
    setNeedsRefetch(false);
    try {
      // 문서 4.2절: 게스트 코드가 편집돼 requirements 응답이 더 이상 이
      // 코드에 대한 게 아니면 OTP 발급 전에 다시 조회한다.
      if (isCodeTarget && guestCode.trim() !== requirementsGuestCode) {
        const ok = await loadRequirements();
        if (!ok) return;
      }
      const result = await issuePhoneAuthCode(currentE164);
      // now is otherwise only refreshed by the 1s interval below, which
      // doesn't restart on a resend within the same step — sync it here so
      // remainingMs/isResendCoolingDown never read a stale now right after
      // expiredAt/lastIssuedAt change.
      const issuedAt = Date.now();
      setVerifiedPhone(result.phone);
      setExpiredAt(new Date(result.expiredAt).getTime());
      setLastIssuedAt(issuedAt);
      setNow(issuedAt);
      setAuthCode("");
      setStep("otp");
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsRequestingCode(false);
    }
  };

  const remainingMs = expiredAt !== null ? Math.max(0, expiredAt - now) : 0;
  const isOtpExpired = expiredAt !== null && remainingMs <= 0;
  const isResendCoolingDown =
    lastIssuedAt !== null && now - lastIssuedAt < RESEND_COOLDOWN_MS;

  const canPrepare =
    !isPreparing &&
    !isSubmitting &&
    !isOtpExpired &&
    authCode.trim().length > 0 &&
    (!isCodeTarget || hasGuestCodeValue(guestCode));

  const submitRsvp = async () => {
    if (!redeemTarget) return;
    const redeemTargetBody = buildEventRsvpRedeemTarget(
      redeemTarget,
      guestCode,
    );

    setStep("submitting");
    setErrorMessage(null);
    setNeedsRefetch(false);
    void trackWebEvent("event_rsvp_submit_attempt", { event_id: event.id });
    try {
      // rsvp.eventTicketId isn't shown on this page — completion is
      // announced generically and the ticket itself is only viewable in the
      // app (see docs/rsvp-phone-auth-frontend-implementation-plan.md §6,
      // W3 item 6).
      const response = await createEventRsvp(event.id, {
        phone: verifiedPhone,
        authCode,
        // event-rsvp.service.ts only applies name/termsAccepted when
        // creating a brand-new user — omitted here for existing users since
        // the name/terms step is hidden and there's nothing to send.
        ...(isExistingUser ? {} : { name: name.trim(), termsAccepted: true }),
        marketingOptIn: marketingOptIn ? 1 : 0,
        marketingSmsOptIn: marketingOptIn ? 1 : 0,
        marketingEmailOptIn: marketingOptIn ? 1 : 0,
        marketingNightOptIn: marketingOptIn && marketingNightOptIn ? 1 : 0,
        ...(missingProfileImage && profileImageUrl ? { profileImageUrl } : {}),
        ...(missingSns && snsProfile ? { snsProfile } : {}),
        ...redeemTargetBody,
      });
      void trackWebEvent("event_rsvp_submit_success", {
        event_id: event.id,
        is_new_user: response.isNew === 1,
      });
      setStep("completed");
    } catch (error) {
      void trackWebEvent("event_rsvp_submit_fail", {
        event_id: event.id,
        failure_code: error instanceof RsvpError ? error.code : "unknown",
      });
      const action = handleApiError(error);
      const needsAdditionalInfo =
        !isExistingUser || missingProfileImage || missingSns;
      if (action === "resend_otp") {
        // authCode was just cleared by handleApiError — only the otp step
        // has a field to re-enter it, so additional-info would be a dead
        // end. Collected name/profile-image/SNS state is left untouched, so
        // it's still there once prepare succeeds again.
        setStep("otp");
        return;
      }
      if (action === "reprepare") {
        // 호스트가 그 사이 요구조건을 바꿨을 수 있다 — 같은 OTP로 prepare를
        // 다시 호출해 additional-info를 재구성한다(문서 10절). 여기서는
        // 항상 additional-info로 돌아간다: 방금 이 요구조건 때문에 제출이
        // 실패했으므로 재확인 결과도 최소 하나는 missing일 것으로 본다.
        try {
          const redeemTargetBody = buildEventRsvpRedeemTarget(
            redeemTarget,
            guestCode,
          );
          const result = await prepareEventRsvp(event.id, {
            phone: verifiedPhone,
            authCode,
            ...redeemTargetBody,
          });
          setIsExistingUser(result.isExistingUser);
          setMissingProfileImage(result.missingProfileImage);
          setMissingSns(result.missingSns);
          setStep("additional-info");
        } catch (prepareError) {
          handleApiError(prepareError);
          setStep("otp");
        }
        return;
      }
      if (action !== "already_registered") {
        setStep(needsAdditionalInfo ? "additional-info" : "otp");
      }
    }
  };

  const handlePrepareAndContinue = async () => {
    if (isCodeTarget && !hasGuestCodeValue(guestCode)) {
      setGuestCodeTouched(true);
      return;
    }
    if (!canPrepare || !redeemTarget) return;

    const redeemTargetBody = buildEventRsvpRedeemTarget(
      redeemTarget,
      guestCode,
    );
    setIsPreparing(true);
    setErrorMessage(null);
    setNeedsRefetch(false);
    try {
      const result = await prepareEventRsvp(event.id, {
        phone: verifiedPhone,
        authCode,
        ...redeemTargetBody,
      });
      setIsExistingUser(result.isExistingUser);
      setMissingProfileImage(result.missingProfileImage);
      setMissingSns(result.missingSns);

      if (
        !result.isExistingUser ||
        result.missingProfileImage ||
        result.missingSns
      ) {
        setStep("additional-info");
      } else {
        await submitRsvp();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsPreparing(false);
    }
  };

  const canSubmit =
    !isSubmitting &&
    !isOtpExpired &&
    authCode.trim().length > 0 &&
    (isExistingUser || (name.trim().length > 0 && termsAccepted)) &&
    (!missingProfileImage || Boolean(profileImageUrl)) &&
    (!missingSns || Boolean(snsProfile));

  return (
    <main
      style={themeVars}
      className="min-h-screen bg-black px-4 pb-32 pt-24 text-white"
    >
      <div className="mx-auto max-w-md">
        <Text as="h1" variant="h1Semibold" className="mb-1">
          {event.name}
        </Text>
        <Text variant="body3Regular" className="mb-8 text-grayscale-400">
          {t.pageTitle}
        </Text>

        {step === "phone" && (
          <div className="flex flex-col gap-4">
            <Text variant="headline2Medium">{t.phoneStepTitle}</Text>
            <Text variant="body3Regular" className="text-grayscale-400">
              {t.phoneStepDescription}
            </Text>
            {guestCodeField}
            <div className="flex items-stretch gap-2">
              <PhoneCountryPicker
                value={country}
                onChange={handleCountrySelect}
              />
              <input
                type="tel"
                inputMode="tel"
                autoFocus
                value={displayText}
                onChange={(e) => handlePhoneInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleSendCode();
                }}
                placeholder={phonePlaceholder || t.phonePlaceholder}
                aria-label={t.phonePlaceholder}
                className={answerInputClass}
                style={answerInputStyle}
              />
            </div>
            {errorMessage && (
              <Text
                variant="caption1Regular"
                className="text-red-400"
                aria-live="polite"
              >
                {errorMessage}
              </Text>
            )}
            <Button
              onClick={() => void handleSendCode()}
              className={
                !isPhoneValid ||
                isRequestingCode ||
                (isCodeTarget && !hasGuestCodeValue(guestCode))
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
            >
              {t.sendCode}
            </Button>
          </div>
        )}

        {step === "otp" && (
          <div className="flex flex-col gap-5">
            <Text variant="headline2Medium">{t.otpStepTitle}</Text>
            {guestCodeField}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  autoFocus
                  maxLength={6}
                  value={authCode}
                  onChange={(e) =>
                    setAuthCode(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder={t.otpPlaceholder}
                  aria-label={t.otpPlaceholder}
                  disabled={isPreparing}
                  className={answerInputClass}
                  style={answerInputStyle}
                />
                <button
                  type="button"
                  onClick={() => void handleSendCode()}
                  disabled={isRequestingCode || isResendCoolingDown || isPreparing}
                  className="shrink-0 whitespace-nowrap px-2 py-2 text-sm underline disabled:opacity-40"
                >
                  {t.resendCode}
                </button>
              </div>
              <Text variant="caption1Regular" className="text-grayscale-400">
                {isOtpExpired
                  ? t.errors.otpExpired
                  : formatRemaining(remainingMs)}
              </Text>
            </div>

            {errorMessage && (
              <Text
                variant="caption1Regular"
                className="text-red-400"
                aria-live="polite"
              >
                {errorMessage}
              </Text>
            )}
            {needsRefetch && (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="self-start text-sm underline text-grayscale-300"
              >
                {t.recheck}
              </button>
            )}

            <Button
              onClick={() => void handlePrepareAndContinue()}
              className={
                !canPrepare ? "pointer-events-none opacity-50" : undefined
              }
            >
              {isPreparing ? t.submitting : t.otpContinue}
            </Button>
          </div>
        )}

        {(step === "additional-info" || step === "submitting") && (
          <div className="flex flex-col gap-5">
            <Text variant="headline2Medium">{t.additionalInfoStepTitle}</Text>
            {guestCodeField}

            {isExistingUser ? (
              <Text variant="caption1Regular" className="text-grayscale-400">
                {t.existingUserNotice}
              </Text>
            ) : (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  aria-label={t.namePlaceholder}
                  disabled={isSubmitting}
                  className={answerInputClass}
                  style={answerInputStyle}
                />

                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    disabled={isSubmitting}
                    className="mt-1"
                  />
                  <span>
                    {t.termsLabel}{" "}
                    <Link
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {t.termsLinkTerms}
                    </Link>{" "}
                    /{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {t.termsLinkPrivacy}
                    </Link>
                  </span>
                </label>

                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={marketingOptIn}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setMarketingOptIn(checked);
                      if (!checked) setMarketingNightOptIn(false);
                    }}
                    disabled={isSubmitting}
                    className="mt-1"
                  />
                  <span>{t.marketingLabel}</span>
                </label>

                <label className="flex items-start gap-2 text-sm opacity-80">
                  <input
                    type="checkbox"
                    checked={marketingNightOptIn}
                    onChange={(e) => setMarketingNightOptIn(e.target.checked)}
                    disabled={isSubmitting || !marketingOptIn}
                    className="mt-1"
                  />
                  <span>{t.marketingNightLabel}</span>
                </label>
              </>
            )}

            {missingProfileImage && (
              <ProfileImageField
                value={profileImageUrl}
                onChange={setProfileImageUrl}
                disabled={isSubmitting}
                label={t.profileImageLabel}
                uploadingLabel={t.profileImageUploadingLabel}
                changeLabel={t.profileImageChangeLabel}
                invalidTypeMessage={t.errors.profileImageInvalidType}
                tooLargeMessage={t.errors.profileImageTooLarge}
                uploadFailedMessage={t.errors.profileImageUploadFailed}
              />
            )}

            {missingSns && (
              <SnsProfileField
                value={snsProfile}
                onChange={setSnsProfile}
                disabled={isSubmitting}
                label={t.snsLabel}
                handlePlaceholder={t.snsHandlePlaceholder}
                platformLabels={{
                  instagram: t.snsPlatformInstagram,
                  tiktok: t.snsPlatformTiktok,
                  youtube: t.snsPlatformYoutube,
                }}
              />
            )}

            {errorMessage && (
              <Text
                variant="caption1Regular"
                className="text-red-400"
                aria-live="polite"
              >
                {errorMessage}
              </Text>
            )}
            {needsRefetch && (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="self-start text-sm underline text-grayscale-300"
              >
                {t.recheck}
              </button>
            )}

            <Button
              onClick={() => void submitRsvp()}
              className={
                !canSubmit ? "pointer-events-none opacity-50" : undefined
              }
            >
              {isSubmitting ? t.submitting : t.submit}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
