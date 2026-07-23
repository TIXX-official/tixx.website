'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { RsvpForm } from '@/lib/api/types';
import { RsvpFormShell } from './RsvpFormShell';
import { RsvpAnswers, RsvpStepEngine } from './RsvpStepEngine';
import { isRsvpBlockValid, renderRsvpBlock } from './rsvpBlocks';

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
          renderBlock={renderRsvpBlock}
          isBlockValid={isRsvpBlockValid}
          onComplete={handleComplete}
        />
      )}
    </RsvpFormShell>
  );
}
