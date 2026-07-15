'use client';

import { Eye, Heart } from 'lucide-react';
import Image from 'next/image';
import { AppCTA } from '@/components/detail/AppCTA';
import { Divider } from '@/components/detail/Divider';
import { ExpandableCard } from '@/components/detail/ExpandableCard';
import { AvatarStack } from '@/components/detail/AvatarStack';
import { GalleryGrid } from '@/components/detail/GalleryGrid';
import { HashtagList } from '@/components/detail/HashtagList';
import { HostInlineCard } from '@/components/detail/HostInlineCard';
import { LocationSection } from '@/components/detail/LocationSection';
import { ShareButton } from '@/components/detail/ShareButton';
import { SnsLinks } from '@/components/detail/SnsLinks';
import { Text } from '@/components/detail/Text';
import { dictionary } from '@/lib/dictionary';
import { useLanguage } from '@/lib/LanguageContext';
import type { EventDetail } from '@/lib/api/types';
import {
  formatEventDateRangeLabel,
  parseEventDateTime,
  resolveDisplayEndDateTime,
} from '@/lib/format/eventDateTime';
import { resolveEventCtaState } from '@/lib/format/ticket';

export function EventDetailContent({ event }: { event: EventDetail }) {
  const { language } = useLanguage();
  const t = dictionary[language].eventDetail;

  const startDateTime = parseEventDateTime(event.startDate, event.startTime);
  const rawEndDateTime = parseEventDateTime(event.endDate, event.endTime);
  const displayEndDateTime = resolveDisplayEndDateTime(startDateTime, rawEndDateTime);
  const { formattedDate, formattedTime } = formatEventDateRangeLabel(
    startDateTime,
    displayEndDateTime,
    language
  );

  const categoryLabel = t.categories[event.category] ?? event.category;
  const hashtags = event.eventHashtags.map(
    (h) => (language === 'KO' ? h.hashtag?.korName : h.hashtag?.key) ?? h.tag
  );
  // The event's embedded `host` is a bare summary (id/name/imageUrl) with no
  // category — mirrors the mobile app's fallback ('hosts.categories.Host').
  const hostCategoryLabel = dictionary[language].hostDetail.categories.Host;

  const cta = resolveEventCtaState(event.tickets);
  const ctaLabel =
    cta.kind === 'buy'
      ? t.buyTicket
      : cta.kind === 'claim'
        ? t.claimTicket
        : cta.kind === 'waitlist'
          ? t.joinWaitlist
          : null;

  return (
    <div className="mx-auto max-w-6xl px-0 pb-28 pt-24 lg:px-6 lg:pb-16">
      <div className="lg:grid lg:grid-cols-[1.5fr_1fr] lg:gap-10 lg:items-start">
        {/* Hero + header block (full width on both breakpoints) */}
        <div className="lg:col-span-2 lg:flex lg:flex-row lg:items-start lg:gap-8">
          <div className="relative aspect-[4/5] w-full sm:aspect-video lg:aspect-[4/5] lg:w-full lg:max-w-[460px] lg:flex-shrink-0 lg:rounded-2xl lg:overflow-hidden">
            <Image
              src={event.imageUrl}
              alt={event.name}
              fill
              priority
              sizes="(min-width: 1024px) 460px, 100vw"
              className="object-cover"
            />
            <div className="absolute right-3 top-3">
              <ShareButton title={event.name} shareLabel={t.share} copiedLabel={t.copied} />
            </div>
          </div>

          <div className="px-4 pt-4 lg:flex-1 lg:min-w-0 lg:px-0 lg:pt-0">
            <div className="flex flex-row items-center gap-4">
              <div className="flex flex-row items-center gap-1">
                <Eye size={16} className="text-grayscale-300" />
                <Text as="span" variant="caption1Regular" className="text-grayscale-300">
                  {event.viewCount.toLocaleString(language === 'KO' ? 'ko-KR' : 'en-US')}
                </Text>
              </div>
              <div className="flex flex-row items-center gap-1">
                <Heart size={16} className="text-grayscale-300" />
                <Text as="span" variant="caption1Regular" className="text-grayscale-300">
                  {event.wishCount.toLocaleString(language === 'KO' ? 'ko-KR' : 'en-US')}
                </Text>
              </div>
            </div>
            <Text as="h1" className="mt-3 mb-2 text-[28px] leading-9 font-semibold lg:text-[32px]">
              {event.name}
            </Text>
            <Text variant="body3RegularLarge" className="text-grayscale-300">
              {formattedDate} · {formattedTime}
            </Text>
            <div className="mt-4">
              <HashtagList categoryLabel={categoryLabel} hashtags={hashtags} />
            </div>
            {event.host.name && (
              <div className="mt-5">
                <HostInlineCard
                  host={event.host}
                  categoryLabel={hostCategoryLabel}
                  followLabel={t.follow}
                />
              </div>
            )}
          </div>
        </div>

        {/* Left column: browsing content */}
        <div className="mt-6 flex flex-col gap-6 px-4 lg:col-start-1 lg:px-0">
          <Divider />
          {event.participantCount > 0 && (
            <section>
              <Text variant="headline2Medium" className="mb-3">
                {t.guestList}
              </Text>
              <AvatarStack
                participants={event.participants}
                participantCount={event.participantCount}
                blurred
              />
            </section>
          )}

          <LocationSection
            place={event.place}
            venue={event.venue}
            title={t.location}
            viewOnMapLabel={t.viewOnMap}
          />

          <ExpandableCard title={t.notice} content={event.description} />
          {event.notice && (
            <ExpandableCard title={t.noticeInfo} content={event.notice} />
          )}

          <SnsLinks
            title={t.sns}
            links={{
              instagramUrl: event.instagramUrl,
              tiktokUrl: event.tiktokUrl,
              blogUrl: event.blogUrl,
              youtubeUrl: event.youtubeUrl,
              homepageUrl: event.homepageUrl,
            }}
            labels={t.snsLinks}
          />

          {event.eventGallery.length > 0 && (
            <section>
              <Text variant="headline2Medium" className="mb-3">
                {t.album}
              </Text>
              <GalleryGrid items={event.eventGallery} videoLabel={t.video} />
            </section>
          )}
        </div>

        {/* Right column: purchase-intent sidebar */}
        {ctaLabel && (
          <div className="mt-6 hidden px-4 lg:col-start-2 lg:row-start-2 lg:mt-0 lg:block lg:px-0 lg:sticky lg:top-8">
            <AppCTA label={ctaLabel} />
          </div>
        )}
      </div>

      {ctaLabel && (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden">
          <AppCTA label={ctaLabel} />
        </div>
      )}
    </div>
  );
}
