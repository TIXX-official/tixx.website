'use client';

import { DOWNLOAD_PAGE_URL, openAppOrFallback } from '@/lib/deepLink';
import { Button } from './Button';

/**
 * Every mobile-only action that needs auth (buy ticket, follow, chat, claim
 * coupon, waitlist) collapses into this single "open in app" CTA on the
 * read-only web page. When `deepLink` (a `tixx://...` URL) is given, tapping
 * the CTA tries to hand off to the installed app first, then falls back to
 * the matching app store on mobile or the download page on desktop.
 */
export function AppCTA({ label, deepLink }: { label: string; deepLink?: string }) {
  const handleClick = () => {
    if (deepLink) {
      openAppOrFallback(deepLink);
    } else {
      window.location.href = DOWNLOAD_PAGE_URL;
    }
  };

  return (
    <div className="sticky bottom-0 border-t border-grayscale-800 bg-grayscale-900/95 px-4 py-4 backdrop-blur-sm lg:static lg:border-none lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
      <Button onClick={handleClick}>{label}</Button>
    </div>
  );
}
