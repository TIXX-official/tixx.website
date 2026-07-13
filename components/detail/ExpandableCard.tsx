'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Text } from './Text';

export function ExpandableCard({
  title,
  content,
  clampLines = 5,
}: {
  title: string;
  content: string;
  clampLines?: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <Text variant="headline2Medium" className="mb-3">
        {title}
      </Text>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full rounded-xl border border-grayscale-700 px-4 py-4 text-left"
      >
        <Text
          variant="body3RegularLarge"
          className="whitespace-pre-line text-grayscale-300"
          style={
            expanded
              ? undefined
              : {
                  display: '-webkit-box',
                  WebkitLineClamp: clampLines,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }
          }
        >
          {content}
        </Text>
        <div className="mt-2 flex justify-center text-grayscale-400">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>
    </div>
  );
}
