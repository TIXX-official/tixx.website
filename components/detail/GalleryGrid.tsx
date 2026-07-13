'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { EventGalleryItem } from '@/lib/api/types';
import { Lightbox } from './Lightbox';
import { Text } from './Text';

const MAX_VISIBLE = 6;

export function GalleryGrid({
  items,
  videoLabel,
}: {
  items: EventGalleryItem[];
  videoLabel: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const visible = items.slice(0, MAX_VISIBLE);

  if (items.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        {visible.map((item, index) => {
          const isVideo = item.mimeType.startsWith('video/');
          const previewUrl = isVideo ? item.thumbnailUrl : item.mediaUrl;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpenIndex(index)}
              className="relative aspect-square overflow-hidden rounded-md bg-grayscale-800"
            >
              {previewUrl ? (
                <Image src={previewUrl} alt="" fill sizes="200px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center border border-grayscale-700">
                  <Text variant="caption1Regular" className="text-grayscale-400">
                    {videoLabel}
                  </Text>
                </div>
              )}
              {isVideo && previewUrl && (
                <div className="absolute bottom-1 right-1 rounded-full bg-black/60 px-1.5 py-0.5">
                  <Text as="span" variant="caption1Regular" className="text-white">
                    {videoLabel}
                  </Text>
                </div>
              )}
            </button>
          );
        })}
      </div>
      {openIndex !== null && (
        <Lightbox
          images={visible.map((item) => ({ url: item.mediaUrl }))}
          initialIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
