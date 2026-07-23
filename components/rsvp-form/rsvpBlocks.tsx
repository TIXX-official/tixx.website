'use client';

import { AsYouType, isValidPhoneNumber } from 'libphonenumber-js';
import type { RsvpFormBlock, RsvpSubmissionAnswerValue } from '@/lib/api/types';

interface BlockProps {
  block: RsvpFormBlock;
  value: RsvpSubmissionAnswerValue | undefined;
  onChange: (value: RsvpSubmissionAnswerValue) => void;
}

const labelClass = 'font-semibold';
const labelStyle = { fontSize: 'var(--rsvp-label-size)' };
const inputClass =
  'w-full border-b border-current bg-transparent px-2 py-2 text-center outline-none';

function ShortTextBlock({ block, value, onChange }: BlockProps) {
  const config = block.config.type === 'short_text' ? block.config : undefined;
  return (
    <>
      <h2 className={labelClass} style={labelStyle}>
        {block.label}
      </h2>
      <input
        type="text"
        value={typeof value === 'string' ? value : ''}
        maxLength={config?.maxLength}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </>
  );
}

function LongTextBlock({ block, value, onChange }: BlockProps) {
  const config = block.config.type === 'long_text' ? block.config : undefined;
  return (
    <>
      <h2 className={labelClass} style={labelStyle}>
        {block.label}
      </h2>
      <textarea
        value={typeof value === 'string' ? value : ''}
        maxLength={config?.maxLength}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className={`${inputClass} resize-none`}
      />
    </>
  );
}

function PhoneBlock({ block, value, onChange }: BlockProps) {
  return (
    <>
      <h2 className={labelClass} style={labelStyle}>
        {block.label}
      </h2>
      <input
        type="tel"
        inputMode="numeric"
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(new AsYouType('KR').input(e.target.value))}
        placeholder="010-1234-5678"
        className={inputClass}
      />
    </>
  );
}

function ChoiceBlock({ block, value, onChange }: BlockProps) {
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
      <h2 className={labelClass} style={labelStyle}>
        {block.label}
      </h2>
      <div className="flex w-full flex-col gap-3">
        {config.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={`w-full rounded-xl border px-4 py-3 transition-colors ${
              selected.has(option)
                ? 'border-[var(--rsvp-accent)] bg-[var(--rsvp-accent)] text-black'
                : 'border-current bg-transparent'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </>
  );
}

function LegalBlock({ block, value, onChange }: BlockProps) {
  const config = block.config.type === 'legal' ? block.config : undefined;
  const checked = value === true;

  return (
    <>
      <h2 className={labelClass} style={labelStyle}>
        {block.label}
      </h2>
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
          className="h-5 w-5 accent-[var(--rsvp-accent)]"
        />
        {config?.purpose === 'marketing_sms' ? '동의합니다 (선택)' : '동의합니다'}
      </label>
    </>
  );
}

export function renderRsvpBlock(
  block: RsvpFormBlock,
  value: RsvpSubmissionAnswerValue | undefined,
  onChange: (value: RsvpSubmissionAnswerValue) => void
) {
  const props: BlockProps = { block, value, onChange };

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
