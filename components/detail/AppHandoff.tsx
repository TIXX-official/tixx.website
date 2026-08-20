"use client";

import { useEffect } from "react";
import {
  APP_HANDOFF_SESSION_KEY,
  buildAppDeepLink,
  type AppHandoffKind,
  type InitialBrowserEntry,
  resolveAutomaticHandoffTarget,
} from "@/lib/appHandoff";
import { trackWebEvent } from "@/lib/analytics";

declare global {
  interface Window {
    __TIXX_INITIAL_ENTRY__?: InitialBrowserEntry;
  }
}

interface AppHandoffProps {
  kind: AppHandoffKind;
  id: string | number;
  guestCode?: string;
  enabledTargets: string;
}

/**
 * Attempts an automatic app handoff only on an eligible external first load.
 * The custom scheme is isolated in a disposable iframe so a missing app cannot
 * replace the visible detail page with an unsupported-navigation screen.
 */
export function AppHandoff({
  kind,
  id,
  guestCode,
  enabledTargets,
}: AppHandoffProps) {
  useEffect(() => {
    const target = resolveAutomaticHandoffTarget({
      entry: window.__TIXX_INITIAL_ENTRY__,
      currentPathname: window.location.pathname,
      currentOrigin: window.location.origin,
      search: window.location.search,
      userAgent: window.navigator.userAgent,
      kind,
      id,
      enabledTargets,
    });

    if (!target) return;

    try {
      if (window.sessionStorage.getItem(APP_HANDOFF_SESSION_KEY)) return;
      window.sessionStorage.setItem(APP_HANDOFF_SESSION_KEY, "1");
    } catch {
      // Storage can be disabled in privacy-focused WebViews. The DOM marker
      // below still prevents a duplicate attempt while this document is alive.
    }

    if (document.querySelector("[data-tixx-app-handoff]")) return;

    const frame = document.createElement("iframe");
    frame.dataset.tixxAppHandoff = target;
    frame.setAttribute("aria-hidden", "true");
    frame.tabIndex = -1;
    frame.style.display = "none";
    frame.src = buildAppDeepLink(kind, id, guestCode);
    document.body.appendChild(frame);

    void trackWebEvent("automatic_app_handoff_attempt", {
      target,
      context_type: kind,
      context_id: String(id),
    });

    window.dispatchEvent(
      new CustomEvent("tixx:app-handoff-attempt", {
        detail: { target, kind, id: String(id) },
      }),
    );

    window.setTimeout(() => frame.remove(), 1500);
  }, [enabledTargets, guestCode, id, kind]);

  return null;
}
