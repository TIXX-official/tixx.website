import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { EventListItemDto } from '@/lib/api/types';
import { formatInTimeZoneSafe } from '@/lib/format/dateOnly';
import { Text } from './Text';

export function EventListItem({ event }: { event: EventListItemDto }) {
  const category = event.eventHashtags?.[0]?.tag ?? event.category;

  return (
    <Link href={`/events/${event.id}`} className="flex flex-row items-center gap-3">
      <div className="relative h-[120px] w-[90px] flex-shrink-0 overflow-hidden rounded-lg bg-grayscale-800">
        <Image src={event.imageUrl} alt={event.name} fill sizes="90px" className="object-cover" />
        <div className="absolute bottom-1.5 left-1.5 rounded-full bg-black/55 px-2 py-0.5 backdrop-blur-sm">
          <Text as="span" variant="caption1Regular" className="text-white">
            {category}
          </Text>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Text
          variant="body1Medium"
          className="text-grayscale-0 overflow-hidden"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
        >
          {event.name}
        </Text>
        <Text as="span" variant="body3Medium" className="text-point-500">
          {formatInTimeZoneSafe(event.startDate, event.startTime)}
        </Text>
        <Text as="span" variant="caption1Regular" className="text-grayscale-400">
          {event.host?.name}
        </Text>
      </div>
      <Heart size={20} className="flex-shrink-0 text-grayscale-500" />
    </Link>
  );
}
