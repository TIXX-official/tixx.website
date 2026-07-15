import type { Place } from '@/lib/api/types';

// Static/read-only equivalent of apps/mobile's native map-app deep link
// picker — links out to Naver Map for provider consistency with the
// embedded interactive map (see components/detail/NaverMap.tsx). Keyless,
// same zero-cost property as the previous Kakao Map link.
// VERIFY BEFORE SHIPPING: Naver's public map-search URL scheme has shifted
// across versions (e.g. /v5/search/, /p/search/) — confirm the current one.
export function buildMapUrl(place: Place): string {
  const query = encodeURIComponent(`${place.name} ${place.address}`);
  return `https://map.naver.com/p/search/${query}`;
}

export function buildMapEmbedUrl(place: Place): string {
  // Keyless OSM embed (officially supported, no API key) — Kakao/Google
  // static map images both require a billed API key, which this read-only
  // page shouldn't depend on.
  const lat = Number(place.latitude);
  const lon = Number(place.longitude);
  const delta = 0.01;
  const bbox = [lon - delta, lat - delta, lon + delta, lat + delta].join(',');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&marker=${lat},${lon}&layer=mapnik`;
}
