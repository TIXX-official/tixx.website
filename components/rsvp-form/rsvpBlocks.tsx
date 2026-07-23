'use client';

import parsePhoneNumberFromString, {
  AsYouType,
  isValidPhoneNumber,
  getExampleNumber,
  type CountryCode,
} from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';
import type { CSSProperties, ReactNode } from 'react';
import { useMemo, useState } from 'react';
import type { RsvpFormBlock, RsvpSubmissionAnswerValue } from '@/lib/api/types';
import { rsvpTextAlignStyle } from '@/lib/format/rsvpTheme';
import { PhoneCountryPicker } from './PhoneCountryPicker';

interface BlockProps {
  block: RsvpFormBlock;
  value: RsvpSubmissionAnswerValue | undefined;
  onChange: (value: RsvpSubmissionAnswerValue) => void;
  questionNumber: number;
}

const inputClass = 'w-full border-b border-current bg-transparent px-2 py-2 outline-none';
const answerStyle: CSSProperties = { color: 'var(--rsvp-answer-color)', ...rsvpTextAlignStyle };

// Circular badge, but sized in `em` off the surrounding label font-size and
// rendered `inline-flex` so it flows as part of the same text line as the
// question — not a separate row/block taking its own space (that was the
// previous version's problem) — while still visually reading as a badge,
// not plain "1." text.
function QuestionLabel({ number, children }: { number: number; children: ReactNode }) {
  return (
    <h2
      className="w-full font-semibold"
      style={{ fontSize: 'var(--rsvp-label-size)', ...rsvpTextAlignStyle }}
    >
      <span
        className="mr-2 inline-flex h-[0.75em] w-[0.75em] items-center justify-center rounded-full align-middle text-[0.45em] font-bold"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--rsvp-button-color) 20%, transparent)',
          color: 'var(--rsvp-button-color)',
        }}
      >
        {number}
      </span>
      {children}
    </h2>
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
  // Two pieces of state, both restored once from `value` on mount — the step
  // engine's AnimatePresence mode="wait" fully unmounts/remounts each step,
  // so there's no external mutation path to miss between renders.
  const [country, setCountry] = useState<CountryCode>(() => {
    if (typeof value === 'string' && value) {
      return parsePhoneNumberFromString(value)?.country ?? 'KR';
    }
    return 'KR';
  });
  const [displayText, setDisplayText] = useState<string>(() => {
    if (typeof value !== 'string' || !value) return '';
    return parsePhoneNumberFromString(value)?.formatNational() ?? value;
  });

  const placeholder = useMemo(
    () => getExampleNumber(country, examples)?.formatNational() ?? '',
    [country]
  );

  const handleInputChange = (text: string) => {
    const isInternational = text.trim().startsWith('+');
    const formatter = new AsYouType(isInternational ? undefined : country);
    setDisplayText(formatter.input(text));

    if (isInternational) {
      const detected = formatter.getCountry();
      if (detected && detected !== country) setCountry(detected);
    }

    if (text === '') {
      onChange('');
    } else {
      const e164 = formatter.getNumberValue();
      // Only reports once resolvable — in international mode, the first 1-2
      // keystrokes (while the calling code is still ambiguous) leave the
      // previously-reported value in place rather than clearing it.
      if (e164) onChange(e164);
    }
  };

  // Re-derives the national digits via getNationalNumber() (not a naive
  // digit-strip of displayText) so leftover calling-code digits from a
  // mid-typed international entry don't leak into the new country's number.
  const handleCountrySelect = (nextCountry: CountryCode) => {
    const wasInternational = displayText.trim().startsWith('+');
    const currentFormatter = new AsYouType(wasInternational ? undefined : country);
    currentFormatter.input(displayText);
    const nationalDigits = currentFormatter.getNationalNumber();

    setCountry(nextCountry);
    const formatter = new AsYouType(nextCountry);
    setDisplayText(formatter.input(nationalDigits));
    onChange(nationalDigits ? (formatter.getNumberValue() ?? '') : '');
  };

  return (
    <>
      <QuestionLabel number={questionNumber}>{block.label}</QuestionLabel>
      <div className="flex w-full items-stretch gap-2">
        <PhoneCountryPicker value={country} onChange={handleCountrySelect} />
        <input
          type="tel"
          inputMode="tel"
          value={displayText}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 border-b border-current bg-transparent px-2 py-2 outline-none placeholder:text-[color:var(--rsvp-answer-placeholder-color)]"
          style={answerStyle}
        />
      </div>
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
      return typeof value === 'string' && isValidPhoneNumber(value);
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
