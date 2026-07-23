import { notFound } from 'next/navigation';
import { RsvpFormView } from '@/components/rsvp-form/RsvpFormView';
import { RSVP_FORM_FIXTURES } from '@/lib/api/rsvp-forms.fixture';

interface PageProps {
  searchParams: Promise<{ fixture?: string }>;
}

// Dev-only mock-data harness — visits the real component tree
// (RsvpFormView -> RsvpFormShell/RsvpStepEngine/rsvpBlocks) without needing
// the not-yet-built backend. 404s in production so it never ships as a
// public route. Try ?fixture=color-bg | image-bg | minimal.
export default async function RsvpFormPreviewPage({ searchParams }: PageProps) {
  if (process.env.NODE_ENV === 'production') notFound();

  const { fixture = 'color-bg' } = await searchParams;
  const form = RSVP_FORM_FIXTURES[fixture];

  if (!form) notFound();

  return <RsvpFormView form={form} />;
}
