import { MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Place, VenueSummary } from '@/lib/api/types';
import { buildMapEmbedUrl, buildMapUrl } from '@/lib/format/map';
import { Text } from './Text';

export function LocationSection({
  place,
  venue,
  title,
  viewOnMapLabel,
}: {
  place: Place;
  venue: VenueSummary | null;
  title: string;
  viewOnMapLabel: string;
}) {
  return (
    <div>
      <Text variant="headline2Medium" className="mb-3">
        {title}
      </Text>
      <div className="flex flex-row items-center gap-1">
        <MapPin size={16} className="flex-shrink-0 text-grayscale-300" />
        <Text variant="body3Regular" className="text-grayscale-300">
          {place.name} · {place.address}
        </Text>
      </div>
      {venue && (
        <Link href={`/hosts/${venue.host.id}`} className="mt-4 flex flex-col items-center gap-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-grayscale-700">
            {venue.host.imageUrl && (
              <Image src={venue.host.imageUrl} alt={venue.name} fill sizes="36px" className="object-cover" />
            )}
          </div>
          <Text variant="caption1Regular" className="text-grayscale-300">
            {venue.name}
          </Text>
        </Link>
      )}
      <div className="relative mt-4 h-[160px] w-full overflow-hidden rounded-xl bg-grayscale-800">
        <iframe
          src={buildMapEmbedUrl(place)}
          title={place.name}
          className="h-full w-full border-0 pointer-events-none"
          loading="lazy"
        />
        <a
          href={buildMapUrl(place)}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 rounded-full bg-black/60 px-3 py-1"
        >
          <Text as="span" variant="caption1Regular" className="text-white">
            {viewOnMapLabel}
          </Text>
        </a>
      </div>
    </div>
  );
}
