import type { Place } from '@/lib/api/types';

// Static/read-only equivalent of apps/mobile's native map-app deep link
// picker — links out to Kakao Map (Korean audience) with a Google Maps
// fallback query embedded via the address text.
export function buildMapUrl(place: Place): string {
  const query = encodeURIComponent(`${place.name} ${place.address}`);
  return `https://map.kakao.com/link/search/${query}`;
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
