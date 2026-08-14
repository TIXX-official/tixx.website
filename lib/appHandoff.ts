export type AppHandoffKind = 'event' | 'host';

export type AppHandoffTarget =
  | 'kakao-ios'
  | 'kakao-android'
  | 'instagram-ios'
  | 'instagram-android';

export interface InitialBrowserEntry {
  pathname: string;
  referrer: string;
  navigationType: string;
}

interface ResolveAutomaticHandoffOptions {
  entry: InitialBrowserEntry | undefined;
  currentPathname: string;
  currentOrigin: string;
  search: string;
  userAgent: string;
  kind: AppHandoffKind;
  id: string | number;
  enabledTargets: string;
}

export const APP_HANDOFF_SESSION_KEY = 'tixx:auto-app-handoff-attempted';

export const INITIAL_ENTRY_SCRIPT = `(function(){try{var n=performance.getEntriesByType("navigation")[0];window.__TIXX_INITIAL_ENTRY__={pathname:location.pathname,referrer:document.referrer||"",navigationType:n&&n.type?n.type:"navigate"}}catch(e){window.__TIXX_INITIAL_ENTRY__={pathname:location.pathname,referrer:document.referrer||"",navigationType:"navigate"}}})();`;

function detectTarget(userAgent: string): AppHandoffTarget | null {
  const isIos = /iPhone|iPad|iPod|Macintosh.*Mobile/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);

  if (!isIos && !isAndroid) return null;

  if (/KAKAOTALK/i.test(userAgent)) {
    return isIos ? 'kakao-ios' : 'kakao-android';
  }

  if (/Instagram/i.test(userAgent)) {
    return isIos ? 'instagram-ios' : 'instagram-android';
  }

  return null;
}

function isSameOriginReferrer(referrer: string, currentOrigin: string): boolean {
  if (!referrer) return false;

  try {
    return new URL(referrer).origin === currentOrigin;
  } catch {
    return false;
  }
}

function isTargetPath(
  pathname: string,
  kind: AppHandoffKind,
  id: string | number,
): boolean {
  const plural = `${kind}s`;
  const escapedId = String(id).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^/(?:open/)?${plural}/${escapedId}/?$`).test(pathname);
}

export function resolveAutomaticHandoffTarget({
  entry,
  currentPathname,
  currentOrigin,
  search,
  userAgent,
  kind,
  id,
  enabledTargets,
}: ResolveAutomaticHandoffOptions): AppHandoffTarget | null {
  if (!entry || entry.navigationType !== 'navigate') return null;
  if (entry.pathname !== currentPathname) return null;
  if (!isTargetPath(currentPathname, kind, id)) return null;
  if (isSameOriginReferrer(entry.referrer, currentOrigin)) return null;

  const params = new URLSearchParams(search);
  if (params.has('noapp') || params.has('web')) return null;

  const target = detectTarget(userAgent);
  if (!target) return null;

  const enabled = new Set(
    enabledTargets
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );

  return enabled.has(target) ? target : null;
}

export function buildAppDeepLink(
  kind: AppHandoffKind,
  id: string | number,
): string {
  return `tixx://${kind}/${encodeURIComponent(String(id))}`;
}
