'use client';

import { cn } from '@/lib/utils';
import { Text } from './Text';

export interface TabOption<T extends string> {
  value: T;
  label: string;
}

export function Tabs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-row flex-wrap gap-3">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-full border px-4 py-1.5 transition-colors',
              active ? 'border-point-500' : 'border-transparent'
            )}
          >
            <Text as="span" variant="body3Medium" className="text-grayscale-0">
              {option.label}
            </Text>
          </button>
        );
      })}
    </div>
  );
}
