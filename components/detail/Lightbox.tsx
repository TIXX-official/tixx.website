'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Text } from './Text';

export function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: { url: string; alt?: string }[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, images.length - 1));
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0));
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [images.length, onClose]);

  const current = images[index];
  if (!current) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex h-9 min-w-[56px] items-center justify-center rounded-full bg-black/55 px-3">
          <Text as="span" variant="caption1Regular" className="text-white">
            {index + 1} / {images.length}
          </Text>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/55"
        >
          <X size={22} color="white" />
        </button>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="relative flex-1 cursor-zoom-out"
      >
        <Image
          src={current.url}
          alt={current.alt ?? ''}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </button>
      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 pb-6">
          {images.map((image, i) => (
            <button
              key={image.url + i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              className={`h-1.5 w-1.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
