'use client';

import { init, track } from '@amplitude/analytics-browser';

export type AnalyticsPrimitive = string | number | boolean;
export type AnalyticsProperties = Record<string, AnalyticsPrimitive | null | undefined>;

export type AppCtaSurface =
  | 'custom_rsvp_complete'
  | 'event_rsvp_complete'
  | 'event_rsvp_fallback'
  | 'event_detail'
  | 'host_detail'
  | 'download_page'
  | 'navbar'
  | 'host_inline_card';

export interface AppTrackingContext {
  surface: AppCtaSurface;
  contextType?: 'rsvp_form' | 'event' | 'host';
  contextId?: string | number;
}

const SENSITIVE_PROPERTY_PATTERN =
  /(^|_)(answers?|auth_code|email|guest_code|name|phone|query|referrer|token|url)($|_)/i;
const MAX_PROPERTY_LENGTH = 200;

let initialized = false;
let initializationPromise: Promise<void> | null = null;

export function sanitizeAnalyticsProperties(
  properties: AnalyticsProperties,
): Record<string, AnalyticsPrimitive> {
  return Object.entries(properties).reduce<Record<string, AnalyticsPrimitive>>(
    (safe, [key, value]) => {
      if (value === null || value === undefined || SENSITIVE_PROPERTY_PATTERN.test(key)) {
        return safe;
      }

      safe[key] =
        typeof value === 'string' ? value.slice(0, MAX_PROPERTY_LENGTH) : value;
      return safe;
    },
    {},
  );
}

export function classifyWebPath(pathname: string): {
  pageType: string;
  pathTemplate: string;
} {
  if (/^\/forms\/[^/]+\/preview\/?$/.test(pathname)) {
    return { pageType: 'rsvp_form_preview', pathTemplate: '/forms/:id/preview' };
  }
  if (/^\/forms\/[^/]+\/?$/.test(pathname)) {
    return { pageType: 'rsvp_form', pathTemplate: '/forms/:id' };
  }
  if (/^\/events\/[^/]+\/rsvp\/?$/.test(pathname)) {
    return { pageType: 'event_rsvp', pathTemplate: '/events/:id/rsvp' };
  }
  if (/^\/(?:open\/)?events\/[^/]+\/?$/.test(pathname)) {
    return { pageType: 'event_detail', pathTemplate: '/events/:id' };
  }
  if (/^\/(?:open\/)?hosts\/[^/]+\/?$/.test(pathname)) {
    return { pageType: 'host_detail', pathTemplate: '/hosts/:id' };
  }
  if (pathname === '/download' || pathname === '/download/') {
    return { pageType: 'download', pathTemplate: '/download' };
  }

  return {
    pageType: 'marketing',
    pathTemplate: pathname || '/',
  };
}

function initializeWebAnalytics(): Promise<void> {
  if (initialized) return Promise.resolve();
  if (initializationPromise) return initializationPromise;
  if (typeof window === 'undefined') return Promise.resolve();

  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY?.trim();
  if (!apiKey) return Promise.resolve();

  initializationPromise = init(apiKey, {
    autocapture: false,
    transport: 'beacon',
    trackingOptions: {
      ipAddress: false,
    },
  }).promise
    .then(() => {
      initialized = true;
    })
    .catch(() => {
      initializationPromise = null;
    });

  return initializationPromise;
}

export async function trackWebEvent(
  eventName: string,
  properties: AnalyticsProperties = {},
): Promise<void> {
  try {
    await initializeWebAnalytics();
    if (!initialized) return;

    await track(eventName, {
      platform: 'web',
      ...sanitizeAnalyticsProperties(properties),
    }).promise.then(() => undefined);
  } catch {
    // Analytics must never block RSVP submission or navigation.
  }
}

export async function trackBeforeNavigation(
  eventName: string,
  properties: AnalyticsProperties,
  timeoutMs = 250,
): Promise<void> {
  await Promise.race([
    trackWebEvent(eventName, properties).catch(() => undefined),
    new Promise<void>((resolve) => window.setTimeout(resolve, timeoutMs)),
  ]);
}

export function toAppTrackingProperties(
  context: AppTrackingContext,
): AnalyticsProperties {
  return {
    surface: context.surface,
    context_type: context.contextType,
    context_id: context.contextId === undefined ? undefined : String(context.contextId),
  };
}
