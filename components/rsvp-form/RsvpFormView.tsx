'use client';

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

function resolveErrorMessage(response: RsvpSubmissionErrorResponse): string {
  if (response.message) return response.message;

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

export function RsvpFormView({ form }: { form: RsvpForm }) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Honeypot: hidden from real visitors via CSS, so a filled value here means
  // an automated submission — see docs/rsvp-form-api-requirements.md section 5.
  const [honeypot, setHoneypot] = useState('');

  const coverContent = (
    <>
      {form.theme.backgroundType === 'color' && form.posterImageUrl && (
        <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl">
          <Image
            src={form.posterImageUrl}
            alt={form.caption ?? 'RSVP'}
            fill
            priority
            sizes="(min-width: 640px) 384px, 100vw"
            className="object-cover"
          />
        </div>
      )}
      {form.caption && (
        <p className="max-w-md font-medium" style={{ fontSize: 'var(--rsvp-label-size)' }}>
          {form.caption}
        </p>
      )}
      {form.showHostBadge && form.host && (
        <p className="text-sm opacity-60">Hosted by {form.host.name}</p>
      )}
    </>
  );

  const handleComplete = async (answers: RsvpAnswers) => {
    setSubmitError(null);
    setIsSubmitting(true);

    const payload: CreateRsvpSubmissionRequest = {
      revision: form.revision,
      answers: Object.entries(answers).map(([blockId, value]) => ({
        blockId: Number(blockId),
        value,
      })),
      website: honeypot,
    };

    try {
      await submitRsvpForm(form.id, payload);
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
    <RsvpFormShell theme={form.theme}>
      {submitted ? (
        <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p className="text-2xl font-semibold" style={{ fontSize: 'var(--rsvp-label-size)' }}>
            제출이 완료되었습니다
          </p>
        </main>
      ) : (
        <>
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />
          <RsvpStepEngine
            coverContent={coverContent}
            blocks={form.blocks}
            renderBlock={renderRsvpBlock}
            isBlockValid={isRsvpBlockValid}
            onComplete={handleComplete}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        </>
      )}
    </RsvpFormShell>
  );
}
