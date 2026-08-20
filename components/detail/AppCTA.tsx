'use client';

import { DOWNLOAD_PAGE_URL, openAppOrFallback } from '@/lib/deepLink';
import {
  type AppCtaSurface,
  type AppTrackingContext,
  toAppTrackingProperties,
  trackWebEvent,
} from '@/lib/analytics';
import { Button } from './Button';

/**
 * Every mobile-only action that needs auth (buy ticket, follow, chat, claim
 * coupon, waitlist) collapses into this single "open in app" CTA on the
 * read-only web page. When `deepLink` (a `tixx://...` URL) is given, tapping
 * the CTA tries to hand off to the installed app first, then falls back to
 * the matching app store on mobile or the download page on desktop.
 */
interface AppCTAProps {
  label: string;
  deepLink?: string;
  sourceSurface: AppCtaSurface;
  contextType?: AppTrackingContext['contextType'];
  contextId?: string | number;
  disabled?: boolean;
}

export function AppCTA({
  label,
  deepLink,
  sourceSurface,
  contextType,
  contextId,
  disabled = false,
}: AppCTAProps) {
  const handleClick = () => {
    if (disabled) return;

    const trackingContext: AppTrackingContext = {
      surface: sourceSurface,
      contextType,
      contextId,
    };
    void trackWebEvent('app_cta_click', toAppTrackingProperties(trackingContext));

    if (deepLink) {
      openAppOrFallback(deepLink, 1500, trackingContext);
    } else {
      window.location.href = DOWNLOAD_PAGE_URL;
    }
  };

  return (
    <div className="sticky bottom-0 border-t border-grayscale-800 bg-grayscale-900/95 px-4 py-4 backdrop-blur-sm lg:static lg:border-none lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
      <Button onClick={handleClick} disabled={disabled}>{label}</Button>
    </div>
  );
}
