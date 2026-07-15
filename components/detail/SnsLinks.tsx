import { Globe, Instagram, Music2, Youtube } from 'lucide-react';
import { Text } from './Text';

export function SnsLinks({
  title,
  links,
  labels,
}: {
  title: string;
  links: {
    instagramUrl?: string | null;
    tiktokUrl?: string | null;
    blogUrl?: string | null;
    youtubeUrl?: string | null;
    homepageUrl?: string | null;
  };
  labels: {
    instagram: string;
    tiktok: string;
    youtube: string;
    blog: string;
    homepage: string;
  };
}) {
  const items = [
    { url: links.instagramUrl, icon: Instagram, label: labels.instagram },
    { url: links.tiktokUrl, icon: Music2, label: labels.tiktok },
    { url: links.youtubeUrl, icon: Youtube, label: labels.youtube },
    { url: links.blogUrl, icon: Globe, label: labels.blog },
    { url: links.homepageUrl, icon: Globe, label: labels.homepage },
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
