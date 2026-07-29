'use client';

import { useEffect, useRef, useState } from 'react';
import type { RsvpForm, RsvpFormBlock, RsvpFormTheme } from '@/lib/api/types';
import { RsvpFormView } from './RsvpFormView';

declare global {
  interface Window {
    ReactNativeWebView?: { postMessage: (message: string) => void };
  }
}

// Draft blocks the host hasn't saved yet carry no `id`/`order` — those are
// assigned by the backend on create (see RsvpBlockInputBaseSchema in
// @tixx/schema, where `id` is optional). Mirrors the payload built by
// PartnerRsvpFormPreviewWebView.buildPreviewPayload in apps/mobile.
interface RsvpPreviewUpdatePayload {
  theme: RsvpFormTheme;
  blocks: Array<Omit<RsvpFormBlock, 'id' | 'order'> & { id?: number; order?: number }>;
  posterImageUrl: string | null;
  title: string | null;
  caption: string | null;
  showHostBadge: boolean;
}

type RsvpPreviewBridgeMessage = {
  type: 'RSVP_PREVIEW_THEME_UPDATE';
  payload: RsvpPreviewUpdatePayload;
};

function isRsvpPreviewBridgeMessage(data: unknown): data is RsvpPreviewBridgeMessage {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as { type?: unknown }).type === 'RSVP_PREVIEW_THEME_UPDATE'
  );
}

// Negative synthetic ids so a not-yet-saved block never collides with a real
// (positive) block id once the host saves and the page re-fetches for real.
function withStableIds(blocks: RsvpPreviewUpdatePayload['blocks']): RsvpFormBlock[] {
  return blocks.map((block, index) => ({
    ...block,
    id: block.id ?? -(index + 1),
    order: block.order ?? index,
  }));
}

// Bridges the RN app's live-editing preview (see
// apps/mobile/.../PartnerRsvpFormPreviewWebView.tsx in the tixx monorepo) into
// this page. That WebView waits for RSVP_PREVIEW_READY before injecting the
// host's in-progress (unsaved) draft as RSVP_PREVIEW_THEME_UPDATE, debounced
// on every edit — without this listener, the page only ever shows whatever
// was last saved to the DB.
export function RsvpFormPreviewBridge({ initialForm }: { initialForm: RsvpForm }) {
  const [form, setForm] = useState(initialForm);
  const readySentRef = useRef(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // The native shell delivers updates by injecting a script that does
      // `window.dispatchEvent(new MessageEvent('message', { data }))` — a
      // locally-synthesized event whose `origin` defaults to "". A genuine
      // cross-window postMessage (e.g. from an iframe or a window this page
      // was opened into) always carries a real origin string, so this
      // rejects anything that isn't the native bridge without needing to
      // know this site's own origin ahead of time.
      if (event.origin !== '') return;

      let data: unknown;
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }
      if (!isRsvpPreviewBridgeMessage(data)) return;

      const { payload } = data;
      setForm((prev) => ({
        ...prev,
        theme: payload.theme,
        posterImageUrl: payload.posterImageUrl,
        title: payload.title,
        caption: payload.caption,
        showHostBadge: payload.showHostBadge,
        blocks: withStableIds(payload.blocks),
      }));
    };

    window.addEventListener('message', handleMessage);

    if (!readySentRef.current) {
      readySentRef.current = true;
      window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'RSVP_PREVIEW_READY' }));
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return <RsvpFormView form={form} isPreview />;
}
