import { Pill } from './Pill';

export function HashtagList({
  categoryLabel,
  hashtags,
}: {
  categoryLabel?: string;
  hashtags: string[];
}) {
  if (!categoryLabel && hashtags.length === 0) return null;

  return (
    <div className="flex flex-row flex-wrap items-center gap-2">
      {categoryLabel && <Pill emphasis>{categoryLabel}</Pill>}
      {hashtags.map((tag) => (
        <Pill key={tag}>#{tag}</Pill>
      ))}
    </div>
  );
}
