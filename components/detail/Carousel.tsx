'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start' });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  if (images.length === 0) return null;

  return (
    <div className="relative w-full">
      <div ref={emblaRef} className={cn('overflow-hidden bg-grayscale-800', aspectClassName)}>
        <div className="flex h-full">
          {images.map((image, index) => (
            <button
              key={image.url + index}
              type="button"
              onClick={() => onImageClick?.(index)}
              className="relative h-full w-full flex-shrink-0"
            >
              <Image
                src={image.url}
                alt={image.alt ?? ''}
                fill
                sizes="(min-width: 1024px) 640px, 100vw"
                className="object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
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
