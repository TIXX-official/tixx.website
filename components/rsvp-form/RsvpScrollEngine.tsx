'use client';

import { useRef, useState, type ReactNode } from 'react';
import type { RsvpFormBlock, RsvpSubmissionAnswerValue } from '@/lib/api/types';
import type { RsvpAnswers } from './RsvpStepEngine';

interface RsvpScrollEngineProps {
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
  onStart?: () => void;
}

// All blocks are stacked on one page (see docs/rsvp-form-feature-plan.md
// section 3 "폼 레이아웃" — the `scroll` layout, Google Forms style). Unlike
// RsvpStepEngine there is no "current step" to gate on, so validity is
// checked for every block at once when the visitor presses submit, rather
// than per-field as they go.
export function RsvpScrollEngine({
  coverContent,
  blocks,
  renderBlock,
  onComplete,
  isBlockValid,
  isSubmitting = false,
  submitError = null,
  onStart,
}: RsvpScrollEngineProps) {
  const [answers, setAnswers] = useState<RsvpAnswers>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const blockRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const setAnswer = (blockId: number, value: RsvpSubmissionAnswerValue) => {
    onStart?.();
    setAnswers((prev) => ({ ...prev, [blockId]: value }));
  };

  const handleSubmit = () => {
    if (isSubmitting) return;

    const firstInvalid = blocks.find((block) => !isBlockValid(block, answers[block.id]));
    if (firstInvalid) {
      setAttemptedSubmit(true);
      blockRefs.current[firstInvalid.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    onComplete(answers);
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-6 py-12">
      <div className="flex w-full max-w-md flex-col items-center gap-8 text-center md:max-w-2xl lg:max-w-3xl">
        {coverContent}

        {blocks.map((block, index) => {
          const invalid = attemptedSubmit && !isBlockValid(block, answers[block.id]);
          return (
            <div
              key={block.id}
              ref={(el) => {
                blockRefs.current[block.id] = el;
              }}
              className={`flex w-full flex-col items-center gap-4 rounded-2xl p-4 transition-colors ${
                invalid ? 'ring-2 ring-red-400' : ''
              }`}
            >
              {renderBlock(block, answers[block.id], (value) => setAnswer(block.id, value), index + 1)}
              {invalid && <p className="w-full text-left text-xs text-red-400">입력값을 확인해주세요</p>}
            </div>
          );
        })}

        <div className="flex w-full flex-col items-center gap-3 pb-12 pt-4">
          {submitError && <p className="text-center text-sm text-red-400">{submitError}</p>}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full max-w-xs rounded-full bg-[var(--rsvp-button-color)] px-8 py-4 font-semibold disabled:opacity-40"
            style={{ color: 'var(--rsvp-button-text-color)' }}
          >
            {isSubmitting ? '제출 중...' : '제출하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
