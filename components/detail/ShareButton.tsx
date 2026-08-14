'use client';

import { Share2 } from 'lucide-react';
import { useState } from 'react';

export function ShareButton({
  title,
  sharePath,
  shareLabel,
  copiedLabel,
}: {
  title: string;
  sharePath: string;
  shareLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    // Resolve against the browser origin at click time so the same build works
    // on local, staging, and production domains without a public env variable.
    const url = new URL(sharePath, window.location.origin).toString();

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled or share failed — fall through to clipboard copy
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white"
      aria-label={shareLabel}
    >
      <Share2 size={16} />
      {copied && (
        <span className="absolute -bottom-7 right-0 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white">
          {copiedLabel}
        </span>
      )}
    </button>
  );
}
