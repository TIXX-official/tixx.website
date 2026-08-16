'use client';

import {
  AsYouType,
  isValidPhoneNumber,
  getExampleNumber,
  type CountryCode,
} from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import Link from 'next/link';
import { type CSSProperties, useEffect, useState } from 'react';
import { AppCTA } from '@/components/detail/AppCTA';
import { Button } from '@/components/detail/Button';
import { Text } from '@/components/detail/Text';
import { PhoneCountryPicker } from '@/components/rsvp-form/PhoneCountryPicker';
import {
  checkPhoneRegistered,
  createEventRsvp,
  issuePhoneAuthCode,
  RsvpError,
} from '@/lib/api/rsvp';
import { dictionary } from '@/lib/dictionary';
import { useLanguage } from '@/lib/LanguageContext';
import { resolveRsvpError, type RsvpErrorAction } from '@/lib/rsvp/resolveRsvpError';

type RsvpStep = 'phone' | 'otp-and-profile' | 'submitting' | 'completed';

const RESEND_COOLDOWN_MS = 30 * 1000;

// PhoneCountryPicker's dropdown is portaled to document.body (outside this
// tree) and reads its colors back off computed styles on the trigger button,
// so these three custom properties need to exist somewhere in this
// subtree — there's no themed RSVP-form ancestor here to inherit them from,
// unlike the Typeform-style RsvpFormShell that normally provides them.
const themeVars = {
  ['--rsvp-bg-color']: '#000000',
  ['--rsvp-answer-color']: '#ffffff',
  ['--rsvp-answer-placeholder-color']: 'rgba(255,255,255,0.4)',
} as CSSProperties;

const answerInputClass =
  'w-full border-b border-current bg-transparent px-2 py-2 outline-none placeholder:text-[color:var(--rsvp-answer-placeholder-color)]';
const answerInputStyle: CSSProperties = { color: 'var(--rsvp-answer-color)' };

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

interface EventRsvpFlowProps {
  event: { id: number; name: string };
  /** Precomputed server-side by selectRsvpCandidates — null means either no
   * eligible code or more than one (policy for picking among several isn't
   * decided yet, see docs/rsvp-phone-auth-frontend-work-breakdown.md §2.5),
   * so the web flow can't proceed and falls back to the app CTA. */
  redeemCodeId: number | null;
}

export function EventRsvpFlow({ event, redeemCodeId }: EventRsvpFlowProps) {
  const { language } = useLanguage();
  const t = dictionary[language].eventRsvp;

  const [step, setStep] = useState<RsvpStep>('phone');
  const [country, setCountry] = useState<CountryCode>('KR');
  const [displayText, setDisplayText] = useState('');
  const [verifiedPhone, setVerifiedPhone] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [expiredAt, setExpiredAt] = useState<number | null>(null);
  const [lastIssuedAt, setLastIssuedAt] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [marketingNightOptIn, setMarketingNightOptIn] = useState(false);
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAppFallback, setShowAppFallback] = useState(false);
  const [eventNotFound, setEventNotFound] = useState(false);
  const [needsRefetch, setNeedsRefetch] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (step !== 'otp-and-profile' && step !== 'submitting') return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [step]);

  // 제출 중에는 새로고침/탭 닫기 및 뒤로 가기로 요청이 유실되지 않도록 막는다.
  useEffect(() => {
    if (step !== 'submitting') return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [step]);

  const handleApiError = (error: unknown): RsvpErrorAction => {
    const code = error instanceof RsvpError ? error.code : 'generic';
    const resolved = resolveRsvpError(code);
    setErrorMessage(t.errors[resolved.messageKey]);

    if (resolved.action === 'already_registered') {
      // 이 번호로 이미 티켓이 발급된 상태 — 새로고침이나 재시도로는 해결되지
      // 않으므로 실제로 등록을 마쳤을 때와 같은 완료 화면으로 보낸다.
      setAlreadyRegistered(true);
      setStep('completed');
      return resolved.action;
    }
    if (resolved.action === 'app_fallback') {
      setShowAppFallback(true);
      return resolved.action;
    }
    if (resolved.action === 'event_not_found') {
      setEventNotFound(true);
      return resolved.action;
    }
    if (resolved.action === 'refetch') {
      setNeedsRefetch(true);
      return resolved.action;
    }
    if (resolved.action === 'resend_otp') {
      // OTP가 더 이상 유효하지 않으므로 즉시 만료 상태로 표시하고, 남은
      // cooldown과 무관하게 바로 재발급받을 수 있게 한다.
      setAuthCode('');
      setExpiredAt(0);
      setLastIssuedAt(null);
    }
    return resolved.action;
  };

  if (step === 'completed') {
    return (
      <main style={themeVars} className='min-h-screen bg-black px-4 pb-32 pt-24 text-white'>
        <div className='mx-auto max-w-md text-center'>
          <Text as='h1' variant='h1Semibold' className='mb-3'>
            {alreadyRegistered ? t.alreadyRegisteredTitle : t.completedTitle}
          </Text>
          <Text variant='body1Regular' className='mb-8 text-grayscale-300'>
            {t.completedDescription}
          </Text>
        </div>
        <AppCTA label={t.openApp} deepLink={`tixx://event/${event.id}`} />
      </main>
    );
  }

  if (eventNotFound) {
    return (
      <main style={themeVars} className='min-h-screen bg-black px-4 pb-32 pt-24 text-white'>
        <div className='mx-auto max-w-md text-center'>
          <Text as='h1' variant='h1Semibold' className='mb-3'>
            {t.eventNotFoundTitle}
          </Text>
          <Text variant='body1Regular' className='mb-8 text-grayscale-300'>
            {t.eventNotFoundDescription}
          </Text>
        </div>
      </main>
    );
  }

  if (redeemCodeId === null || showAppFallback) {
    return (
      <main style={themeVars} className='min-h-screen bg-black px-4 pb-32 pt-24 text-white'>
        <div className='mx-auto max-w-md text-center'>
          <Text as='h1' variant='h1Semibold' className='mb-3'>
            {t.notEligibleTitle}
          </Text>
          <Text variant='body1Regular' className='mb-8 text-grayscale-300'>
            {t.notEligibleDescription}
          </Text>
        </div>
        <AppCTA label={t.notEligibleOpenApp} deepLink={`tixx://event/${event.id}`} />
      </main>
    );
  }

  // Re-derived on every render from displayText/country rather than kept in
  // its own state — AsYouType is cheap and this keeps a single source of
  // truth for "what E.164 number does the current input resolve to".
  const isInternationalInput = displayText.trim().startsWith('+');
  const currentFormatter = new AsYouType(isInternationalInput ? undefined : country);
  currentFormatter.input(displayText);
  const currentE164 = currentFormatter.getNumberValue() ?? '';
  const isPhoneValid = currentE164 !== '' && isValidPhoneNumber(currentE164);
  const phonePlaceholder = getExampleNumber(country, examples)?.formatNational() ?? '';

  const handlePhoneInputChange = (text: string) => {
    const isInternational = text.trim().startsWith('+');
    const formatter = new AsYouType(isInternational ? undefined : country);
    setDisplayText(formatter.input(text));
    if (isInternational) {
      const detected = formatter.getCountry();
      if (detected && detected !== country) setCountry(detected);
    }
  };

  const handleCountrySelect = (nextCountry: CountryCode) => {
    const wasInternational = displayText.trim().startsWith('+');
    const formatterForCurrent = new AsYouType(wasInternational ? undefined : country);
    formatterForCurrent.input(displayText);
    const nationalDigits = formatterForCurrent.getNationalNumber();

    setCountry(nextCountry);
    const formatter = new AsYouType(nextCountry);
    setDisplayText(formatter.input(nationalDigits));
  };

  const isSubmitting = step === 'submitting';

  const handleSendCode = async () => {
    if (!isPhoneValid || isRequestingCode || isSubmitting) return;
    setIsRequestingCode(true);
    setErrorMessage(null);
    setNeedsRefetch(false);
    try {
      // Issuing the code and checking whether this number already has an
      // account are independent — run them together rather than adding
      // checkPhoneRegistered's latency in front of the OTP request.
      const [result, registered] = await Promise.all([
        issuePhoneAuthCode(currentE164),
        checkPhoneRegistered(currentE164),
      ]);
      // now is otherwise only refreshed by the 1s interval below, which
      // doesn't restart on a resend within the same step — sync it here so
      // remainingMs/isResendCoolingDown never read a stale now right after
      // expiredAt/lastIssuedAt change.
      const issuedAt = Date.now();
      setVerifiedPhone(result.phone);
      setExpiredAt(new Date(result.expiredAt).getTime());
      setLastIssuedAt(issuedAt);
      setNow(issuedAt);
      setAuthCode('');
      setIsExistingUser(registered);
      setStep('otp-and-profile');
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

  const canSubmit =
    !isSubmitting &&
    !isOtpExpired &&
    authCode.trim().length > 0 &&
    (isExistingUser || (name.trim().length > 0 && termsAccepted));

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setStep('submitting');
    setErrorMessage(null);
    setNeedsRefetch(false);
    try {
      // rsvp.eventTicketId isn't shown on this page — completion is
      // announced generically and the ticket itself is only viewable in the
      // app (see docs/rsvp-phone-auth-frontend-implementation-plan.md §6,
      // W3 item 6).
      await createEventRsvp(event.id, {
        phone: verifiedPhone,
        authCode,
        // event-rsvp.service.ts only applies name/termsAccepted when
        // creating a brand-new user — omitted here for existing users since
        // the name/terms step is hidden and there's nothing to send.
        ...(isExistingUser
          ? {}
          : { name: name.trim(), termsAccepted: true }),
        marketingOptIn: marketingOptIn ? 1 : 0,
        marketingSmsOptIn: marketingOptIn ? 1 : 0,
        marketingEmailOptIn: marketingOptIn ? 1 : 0,
        marketingNightOptIn: marketingOptIn && marketingNightOptIn ? 1 : 0,
        redeemCodeId,
      });
      setStep('completed');
    } catch (error) {
      const action = handleApiError(error);
      if (action !== 'already_registered') {
        setStep('otp-and-profile');
      }
    }
  };

  return (
    <main style={themeVars} className='min-h-screen bg-black px-4 pb-32 pt-24 text-white'>
      <div className='mx-auto max-w-md'>
        <Text as='h1' variant='h1Semibold' className='mb-1'>
          {event.name}
        </Text>
        <Text variant='body3Regular' className='mb-8 text-grayscale-400'>
          {t.pageTitle}
        </Text>

        {step === 'phone' && (
          <div className='flex flex-col gap-4'>
            <Text variant='headline2Medium'>{t.phoneStepTitle}</Text>
            <Text variant='body3Regular' className='text-grayscale-400'>
              {t.phoneStepDescription}
            </Text>
            <div className='flex items-stretch gap-2'>
              <PhoneCountryPicker value={country} onChange={handleCountrySelect} />
              <input
                type='tel'
                inputMode='tel'
                autoFocus
                value={displayText}
                onChange={(e) => handlePhoneInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void handleSendCode();
                }}
                placeholder={phonePlaceholder || t.phonePlaceholder}
                className={answerInputClass}
                style={answerInputStyle}
              />
            </div>
            {errorMessage && (
              <Text variant='caption1Regular' className='text-red-400'>
                {errorMessage}
              </Text>
            )}
            <Button
              onClick={() => void handleSendCode()}
              className={
                !isPhoneValid || isRequestingCode ? 'pointer-events-none opacity-50' : undefined
              }
            >
              {t.sendCode}
            </Button>
          </div>
        )}

        {(step === 'otp-and-profile' || step === 'submitting') && (
          <div className='flex flex-col gap-5'>
            {!isExistingUser && (
              <Text variant='headline2Medium'>{t.profileStepTitle}</Text>
            )}
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2'>
                <input
                  type='text'
                  inputMode='numeric'
                  autoFocus
                  maxLength={6}
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, ''))}
                  placeholder={t.otpPlaceholder}
                  disabled={isSubmitting}
                  className={answerInputClass}
                  style={answerInputStyle}
                />
                <button
                  type='button'
                  onClick={() => void handleSendCode()}
                  disabled={isRequestingCode || isResendCoolingDown || isSubmitting}
                  className='shrink-0 whitespace-nowrap px-2 py-2 text-sm underline disabled:opacity-40'
                >
                  {t.resendCode}
                </button>
              </div>
              <Text variant='caption1Regular' className='text-grayscale-400'>
                {isOtpExpired ? t.errors.otpExpired : formatRemaining(remainingMs)}
              </Text>
            </div>

            {isExistingUser ? (
              <Text variant='caption1Regular' className='text-grayscale-400'>
                {t.existingUserNotice}
              </Text>
            ) : (
              <>
                <input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  disabled={isSubmitting}
                  className={answerInputClass}
                  style={answerInputStyle}
                />

                <label className='flex items-start gap-2 text-sm'>
                  <input
                    type='checkbox'
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    disabled={isSubmitting}
                    className='mt-1'
                  />
                  <span>
                    {t.termsLabel}{' '}
                    <Link href='/terms' target='_blank' rel='noopener noreferrer' className='underline'>
                      {t.termsLinkTerms}
                    </Link>{' '}
                    /{' '}
                    <Link href='/privacy' target='_blank' rel='noopener noreferrer' className='underline'>
                      {t.termsLinkPrivacy}
                    </Link>
                  </span>
                </label>

                <label className='flex items-start gap-2 text-sm'>
                  <input
                    type='checkbox'
                    checked={marketingOptIn}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setMarketingOptIn(checked);
                      if (!checked) setMarketingNightOptIn(false);
                    }}
                    disabled={isSubmitting}
                    className='mt-1'
                  />
                  <span>{t.marketingLabel}</span>
                </label>

                <label className='flex items-start gap-2 text-sm opacity-80'>
                  <input
                    type='checkbox'
                    checked={marketingNightOptIn}
                    onChange={(e) => setMarketingNightOptIn(e.target.checked)}
                    disabled={isSubmitting || !marketingOptIn}
                    className='mt-1'
                  />
                  <span>{t.marketingNightLabel}</span>
                </label>
              </>
            )}

            {errorMessage && (
              <Text variant='caption1Regular' className='text-red-400'>
                {errorMessage}
              </Text>
            )}
            {needsRefetch && (
              <button
                type='button'
                onClick={() => window.location.reload()}
                className='self-start text-sm underline text-grayscale-300'
              >
                {t.recheck}
              </button>
            )}

            <Button
              onClick={() => void handleSubmit()}
              className={!canSubmit ? 'pointer-events-none opacity-50' : undefined}
            >
              {isSubmitting ? t.submitting : t.submit}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
