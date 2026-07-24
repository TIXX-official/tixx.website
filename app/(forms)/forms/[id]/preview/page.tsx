import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RsvpFormView } from '@/components/rsvp-form/RsvpFormView';
import { ApiNotFoundError, ApiUnauthorizedError } from '@/lib/api/client';
import { getRsvpFormPreview } from '@/lib/api/rsvp-forms';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}

// Token-gated preview — draft or published, unlike /forms/[id] which only
// ever serves published forms. URL shape (`/forms/:id/preview?token=`) is
// fixed by the host app's getRsvpFormPreviewUrl helper, so don't rename.
export const metadata: Metadata = {
  title: 'TIXX',
  robots: { index: false, follow: false },
};

export default async function RsvpFormPreviewPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { token } = await searchParams;

  if (!token) notFound();

  let form;
  try {
    form = await getRsvpFormPreview(id, token);
  } catch (error) {
    if (error instanceof ApiNotFoundError || error instanceof ApiUnauthorizedError) notFound();
    throw error;
  }

  return <RsvpFormView form={form} />;
}
