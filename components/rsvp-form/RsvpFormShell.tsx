import Image from 'next/image';
import type { ReactNode } from 'react';
import { buildRsvpThemeStyle } from '@/lib/format/rsvpTheme';
import type { RsvpFormTheme } from '@/lib/api/types';

interface RsvpFormShellProps {
  theme: RsvpFormTheme;
  children: ReactNode;
}

// Applies the host's chosen background/font/size/accent theme as CSS custom
// properties (--rsvp-*) so step/block components below can read them without
// prop drilling. Image backgrounds get a dark scrim so text stays legible
// regardless of the poster's own colors (see rsvpTheme.ts).
export function RsvpFormShell({ theme, children }: RsvpFormShellProps) {
  const style = buildRsvpThemeStyle(theme);

  return (
    <div
      className="relative min-h-screen"
      style={{
        ...style,
        fontFamily: 'var(--rsvp-font)',
        color: 'var(--rsvp-text)',
        backgroundColor:
          theme.backgroundType === 'color' ? 'var(--rsvp-bg-color)' : '#000000',
      }}
    >
      {theme.backgroundType === 'image' && (
        <>
          <Image
            src={theme.backgroundValue}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
