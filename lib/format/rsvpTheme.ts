import type { CSSProperties } from 'react';
import type { RsvpFormFontId, RsvpFormSizeScale, RsvpFormTheme } from '@/lib/api/types';

function normalizeHexColor(color?: string | null): string | null {
  if (!color) return null;

  const trimmed = color.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(trimmed)) return null;

  if (trimmed.length === 3) {
    return `#${trimmed
      .split('')
      .map((char) => char + char)
      .join('')
      .toUpperCase()}`;
  }

  return `#${trimmed.toUpperCase()}`;
}

function hexToRgb(hex: string) {
  const normalized = normalizeHexColor(hex);
  if (!normalized) return null;

  const raw = normalized.slice(1);
  return {
    r: parseInt(raw.slice(0, 2), 16),
    g: parseInt(raw.slice(2, 4), 16),
    b: parseInt(raw.slice(4, 6), 16),
  };
}

// Alpha-blended rather than pre-flattened against a single background hex —
// this composites correctly whether what's behind it is a flat color, an
// image, or an image+brightness overlay, without needing to know which.
const ANSWER_PLACEHOLDER_ALPHA = 0.45;

export function buildAnswerPlaceholderColor(answerColor: string): string {
  const rgb = hexToRgb(answerColor);
  if (!rgb) return answerColor;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${ANSWER_PLACEHOLDER_ALPHA})`;
}

// Overlay for text legibility over a background image — negative brightness
// darkens (black overlay), positive brightens (white overlay), magnitude/100
// is the overlay opacity. See docs/rsvp-form-feature-plan.md section 3.
export function buildBackgroundOverlayColor(brightness: number): string | null {
  if (brightness === 0) return null;

  const opacity = Math.min(100, Math.abs(brightness)) / 100;
  const rgbTriplet = brightness < 0 ? '0, 0, 0' : '255, 255, 255';
  return `rgba(${rgbTriplet}, ${opacity})`;
}

// Preset font stack per fontId — reuses the CSS vars already declared in
// app/globals.css (`@theme`), so no new font downloads/dependencies.
const FONT_VAR_BY_ID: Record<RsvpFormFontId, string> = {
  pretendard: 'var(--font-pretendard)',
  outfit: 'var(--font-display)',
  inter: 'var(--font-sans)',
  notoSansKr: 'var(--font-kr)',
};

// Main question label size per sizeScale preset.
const LABEL_FONT_SIZE_BY_SCALE: Record<RsvpFormSizeScale, string> = {
  sm: '1.5rem',
  md: '2rem',
  lg: '2.75rem',
};

export interface RsvpThemeCssVars extends CSSProperties {
  '--rsvp-bg-color': string;
  '--rsvp-font-color': string;
  '--rsvp-font': string;
  '--rsvp-label-size': string;
  '--rsvp-button-color': string;
  '--rsvp-button-text-color': string;
  '--rsvp-answer-color': string;
  '--rsvp-answer-placeholder-color': string;
  '--rsvp-text-align': string;
}

export function buildRsvpThemeStyle(theme: RsvpFormTheme): RsvpThemeCssVars {
  return {
    '--rsvp-bg-color': theme.backgroundColor,
    '--rsvp-font-color': theme.fontColor,
    '--rsvp-font': FONT_VAR_BY_ID[theme.fontId],
    '--rsvp-label-size': LABEL_FONT_SIZE_BY_SCALE[theme.sizeScale],
    '--rsvp-button-color': theme.buttonColor,
    '--rsvp-button-text-color': theme.buttonTextColor,
    '--rsvp-answer-color': theme.answerColor,
    '--rsvp-answer-placeholder-color': buildAnswerPlaceholderColor(theme.answerColor),
    '--rsvp-text-align': theme.alignment,
  };
}

// Centralizes the CSSProperties['textAlign'] literal-union cast in one place
// instead of repeating it at every call site that needs alignment.
export const rsvpTextAlignStyle: CSSProperties = {
  textAlign: 'var(--rsvp-text-align)' as CSSProperties['textAlign'],
};
