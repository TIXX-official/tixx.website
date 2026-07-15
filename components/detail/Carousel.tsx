'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export function Carousel({
  images,
  aspectClassName = 'aspect-video',
  onImageClick,
}: {
  images: { url: string; alt?: string }[];
  aspectClassName?: string;
  onImageClick?: (index: number) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) return null;

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    setActiveIndex(index);
  };

  return (
    <div className="relative w-full">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className={cn(
          'flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth bg-grayscale-800',
          aspectClassName
        )}
        style={{ scrollbarWidth: 'none' }}
      >
        {images.map((image, index) => (
          <button
            key={image.url + index}
            type="button"
            onClick={() => onImageClick?.(index)}
            className="relative h-full w-full flex-shrink-0 snap-center"
          >
            <Image
              src={image.url}
              alt={image.alt ?? ''}
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>
      {images.length > 1 && (
        <div className="mt-2 flex justify-center gap-1">
          {images.map((image, index) => (
            <span
              key={image.url + index}
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                index === activeIndex ? 'bg-grayscale-0' : 'bg-grayscale-0/50'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
