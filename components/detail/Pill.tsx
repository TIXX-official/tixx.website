import { cn } from '@/lib/utils';
import { Text } from './Text';

export function Pill({
  children,
  className,
  emphasis = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** solid grayscale-800 chip vs. plain "#tag" text used for hashtags */
  emphasis?: boolean;
}) {
  if (!emphasis) {
    return (
      <Text
        as="span"
        variant="body3Regular"
        className={cn('text-grayscale-300', className)}
      >
        {children}
      </Text>
    );
  }

  return (
    <span className={cn('rounded-[10px] bg-grayscale-800 px-3 py-1', className)}>
      <Text as="span" variant="body3Regular" className="text-grayscale-300">
        {children}
      </Text>
    </span>
  );
}
