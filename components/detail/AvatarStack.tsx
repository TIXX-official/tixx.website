import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Participant } from '@/lib/api/types';

const MAX_VISIBLE = 8;

export function AvatarStack({
  participants,
  participantCount,
  blurred,
}: {
  participants: Participant[];
  participantCount: number;
  blurred: boolean;
}) {
  if (participantCount === 0) return null;

  const visible = participants.slice(0, MAX_VISIBLE);
  const hasHiddenParticipants = participantCount > participants.length;
  const hasOverflow = participantCount > visible.length;

  return (
    <div className="flex flex-row items-center">
      {visible.map((p, index) => (
        <div
          key={p.userId}
          className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-grayscale-900 bg-grayscale-700"
          style={{ marginLeft: index === 0 ? 0 : -10 }}
        >
          {p.profileImageUrl && (
            <Image
              src={p.profileImageUrl}
              alt={p.nickname}
              fill
              sizes="40px"
              className={cn('object-cover', blurred && 'blur-sm')}
            />
          )}
        </div>
      ))}
      {hasHiddenParticipants && (
        <div
          className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-grayscale-900 bg-grayscale-700 text-grayscale-300"
          style={{ marginLeft: -10 }}
        >
          ?
        </div>
      )}
      {hasOverflow && (
        <div
          className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-grayscale-900 bg-grayscale-800 text-grayscale-400 text-xs"
          style={{ marginLeft: -8 }}
        >
          •••
        </div>
      )}
    </div>
  );
}
