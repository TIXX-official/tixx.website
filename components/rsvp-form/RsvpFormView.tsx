'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { RsvpForm, RsvpSubmissionAnswerValue } from '@/lib/api/types';
import { RsvpFormShell } from './RsvpFormShell';
import { RsvpAnswers, RsvpStepEngine } from './RsvpStepEngine';

// Generic placeholder renderer/validator — replaced by typed block
// components (short_text/long_text/phone/choice/legal) in the next
// implementation-plan unit. Keeps the step engine exercisable end-to-end
// in the meantime.
function renderBlockPlaceholder(
  block: RsvpForm['blocks'][number],
  value: RsvpSubmissionAnswerValue | undefined,
  onChange: (value: RsvpSubmissionAnswerValue) => void
) {
  return (
    <>
      <h2 className="text-2xl font-semibold" style={{ fontSize: 'var(--rsvp-label-size)' }}>
        {block.label}
      </h2>
      <input
        type="text"
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-current bg-transparent px-2 py-2 text-center outline-none"
      />
    </>
  );
}

function isBlockValidPlaceholder(
  block: RsvpForm['blocks'][number],
  value: RsvpSubmissionAnswerValue | undefined
) {
  if (!block.required) return true;
  return typeof value === 'string' && value.trim().length > 0;
}

export function RsvpFormView({ form }: { form: RsvpForm }) {
  const [submitted, setSubmitted] = useState(false);

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

  const handleComplete = (_answers: RsvpAnswers) => {
    // Real submission (submitRsvpForm, consent snapshot, honeypot, error
    // handling) lands in a later implementation-plan unit.
    setSubmitted(true);
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
        <RsvpStepEngine
          coverContent={coverContent}
          blocks={form.blocks}
          renderBlock={renderBlockPlaceholder}
          isBlockValid={isBlockValidPlaceholder}
          onComplete={handleComplete}
        />
      )}
    </RsvpFormShell>
  );
}
