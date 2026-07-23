import Image from 'next/image';
import type { ReactNode } from 'react';
import { buildBackgroundOverlayColor, buildRsvpThemeStyle } from '@/lib/format/rsvpTheme';
import type { RsvpFormTheme } from '@/lib/api/types';

interface RsvpFormShellProps {
  theme: RsvpFormTheme;
  children: ReactNode;
}

// Applies the host's chosen theme as CSS custom properties (--rsvp-*) so
// step/block components below can read them without prop drilling.
// backgroundColor is always the base/fallback (also covers a 404'd
// backgroundImage); a background image, if set, renders full-bleed with a
// brightness-driven overlay for legibility (see rsvpTheme.ts).
export function RsvpFormShell({ theme, children }: RsvpFormShellProps) {
  const style = buildRsvpThemeStyle(theme);
  const overlayColor = theme.backgroundImage
    ? buildBackgroundOverlayColor(theme.brightness)
    : null;

  return (
    <div
      className="relative min-h-screen"
      style={{
        ...style,
        fontFamily: 'var(--rsvp-font)',
        color: 'var(--rsvp-font-color)',
        backgroundColor: 'var(--rsvp-bg-color)',
      }}
    >
      {theme.backgroundImage && (
        <>
          <Image
            src={theme.backgroundImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {overlayColor && (
            <div className="absolute inset-0" style={{ backgroundColor: overlayColor }} />
          )}
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
