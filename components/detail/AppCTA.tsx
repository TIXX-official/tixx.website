import { Button } from './Button';

const APP_DOWNLOAD_URL = '/download';

/**
 * Every mobile-only action that needs auth (buy ticket, follow, chat, claim
 * coupon, waitlist) collapses into this single "open in app" CTA on the
 * read-only web page.
 */
export function AppCTA({ label }: { label: string }) {
  return (
    <div className="sticky bottom-0 border-t border-grayscale-800 bg-grayscale-900/95 px-4 py-4 backdrop-blur-sm lg:static lg:border-none lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
      <Button href={APP_DOWNLOAD_URL}>{label}</Button>
    </div>
  );
}
