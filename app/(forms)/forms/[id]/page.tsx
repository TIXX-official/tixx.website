import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RsvpFormView } from '@/components/rsvp-form/RsvpFormView';
import { ApiNotFoundError } from '@/lib/api/client';
import { getRsvpForm } from '@/lib/api/rsvp-forms';
import { absoluteUrl } from '@/lib/siteUrl';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const form = await getRsvpForm(id);
    const title = form.title ?? form.caption ?? (form.host ? `${form.host.name}의 초대장` : 'RSVP');
    const url = absoluteUrl(`/forms/${id}`);

    return {
      title: `${title} | TIXX`,
      alternates: { canonical: url },
      openGraph: {
        title,
        url,
        images: form.posterImageUrl ? [{ url: form.posterImageUrl }] : undefined,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        images: form.posterImageUrl ? [form.posterImageUrl] : undefined,
      },
    };
  } catch {
    return { title: 'TIXX' };
  }
}

export default async function RsvpFormPage({ params }: PageProps) {
  const { id } = await params;

  let form;
  try {
    form = await getRsvpForm(id);
  } catch (error) {
    if (error instanceof ApiNotFoundError) notFound();
    throw error;
  }

  return <RsvpFormView form={form} />;
}
