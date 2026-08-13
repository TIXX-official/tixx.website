export const ANDROID_PACKAGE = 'com.tixx.mobile';

/**
 * In-app browser (WebView) user agents. These are the only environments where
 * the automatic handoff runs: they swallow the link into their own WebView, so
 * the OS never gets a chance to fire the Universal Link / App Link that would
 * normally open the app before any web page renders. In Safari/Chrome the OS
 * already tried and failed (i.e. the app isn't installed), so re-attempting
 * there would be pointless noise.
 */
export const IN_APP_BROWSER_UA_PATTERN =
  /KAKAOTALK|Instagram|FBAN|FBAV|FB_IAB|FBIOS|Line\/|NAVER\(inapp|DaumApps|everytimeApp|BAND\/|Snapchat|TwitterAndroid/i;

/**
 * Paths the handoff applies to. Note the plural/singular split: the web routes
 * are `/events/:id` and `/hosts/:id`, while the custom scheme the app parses is
 * `tixx://event/:id`. That asymmetry is an existing contract in apps/mobile's
 * `useUniversalLink` hook, not a typo.
 */
export const HANDOFF_PATH_PATTERN = /^\/(events|hosts)\/(\d+)\/?$/;

/** Once per browsing session, regardless of how many detail pages are opened. */
const SESSION_KEY = 'tixx:app-handoff-attempted';

/** Suppresses the handoff after Android's `browser_fallback_url` brings us back. */
export const NO_APP_PARAM = 'noapp';

/**
 * Source for the inline, render-blocking script that hands a visitor off to the
 * native app before the web page paints. It reads the target off
 * `location.pathname`, so it can sit at the very top of the document body and
 * still no-op on every page that isn't an event or host detail page.
 *
 * Per platform:
 * - Android: an `intent://` URL naming the package. The OS launches the app
 *   directly, and `browser_fallback_url` puts us back on this page when the
 *   app isn't installed — no timers, no error dialog.
 * - iOS + KakaoTalk: `kakaotalk://web/openExternal` hands the https URL to the
 *   system, which fires the Universal Link normally. Without the app the URL
 *   just opens in the default browser, where this script no-ops.
 * - iOS elsewhere (Instagram, Facebook, …): the `tixx://` scheme plus a timer,
 *   since WKWebView has no documented escape hatch. If the app is missing the
 *   WebView may show a system alert before we restore the page — unavoidable.
 *
 * Runs at most once per session; on failure it removes the overlay class and
 * the visitor reads the web page as before.
 */
export function buildHandoffScript(): string {
  const pathPattern = String(HANDOFF_PATH_PATTERN);
  const uaPattern = String(IN_APP_BROWSER_UA_PATTERN);
  const pkg = JSON.stringify(ANDROID_PACKAGE);
  const sessionKey = JSON.stringify(SESSION_KEY);
  const noAppParam = JSON.stringify(NO_APP_PARAM);

  // Minified by hand rather than by the bundler: this ships inline in the HTML
  // and must stay small enough not to delay the first paint it protects.
  return `(function(){var r=document.documentElement;function c(){r.classList.remove("app-handoff")}try{
var l=location,u=navigator.userAgent||"",m=${pathPattern}.exec(l.pathname);
if(!m)return;
if(new URLSearchParams(l.search).has(${noAppParam}))return;
if(!${uaPattern}.test(u))return;
var i=/iPhone|iPad|iPod/i.test(u),a=/Android/i.test(u);
if(!i&&!a)return;
try{if(sessionStorage.getItem(${sessionKey}))return;sessionStorage.setItem(${sessionKey},"1")}catch(e){}
if(!/^ko/i.test(navigator.language||""))r.classList.add("app-handoff-en");
r.classList.add("app-handoff");
if(a){var f=l.origin+l.pathname+(l.search?l.search+"&":"?")+${noAppParam}+"=1";
setTimeout(c,2500);
l.href="intent://"+l.host+l.pathname+"#Intent;scheme=https;package="+${pkg}+";S.browser_fallback_url="+encodeURIComponent(f)+";end";
return}
if(/KAKAOTALK/i.test(u)){setTimeout(c,2500);
l.href="kakaotalk://web/openExternal?url="+encodeURIComponent(l.origin+l.pathname+l.search);
return}
var g=false,h=function(){if(document.hidden)g=true};
document.addEventListener("visibilitychange",h);
addEventListener("pagehide",function(){g=true});
addEventListener("pageshow",function(e){if(e.persisted)c()});
l.href="tixx://"+m[1].slice(0,-1)+"/"+m[2];
setTimeout(function(){document.removeEventListener("visibilitychange",h);if(!g)c()},1200)
}catch(e){c()}})();`;
}
