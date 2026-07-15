import { cn } from '@/lib/utils';

export function Divider({ className }: { className?: string }) {
  return <div className={cn('h-px bg-grayscale-700', className)} />;
}
