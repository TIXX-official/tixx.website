'use client';

import { AsYouType, isValidPhoneNumber } from 'libphonenumber-js';
import type { CSSProperties, ReactNode } from 'react';
import type { RsvpFormBlock, RsvpSubmissionAnswerValue } from '@/lib/api/types';
import { rsvpTextAlignStyle } from '@/lib/format/rsvpTheme';

interface BlockProps {
  block: RsvpFormBlock;
  value: RsvpSubmissionAnswerValue | undefined;
  onChange: (value: RsvpSubmissionAnswerValue) => void;
  questionNumber: number;
}

// w-full matters here: without an explicit width, the <h2> shrinks to fit
// its own content as a flex item, which makes text-align a no-op. This
// keeps `alignment: 'center'` visually identical to before while making
// `alignment: 'left'` actually work.
const labelClass = 'w-full font-semibold';
const labelStyle: CSSProperties = { fontSize: 'var(--rsvp-label-size)', ...rsvpTextAlignStyle };
const inputClass = 'w-full border-b border-current bg-transparent px-2 py-2 outline-none';
const answerStyle: CSSProperties = { color: 'var(--rsvp-answer-color)', ...rsvpTextAlignStyle };

// Typeform-style "N →" number tightly paired with the question label — kept
// in one flex column (not a top-level sibling) so the step container's
// gap-8 doesn't visually separate the number from its question.
function QuestionLabel({ number, children }: { number: number; children: ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-1">
      <span
        className="text-sm font-semibold opacity-70"
        style={{ color: 'var(--rsvp-button-color)', ...rsvpTextAlignStyle }}
      >
        {number} →
      </span>
      <h2 className={labelClass} style={labelStyle}>
        {children}
      </h2>
    </div>
  );
}

function ShortTextBlock({ block, value, onChange, questionNumber }: BlockProps) {
  const config = block.config.type === 'short_text' ? block.config : undefined;
  return (
    <>
      <QuestionLabel number={questionNumber}>{block.label}</QuestionLabel>
      <input
        type="text"
        value={typeof value === 'string' ? value : ''}
        maxLength={config?.maxLength}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        style={answerStyle}
      />
    </>
  );
}

function LongTextBlock({ block, value, onChange, questionNumber }: BlockProps) {
  const config = block.config.type === 'long_text' ? block.config : undefined;
  return (
    <>
      <QuestionLabel number={questionNumber}>{block.label}</QuestionLabel>
      <textarea
        value={typeof value === 'string' ? value : ''}
        maxLength={config?.maxLength}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className={`${inputClass} resize-none`}
        style={answerStyle}
      />
      <p className="w-full text-xs opacity-50" style={rsvpTextAlignStyle}>
        Shift + Enter로 줄바꿈
      </p>
    </>
  );
}

function PhoneBlock({ block, value, onChange, questionNumber }: BlockProps) {
  return (
    <>
      <QuestionLabel number={questionNumber}>{block.label}</QuestionLabel>
      <input
        type="tel"
        inputMode="numeric"
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(new AsYouType('KR').input(e.target.value))}
        placeholder="010-1234-5678"
        className={`${inputClass} placeholder:text-[color:var(--rsvp-answer-placeholder-color)]`}
        style={answerStyle}
      />
    </>
  );
}

function ChoiceBlock({ block, value, onChange, questionNumber }: BlockProps) {
  const config = block.config.type === 'choice' ? block.config : undefined;
  if (!config) return null;

  const selected = new Set(
    config.multiple ? (Array.isArray(value) ? value : []) : value ? [value as string] : []
  );

  const toggle = (option: string) => {
    if (!config.multiple) {
      onChange(option);
      return;
    }

    const next = new Set(selected);
    if (next.has(option)) {
      next.delete(option);
    } else {
      next.add(option);
    }
    onChange(Array.from(next));
  };

  return (
    <>
      <QuestionLabel number={questionNumber}>{block.label}</QuestionLabel>
      <div className="flex w-full flex-col gap-3">
        {config.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={`w-full rounded-xl border px-4 py-3 transition-colors ${
              selected.has(option)
                ? 'border-[var(--rsvp-button-color)] bg-[var(--rsvp-button-color)]'
                : 'border-current bg-transparent'
            }`}
            style={selected.has(option) ? { color: 'var(--rsvp-button-text-color)' } : undefined}
          >
            {option}
          </button>
        ))}
      </div>
    </>
  );
}

function LegalBlock({ block, value, onChange, questionNumber }: BlockProps) {
  const config = block.config.type === 'legal' ? block.config : undefined;
  const checked = value === true;

  return (
    <>
      <QuestionLabel number={questionNumber}>{block.label}</QuestionLabel>
      {config?.content && (
        <p className="max-h-40 w-full overflow-y-auto rounded-lg bg-white/5 p-4 text-left text-sm opacity-80">
          {config.content}
        </p>
      )}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-5 w-5 accent-[var(--rsvp-button-color)]"
        />
        {config?.purpose === 'marketing_sms' ? '동의합니다 (선택)' : '동의합니다'}
      </label>
    </>
  );
}

export function renderRsvpBlock(
  block: RsvpFormBlock,
  value: RsvpSubmissionAnswerValue | undefined,
  onChange: (value: RsvpSubmissionAnswerValue) => void,
  questionNumber: number
) {
  const props: BlockProps = { block, value, onChange, questionNumber };

  switch (block.type) {
    case 'short_text':
      return <ShortTextBlock {...props} />;
    case 'long_text':
      return <LongTextBlock {...props} />;
    case 'phone':
      return <PhoneBlock {...props} />;
    case 'choice':
      return <ChoiceBlock {...props} />;
    case 'legal':
      return <LegalBlock {...props} />;
  }
}

export function isRsvpBlockValid(
  block: RsvpFormBlock,
  value: RsvpSubmissionAnswerValue | undefined
): boolean {
  switch (block.type) {
    case 'short_text':
    case 'long_text':
      if (!block.required) return true;
      return typeof value === 'string' && value.trim().length > 0;

    case 'phone': {
      if (!block.required && (value === undefined || value === '')) return true;
      return typeof value === 'string' && isValidPhoneNumber(value, 'KR');
    }

    case 'choice': {
      if (!block.required) return true;
      if (block.config.type !== 'choice') return false;
      return block.config.multiple
        ? Array.isArray(value) && value.length > 0
        : typeof value === 'string' && value.length > 0;
    }

    case 'legal': {
      // purpose decides required-ness, not block.required — see
      // docs/rsvp-form-feature-plan.md section 3. `collection` must always
      // be agreed to (defense in depth against a misconfigured block);
      // `marketing_sms` is optional, so both true and false are valid
      // answers and never block the step.
      if (block.config.type !== 'legal') return false;
      if (block.config.purpose === 'marketing_sms') return true;
      return value === true;
    }
  }
}
