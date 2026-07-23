import type { CSSProperties } from 'react';
import type { RsvpFormFontId, RsvpFormSizeScale, RsvpFormTheme } from '@/lib/api/types';

// Contrast-ratio math ported from apps/mobile/src/utils/storyShareColor.ts.
// Only `pickReadableTextColor` is ported (not the palette-candidate selection
// in `selectStoryBackgroundColor`) — RsvpFormTheme already stores a single
// resolved color chosen on mobile at poster-upload time, so there's no
// candidate list to pick from here. See docs/rsvp-form-feature-plan.md
// section 3: the mobile app does the (native, image-sampling) dominant-color
// extraction once; this site only needs the pure hex-arithmetic part so a
// host's later background override still gets a correctly contrasted text
// color at render time.

const BLACK = '#000000';
const WHITE = '#FFFFFF';

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

function toRgb(hex: string) {
  const normalized = normalizeHexColor(hex);
  if (!normalized) return null;

  const raw = normalized.slice(1);
  return {
    r: parseInt(raw.slice(0, 2), 16),
    g: parseInt(raw.slice(2, 4), 16),
    b: parseInt(raw.slice(4, 6), 16),
  };
}

function channelToLinearRgb(value: number) {
  const normalized = value / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string) {
  const rgb = toRgb(hex);
  if (!rgb) return 0;

  return (
    0.2126 * channelToLinearRgb(rgb.r) +
    0.7152 * channelToLinearRgb(rgb.g) +
    0.0722 * channelToLinearRgb(rgb.b)
  );
}

function contrastRatio(first: string, second: string) {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  const [bright, dark] =
    firstLuminance > secondLuminance
      ? [firstLuminance, secondLuminance]
      : [secondLuminance, firstLuminance];

  return (bright + 0.05) / (dark + 0.05);
}

export function pickReadableTextColor(background: string): string {
  return contrastRatio(background, WHITE) >= contrastRatio(background, BLACK)
    ? WHITE
    : BLACK;
}

// Preset font stack per fontId — reuses the CSS vars already declared in
// app/globals.css (`@theme`), so no new font downloads/dependencies.
const FONT_VAR_BY_ID: Record<RsvpFormFontId, string> = {
  pretendard: 'var(--font-pretendard)',
  outfit: 'var(--font-display)',
  inter: 'var(--font-sans)',
  notoSansKr: 'var(--font-kr)',
};

// Main question label size per sizeScale preset. Body/help text in block
// components should size off `--rsvp-label-size` (e.g. with `em`/clamp)
// rather than hardcoding their own scale.
const LABEL_FONT_SIZE_BY_SCALE: Record<RsvpFormSizeScale, string> = {
  sm: '1.5rem',
  md: '2rem',
  lg: '2.75rem',
};

export interface RsvpThemeCssVars extends CSSProperties {
  '--rsvp-bg-color'?: string;
  '--rsvp-accent': string;
  '--rsvp-text': string;
  '--rsvp-font': string;
  '--rsvp-label-size': string;
}

export function buildRsvpThemeStyle(theme: RsvpFormTheme): RsvpThemeCssVars {
  const textColor =
    theme.backgroundType === 'color'
      ? pickReadableTextColor(theme.backgroundValue)
      : WHITE; // image backgrounds get a dark scrim (see RsvpFormShell), so white text is always legible

  return {
    ...(theme.backgroundType === 'color'
      ? { '--rsvp-bg-color': theme.backgroundValue }
      : {}),
    '--rsvp-accent': theme.accentColor,
    '--rsvp-text': textColor,
    '--rsvp-font': FONT_VAR_BY_ID[theme.fontId],
    '--rsvp-label-size': LABEL_FONT_SIZE_BY_SCALE[theme.sizeScale],
  };
}
