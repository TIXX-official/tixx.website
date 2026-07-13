import { Globe, Instagram, Music2, Youtube } from 'lucide-react';
import { Text } from './Text';

export function SnsLinks({
  title,
  links,
}: {
  title: string;
  links: {
    instagramUrl?: string | null;
    tiktokUrl?: string | null;
    blogUrl?: string | null;
    youtubeUrl?: string | null;
    homepageUrl?: string | null;
  };
}) {
  const items = [
    { url: links.instagramUrl, icon: Instagram, label: 'Instagram' },
    { url: links.tiktokUrl, icon: Music2, label: 'TikTok' },
    { url: links.youtubeUrl, icon: Youtube, label: 'YouTube' },
    { url: links.blogUrl, icon: Globe, label: 'Blog' },
    { url: links.homepageUrl, icon: Globe, label: 'Homepage' },
  ].filter((item): item is typeof item & { url: string } => Boolean(item.url));

  if (items.length === 0) return null;

  return (
    <div>
      <Text variant="headline2Medium" className="mb-3">
        {title}
      </Text>
      <div className="flex flex-row flex-wrap gap-3">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-row items-center gap-1.5 rounded-full border border-grayscale-700 px-3 py-1.5"
          >
            <item.icon size={14} className="text-grayscale-300" />
            <Text as="span" variant="caption1Regular" className="text-grayscale-300">
              {item.label}
            </Text>
          </a>
        ))}
      </div>
    </div>
  );
}
