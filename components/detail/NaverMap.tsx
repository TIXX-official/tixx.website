'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import type { Place } from '@/lib/api/types';
import { buildMapEmbedUrl } from '@/lib/format/map';

// Minimal shape of the Naver Maps JS SDK v3 namespace this component uses —
// no official @types package exists for it.
interface NaverMapsNamespace {
  LatLng: new (lat: number, lng: number) => unknown;
  Map: new (el: HTMLElement, options: { center: unknown; zoom: number }) => unknown;
  Marker: new (options: { position: unknown; map: unknown }) => unknown;
}

declare global {
  interface Window {
    naver?: { maps: NaverMapsNamespace };
  }
}

const NAVER_MAP_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

export function NaverMap({ place, className }: { place: Place; className?: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  // Lazy initializer (rather than an effect + setState) covers client-side
  // route navigation where window.naver is already loaded from a prior page
  // and next/script's onLoad won't refire.
  const [sdkReady, setSdkReady] = useState(
    () => typeof window !== 'undefined' && Boolean(window.naver?.maps)
  );

  useEffect(() => {
    if (!sdkReady || !mapRef.current || !window.naver?.maps) return;
    const center = new window.naver.maps.LatLng(Number(place.latitude), Number(place.longitude));
    const map = new window.naver.maps.Map(mapRef.current, { center, zoom: 16 });
    new window.naver.maps.Marker({ position: center, map });
  }, [sdkReady, place]);

  if (!NAVER_MAP_CLIENT_ID) {
    // Graceful degradation for local dev / unset env var: keyless OSM embed.
    return (
      <iframe
        src={buildMapEmbedUrl(place)}
        title={place.name}
        className={`${className ?? ''} border-0 pointer-events-none`}
        loading="lazy"
      />
    );
  }

  return (
    <>
      {/* VERIFY BEFORE SHIPPING: confirm ncpClientId vs ncpKeyId against
          current Naver Cloud Platform docs — this query param name has
          changed across NCP Maps API plan tiers/SDK versions. */}
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_MAP_CLIENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
      />
      <div ref={mapRef} className={className} />
    </>
  );
}
