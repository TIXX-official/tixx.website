import Image from 'next/image';
import type { RsvpForm } from '@/lib/api/types';

// Minimal shell for now — theme (background/font/size/accent), the step
// engine, and block renderers land in later implementation-plan units.
export function RsvpFormView({ form }: { form: RsvpForm }) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
      {form.posterImageUrl && (
        <div className="relative mb-8 aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl">
          <Image
            src={form.posterImageUrl}
            alt={form.caption ?? 'RSVP'}
            fill
            priority
            sizes="(min-width: 640px) 384px, 100vw"
            className="object-cover"
          />
        </div>
      )}
      {form.caption && <p className="max-w-md text-lg font-medium">{form.caption}</p>}
      {form.showHostBadge && form.host && (
        <p className="mt-4 text-sm text-white/60">Hosted by {form.host.name}</p>
      )}
    </main>
  );
}
