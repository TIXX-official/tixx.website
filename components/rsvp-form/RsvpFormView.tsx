'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import type { CreateRsvpSubmissionRequest, RsvpForm, RsvpSubmissionErrorResponse } from '@/lib/api/types';
import { RsvpSubmissionError, submitRsvpForm } from '@/lib/api/rsvp-forms';
import { RsvpFormShell } from './RsvpFormShell';
import { RsvpAnswers, RsvpStepEngine } from './RsvpStepEngine';
import { isRsvpBlockValid, renderRsvpBlock } from './rsvpBlocks';

// FORM_CHANGED reloads the page shortly after showing this message — the
// server-rendered page.tsx will refetch getRsvpForm() and pick up the new
// revision, since answers against a stale block set can't be safely
// remapped. See docs/rsvp-form-feature-plan.md section 3 ("공개 상태·수정 충돌").
const FORM_CHANGED_RELOAD_DELAY_MS = 1500;

// Every RsvpSubmissionErrorResponse variant carries a `message`, but it's
// the backend's internal/English description (e.g. "RSVP form has
// changed") — not copy meant for visitors. Map by `code` instead.
function resolveErrorMessage(response: RsvpSubmissionErrorResponse): string {
  switch (response.code) {
    case 'FORM_NOT_FOUND':
      return '이 폼은 더 이상 사용할 수 없습니다.';
    case 'FORM_CHANGED':
      return '폼 내용이 변경되어 새로고침합니다.';
    case 'RATE_LIMITED':
      return response.retryAfterSeconds
        ? `${response.retryAfterSeconds}초 후 다시 시도해주세요.`
        : '잠시 후 다시 시도해주세요.';
    case 'VALIDATION_ERROR':
      return '입력값을 다시 확인해주세요.';
  }
}

export function RsvpFormView({ form, isPreview = false }: { form: RsvpForm; isPreview?: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Gate the initial reveal on every image the page needs, not just each
  // one individually — background and poster otherwise finish decoding at
  // different times and the page visibly assembles itself piece by piece.
  // An image that 404s still resolves the gate via onError so a broken URL
  // can't leave the page stuck hidden forever.
  const [backgroundReady, setBackgroundReady] = useState(!form.theme.backgroundImage);
  const [posterReady, setPosterReady] = useState(!form.posterImageUrl);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const ready = backgroundReady && posterReady;

  const coverContent = (
    <>
      {form.posterImageUrl && (
        <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl">
          <Image
            src={form.posterImageUrl}
            alt={form.title ?? form.caption ?? 'RSVP'}
            fill
            priority
            sizes="(min-width: 640px) 384px, 100vw"
            className="object-cover"
            onLoad={() => setPosterReady(true)}
            onError={() => setPosterReady(true)}
          />
        </div>
      )}
      {form.title && <h1 className="max-w-md text-xl font-semibold">{form.title}</h1>}
      {form.caption && (
        <div className="max-w-md">
          <p
            className="font-medium"
            style={{
              fontSize: 'var(--rsvp-label-size)',
              ...(captionExpanded
                ? {}
                : {
                    display: '-webkit-box',
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }),
            }}
          >
            {form.caption}
          </p>
          <button
            type="button"
            onClick={() => setCaptionExpanded((prev) => !prev)}
            aria-expanded={captionExpanded}
            className="mt-1 flex w-full justify-center opacity-60"
          >
            {captionExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      )}
      {form.showHostBadge && form.host && (
        <p className="text-sm opacity-60">Hosted by {form.host.name}</p>
      )}
    </>
  );

  const handleComplete = async (answers: RsvpAnswers) => {
    // Never actually submit from a preview — the form here may be a draft
    // (submissions require published) or, worse, an already-published form
    // a host is just checking the look of, where a real POST would create a
    // genuine RSVP entry mixed in with real visitor data.
    if (isPreview) {
      setSubmitted(true);
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    const payload: CreateRsvpSubmissionRequest = {
      revision: form.revision,
      answers: Object.entries(answers).map(([blockId, value]) => ({
        blockId: Number(blockId),
        value,
      })),
    };

    try {
      await submitRsvpForm(form.publicId, payload);
      setSubmitted(true);
    } catch (error) {
      if (error instanceof RsvpSubmissionError) {
        setSubmitError(resolveErrorMessage(error.response));
        if (error.response.code === 'FORM_CHANGED') {
          setTimeout(() => window.location.reload(), FORM_CHANGED_RELOAD_DELAY_MS);
        }
      } else {
        setSubmitError('제출에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RsvpFormShell
      theme={form.theme}
      ready={ready}
      onBackgroundImageResolved={() => setBackgroundReady(true)}
    >
      {submitted ? (
        <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p className="text-2xl font-semibold" style={{ fontSize: 'var(--rsvp-label-size)' }}>
            {isPreview ? '프리뷰에서는 제출이 되지 않아요' : '제출이 완료되었습니다'}
          </p>
          {isPreview && (
            <p className="mt-2 text-sm opacity-60">실제 방문자가 제출하면 이렇게 완료 화면이 보여요.</p>
          )}
        </main>
      ) : (
        <RsvpStepEngine
          coverContent={coverContent}
          blocks={form.blocks}
          renderBlock={renderRsvpBlock}
          isBlockValid={isRsvpBlockValid}
          onComplete={handleComplete}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      )}
    </RsvpFormShell>
  );
}
