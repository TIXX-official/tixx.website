import Image from 'next/image';
import Link from 'next/link';
import type { HostSummary } from '@/lib/api/types';
import { Text } from './Text';

export function HostInlineCard({
  host,
  categoryLabel,
  followLabel,
}: {
  host: HostSummary;
  categoryLabel: string;
  followLabel: string;
}) {
  return (
    <div className="flex flex-row items-center justify-between rounded-xl border border-grayscale-700 px-3 py-3">
      <Link href={`/hosts/${host.id}`} className="mr-3 flex min-w-0 flex-1 flex-row items-center">
        <div className="relative mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-grayscale-700">
          {host.imageUrl && (
            <Image src={host.imageUrl} alt={host.name} fill sizes="40px" className="object-cover" />
          )}
        </div>
        <div className="min-w-0">
          <Text variant="body1Regular" className="truncate text-grayscale-0">
            {host.name}
          </Text>
          <Text variant="caption1Regular" className="mt-0.5 text-grayscale-400">
            {categoryLabel}
          </Text>
        </div>
      </Link>
      <Link
        href="/download"
        className="flex-shrink-0 rounded-lg bg-grayscale-100 px-3 py-[5px]"
      >
        <Text as="span" variant="body3Medium" className="text-grayscale-900">
          {followLabel}
        </Text>
      </Link>
    </div>
  );
}
