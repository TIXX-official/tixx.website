import {
  type AppTrackingContext,
  toAppTrackingProperties,
  trackBeforeNavigation,
  trackWebEvent,
} from '@/lib/analytics';

export const APP_STORE_URL = 'https://apps.apple.com/us/app/tixx/id6737306169';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.tixx.mobile';
export const DOWNLOAD_PAGE_URL = '/download';

function detectPlatform(): 'ios' | 'android' | 'other' {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'other';
}

/**
 * Tries to hand off to the native app via its custom URL scheme
 * (`tixx://event/:id`, `tixx://host/:id` — parsed by apps/mobile's
 * useUniversalLink hook alongside Universal Links). Unlike a Universal
 * Link, this also works when the page is loaded inside an in-app browser
 * (KakaoTalk, Instagram, etc.), since those WebViews generally forward
 * unrecognized custom schemes to the OS even though they never trigger
 * Universal Link interception. If the app doesn't take over the page
 * within `timeoutMs` (i.e. it isn't installed), falls back to the
 * matching app store on mobile, or the marketing download page on
 * desktop.
 */
export function openAppOrFallback(
  deepLinkUrl: string,
  timeoutMs = 1500,
  trackingContext?: AppTrackingContext,
) {
  const platform = detectPlatform();
  if (platform === 'other') {
    window.location.href = DOWNLOAD_PAGE_URL;
    return;
  }

  const fallbackUrl = platform === 'ios' ? APP_STORE_URL : PLAY_STORE_URL;
  const trackingProperties = trackingContext
    ? toAppTrackingProperties(trackingContext)
    : {};

  let didHide = false;
  const onVisibilityChange = () => {
    if (document.hidden && !didHide) {
      didHide = true;
      void trackWebEvent('app_open_suspected', {
        ...trackingProperties,
        device_os: platform,
      });
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  void trackWebEvent('app_open_attempt', {
    ...trackingProperties,
    device_os: platform,
  });
  window.location.href = deepLinkUrl;

  setTimeout(() => {
    document.removeEventListener('visibilitychange', onVisibilityChange);
    if (!didHide) {
      void trackBeforeNavigation('app_store_redirect', {
        ...trackingProperties,
        store: platform === 'ios' ? 'app_store' : 'play_store',
        device_os: platform,
      }).finally(() => {
        window.location.href = fallbackUrl;
      });
    }
  }, timeoutMs);
}
