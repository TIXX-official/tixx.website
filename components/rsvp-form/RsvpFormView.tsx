import Image from 'next/image';
import type { RsvpForm } from '@/lib/api/types';
import { RsvpFormShell } from './RsvpFormShell';

// Minimal content for now — the step engine and block renderers land in
// later implementation-plan units. Theming is wired via RsvpFormShell.
export function RsvpFormView({ form }: { form: RsvpForm }) {
  return (
    <RsvpFormShell theme={form.theme}>
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
        {form.theme.backgroundType === 'color' && form.posterImageUrl && (
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
        {form.caption && (
          <p
            className="max-w-md font-medium"
            style={{ fontSize: 'var(--rsvp-label-size)' }}
          >
            {form.caption}
          </p>
        )}
        {form.showHostBadge && form.host && (
          <p className="mt-4 text-sm opacity-60">Hosted by {form.host.name}</p>
        )}
      </main>
    </RsvpFormShell>
  );
}
