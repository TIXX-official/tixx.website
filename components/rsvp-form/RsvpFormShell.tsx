'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { buildBackgroundOverlayColor, buildRsvpThemeStyle } from '@/lib/format/rsvpTheme';
import type { RsvpFormTheme } from '@/lib/api/types';

interface RsvpFormShellProps {
  theme: RsvpFormTheme;
  children: ReactNode;
  // Whether every image this page needs (background + poster, see
  // RsvpFormView) has finished loading. Until then the background/overlay
  // stay invisible and content stays off-screen, so nothing pops in
  // piecemeal — the finished page fades/slides in as one unit once ready.
  ready: boolean;
  onBackgroundImageResolved?: () => void;
}

const REVEAL_TRANSITION = { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const };

// Applies the host's chosen theme as CSS custom properties (--rsvp-*) so
// step/block components below can read them without prop drilling.
// backgroundColor is always the base/fallback (also covers a 404'd
// backgroundImage); a background image, if set, renders full-bleed with a
// brightness-driven overlay for legibility (see rsvpTheme.ts).
export function RsvpFormShell({
  theme,
  children,
  ready,
  onBackgroundImageResolved,
}: RsvpFormShellProps) {
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
            className="object-cover transition-opacity duration-700 ease-out"
            style={{ opacity: ready ? 1 : 0 }}
            onLoad={onBackgroundImageResolved}
            onError={onBackgroundImageResolved}
          />
          {overlayColor && (
            <div
              className="absolute inset-0 transition-opacity duration-700 ease-out"
              style={{ backgroundColor: overlayColor, opacity: ready ? 1 : 0 }}
            />
          )}
        </>
      )}

      <AnimatePresence>
        {!ready && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-current/40" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative z-10"
        initial={false}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={REVEAL_TRANSITION}
      >
        {children}
      </motion.div>
    </div>
  );
}
