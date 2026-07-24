'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, ChevronLeft, ChevronUp } from 'lucide-react';
import { useState, type KeyboardEvent, type ReactNode } from 'react';
import type { RsvpFormBlock, RsvpSubmissionAnswerValue } from '@/lib/api/types';

export type RsvpAnswers = Record<number, RsvpSubmissionAnswerValue>;

interface RsvpStepEngineProps {
  coverContent: ReactNode;
  blocks: RsvpFormBlock[];
  renderBlock: (
    block: RsvpFormBlock,
    value: RsvpSubmissionAnswerValue | undefined,
    onChange: (value: RsvpSubmissionAnswerValue) => void,
    questionNumber: number
  ) => ReactNode;
  onComplete: (answers: RsvpAnswers) => void | Promise<void>;
  isBlockValid: (block: RsvpFormBlock, value: RsvpSubmissionAnswerValue | undefined) => boolean;
  isSubmitting?: boolean;
  submitError?: string | null;
}

// One block fully occupies the screen at a time (see
// docs/rsvp-form-feature-plan.md section 3 "스텝 엔진") so a per-form
// background image never has to share space with multiple stacked fields.
// index 0 is the cover (poster/caption), 1..N are blocks, index N+1 hands off
// to onComplete (submission itself is wired in a later unit).
export function RsvpStepEngine({
  coverContent,
  blocks,
  renderBlock,
  onComplete,
  isBlockValid,
  isSubmitting = false,
  submitError = null,
}: RsvpStepEngineProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<RsvpAnswers>({});

  const totalSteps = blocks.length + 1; // cover + blocks (completion isn't a counted step)
  const currentBlock = stepIndex >= 1 ? blocks[stepIndex - 1] : null;

  const canProceed = currentBlock
    ? isBlockValid(currentBlock, answers[currentBlock.id])
    : true;

  // Self-gated so every entry point (bottom nav, inline OK button, Enter key)
  // shares the exact same rule — none of them can skip a required question
  // (e.g. the always-required `legal` "collection" consent block).
  const goNext = () => {
    if (stepIndex >= totalSteps || isSubmitting || !canProceed) return;

    if (stepIndex === totalSteps - 1) {
      onComplete(answers);
      return;
    }

    setStepIndex((prev) => prev + 1);
  };

  const goBack = () => {
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  const setAnswer = (blockId: number, value: RsvpSubmissionAnswerValue) => {
    setAnswers((prev) => ({ ...prev, [blockId]: value }));
  };

  // Enter advances to the next step, sharing goNext's gate. Choice options
  // and the legal checkbox keep their native Enter/Space activation only —
  // preventDefault here would hijack the browser's own toggle behavior.
  // Shift+Enter in a textarea inserts a newline (the browser's default
  // Enter behavior already does this — we just don't intercept it).
  const handleStepKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter') return;

    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON') return;
    if (target instanceof HTMLInputElement && target.type === 'checkbox') return;
    if (target instanceof HTMLTextAreaElement && e.shiftKey) return;

    e.preventDefault();
    goNext();
  };

  const nextLabel =
    stepIndex === 0
      ? '시작하기'
      : stepIndex === totalSteps - 1
        ? isSubmitting
          ? '제출 중...'
          : '제출하기'
        : '다음';

  return (
    <div className="flex min-h-screen flex-col">
      {stepIndex >= 1 && (
        <div className="h-1 w-full bg-white/15">
          <div
            className="h-full bg-[var(--rsvp-button-color)] transition-[width] duration-300"
            style={{ width: `${(stepIndex / totalSteps) * 100}%` }}
          />
        </div>
      )}

      <div className="flex flex-1 items-center justify-center overflow-hidden px-6 py-12 pb-24 md:pb-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onKeyDown={handleStepKeyDown}
            className="flex w-full max-w-md flex-col items-center gap-8 text-center md:max-w-2xl lg:max-w-3xl"
          >
            {stepIndex === 0
              ? coverContent
              : currentBlock &&
                renderBlock(
                  currentBlock,
                  answers[currentBlock.id],
                  (value) => setAnswer(currentBlock.id, value),
                  stepIndex
                )}

            {/* Inline confirm button — the primary "answer this and advance"
                action, styled prominently right under the input. Desktop/
                tablet only: mobile relies solely on the fixed bottom bar
                below to avoid showing two "confirm" buttons on one screen. */}
            <button
              type="button"
              onClick={goNext}
              disabled={!canProceed || isSubmitting}
              className="hidden items-center gap-2 rounded-full bg-[var(--rsvp-button-color)] px-8 py-3 font-semibold transition-opacity disabled:opacity-40 md:inline-flex"
              style={{ color: 'var(--rsvp-button-text-color)' }}
            >
              {nextLabel}
              <Check className="h-4 w-4" />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile: one large fixed bottom button, small back button inline to
          its left when available. */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex flex-col gap-2 px-4 py-4 md:hidden">
        {submitError && <p className="text-center text-sm text-red-400">{submitError}</p>}
        <div className="flex items-center gap-3">
          {stepIndex >= 1 && (
            <button
              type="button"
              onClick={goBack}
              disabled={isSubmitting}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-current opacity-70 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <button
            type="button"
            onClick={goNext}
            disabled={!canProceed || isSubmitting}
            className="flex-1 rounded-full bg-[var(--rsvp-button-color)] px-8 py-4 font-semibold disabled:opacity-40"
            style={{ color: 'var(--rsvp-button-text-color)' }}
          >
            {nextLabel}
          </button>
        </div>
      </div>

      {/* Desktop/tablet: small centered up/down arrow pair, secondary to the
          inline OK button above. */}
      <div className="hidden flex-col items-center gap-2 pb-10 md:flex">
        {submitError && <p className="text-center text-sm text-red-400">{submitError}</p>}
        <div className="flex items-center justify-center gap-4">
          {stepIndex >= 1 && (
            <button
              type="button"
              onClick={goBack}
              disabled={isSubmitting}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-current opacity-70 transition-opacity hover:opacity-100 disabled:opacity-30"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
          )}
          {/* Hidden on the final (submit) step — a bare arrow icon here
              reads as "keep navigating" and is too easy to click by
              accident while browsing back and forth; submission should
              only happen via the clearly-labeled inline OK/제출하기 button. */}
          {stepIndex < totalSteps - 1 && (
            <button
              type="button"
              onClick={goNext}
              disabled={!canProceed || isSubmitting}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--rsvp-button-color)] disabled:opacity-40"
              style={{ color: 'var(--rsvp-button-text-color)' }}
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
