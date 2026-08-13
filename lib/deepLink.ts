import { ANDROID_PACKAGE } from './appHandoff';

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
 * Rewrites a deep link as an Android `intent://` URL naming the app's package.
 * The OS launches the app directly and, when it isn't installed, navigates to
 * `browser_fallback_url` instead — so no timer has to guess at the outcome and
 * no "can't open this address" dialog appears.
 */
function buildAndroidIntentUrl(deepLinkUrl: string, fallbackUrl: string): string {
  const scheme = new URL(deepLinkUrl).protocol.replace(':', '');
  const rest = deepLinkUrl.slice(scheme.length + 3); // strip "<scheme>://"
  return (
    `intent://${rest}#Intent;scheme=${scheme};package=${ANDROID_PACKAGE};` +
    `S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end`
  );
}

/**
 * Hands off to the native app from an explicit CTA tap. `deepLinkUrl` is either
 * the app's custom scheme (`tixx://event/:id`, `tixx://host/:id` — parsed by
 * apps/mobile's useUniversalLink hook alongside Universal Links) or an https
 * URL that already resolves on its own, such as an AppsFlyer OneLink.
 *
 * Unlike the automatic handoff in `appHandoff.ts`, which leaves visitors on the
 * web page when the app is missing, this falls through to the app store: the
 * tap itself is the signal that they wanted the app.
 */
export function openAppOrFallback(deepLinkUrl: string, timeoutMs = 1500) {
  // https targets (OneLinks, Universal Links) redirect by themselves and work
  // on desktop too, so they must not be raced against a store fallback.
  if (/^https?:/i.test(deepLinkUrl)) {
    window.location.href = deepLinkUrl;
    return;
  }

  const platform = detectPlatform();
  if (platform === 'other') {
    window.location.href = DOWNLOAD_PAGE_URL;
    return;
  }

  if (platform === 'android') {
    window.location.href = buildAndroidIntentUrl(deepLinkUrl, PLAY_STORE_URL);
    return;
  }

  // iOS has no intent:// equivalent, so fire the scheme and infer from whether
  // the page got backgrounded whether the app took over.
  let didHide = false;
  const onVisibilityChange = () => {
    if (document.hidden) didHide = true;
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  window.location.href = deepLinkUrl;

  setTimeout(() => {
    document.removeEventListener('visibilitychange', onVisibilityChange);
    if (!didHide) {
      window.location.href = APP_STORE_URL;
    }
  }, timeoutMs);
}
