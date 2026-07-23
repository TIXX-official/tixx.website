'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import type { RsvpFormBlock, RsvpSubmissionAnswerValue } from '@/lib/api/types';

export type RsvpAnswers = Record<number, RsvpSubmissionAnswerValue>;

interface RsvpStepEngineProps {
  coverContent: ReactNode;
  blocks: RsvpFormBlock[];
  renderBlock: (
    block: RsvpFormBlock,
    value: RsvpSubmissionAnswerValue | undefined,
    onChange: (value: RsvpSubmissionAnswerValue) => void
  ) => ReactNode;
  onComplete: (answers: RsvpAnswers) => void;
  isBlockValid: (block: RsvpFormBlock, value: RsvpSubmissionAnswerValue | undefined) => boolean;
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
}: RsvpStepEngineProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<RsvpAnswers>({});

  const totalSteps = blocks.length + 1; // cover + blocks (completion isn't a counted step)
  const currentBlock = stepIndex >= 1 ? blocks[stepIndex - 1] : null;

  const goNext = () => {
    if (stepIndex >= totalSteps) return;

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

  const canProceed = currentBlock
    ? isBlockValid(currentBlock, answers[currentBlock.id])
    : true;

  return (
    <div className="flex min-h-screen flex-col">
      {stepIndex >= 1 && (
        <div className="h-1 w-full bg-white/15">
          <div
            className="h-full bg-[var(--rsvp-accent)] transition-[width] duration-300"
            style={{ width: `${(stepIndex / totalSteps) * 100}%` }}
          />
        </div>
      )}

      <div className="flex flex-1 items-center justify-center overflow-hidden px-6 py-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex w-full max-w-md flex-col items-center gap-8 text-center"
          >
            {stepIndex === 0
              ? coverContent
              : currentBlock &&
                renderBlock(currentBlock, answers[currentBlock.id], (value) =>
                  setAnswer(currentBlock.id, value)
                )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between px-6 pb-10">
        {stepIndex >= 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="rounded-full px-4 py-2 text-sm opacity-70 transition-opacity hover:opacity-100"
          >
            뒤로
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={goNext}
          disabled={!canProceed}
          className="rounded-full bg-[var(--rsvp-accent)] px-8 py-3 font-semibold text-black transition-opacity disabled:opacity-40"
        >
          {stepIndex === 0 ? '시작하기' : stepIndex === totalSteps - 1 ? '제출하기' : '다음'}
        </button>
      </div>
    </div>
  );
}
