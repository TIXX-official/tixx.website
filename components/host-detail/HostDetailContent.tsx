'use client';

import { Instagram, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { AppCTA } from '@/components/detail/AppCTA';
import { Carousel } from '@/components/detail/Carousel';
import { Divider } from '@/components/detail/Divider';
import { EventListItem } from '@/components/detail/EventListItem';
import { ExpandableCard } from '@/components/detail/ExpandableCard';
import { HashtagList } from '@/components/detail/HashtagList';
import { Lightbox } from '@/components/detail/Lightbox';
import { Tabs } from '@/components/detail/Tabs';
import { Text } from '@/components/detail/Text';
import { dictionary } from '@/lib/dictionary';
import { useLanguage } from '@/lib/LanguageContext';
import type { EventListItemDto, HostDetail } from '@/lib/api/types';
import { resolveEventCtaState } from '@/lib/format/ticket';
import { cn } from '@/lib/utils';

type TabValue = 'all' | 'before' | 'ongoing' | 'past';

function filterByTab(
  events: EventListItemDto[],
  tab: TabValue,
): EventListItemDto[] {
  const now = new Date();
  return events.filter((event) => {
    const start = new Date(`${event.startDate}T${event.startTime}Z`);
    const end = new Date(`${event.endDate}T${event.endTime}Z`);
    if (tab === 'all') return true;
    if (tab === 'before') return start > now;
    if (tab === 'ongoing') return start <= now && end > now;
    return end <= now;
  });
}

export function HostDetailContent({
  host,
  hostedEvents,
}: {
  host: HostDetail;
  hostedEvents: EventListItemDto[];
}) {
  const { language } = useLanguage();
  const t = dictionary[language].hostDetail;
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const venue = host.events[0];
  const isVenue = host.category === 'Venue' && Boolean(venue);
  const venueMedias = venue?.eventMedias ?? [];

  const allEvents = useMemo<EventListItemDto[]>(() => {
    const combined = [...hostedEvents];
    if (isVenue && venue?.samePlaceEvents) {
      for (const event of venue.samePlaceEvents) {
        if (!combined.some((e) => e.id === event.id)) combined.push(event);
      }
    }
    return combined.sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );
  }, [hostedEvents, isVenue, venue]);

  const filteredEvents = useMemo(
    () => filterByTab(allEvents, activeTab),
    [allEvents, activeTab],
  );

  const hashtags = isVenue
    ? (venue?.eventHashtags ?? []).map(
        (h) =>
          (language === 'KO' ? h.hashtag?.korName : h.hashtag?.key) ?? h.tag,
      )
    : [];

  const cta = resolveEventCtaState(host.tickets);
  const eventDict = dictionary[language].eventDetail;
  const ctaLabel =
    cta.kind === 'buy'
      ? eventDict.buyTicket
      : cta.kind === 'claim'
        ? eventDict.claimTicket
        : null;

  const hasSidebar = Boolean(ctaLabel);

  return (
    <div className='mx-auto max-w-6xl pb-28 pt-24 lg:pb-16'>
      <div className='lg:grid lg:grid-cols-[1.5fr_1fr] lg:gap-10 lg:items-start'>
        <div className='lg:col-span-2'>
          {isVenue && venueMedias.length > 0 && (
            <Carousel
              images={venueMedias.map((m) => ({
                url: m.mediaUrl,
                alt: venue?.name,
              }))}
              aspectClassName='aspect-video'
              onImageClick={setLightboxIndex}
            />
          )}

          <div className='px-4 pt-4 lg:px-0'>
            <HashtagList
              categoryLabel={t.categories[host.category]}
              hashtags={hashtags}
            />
            <div className='mt-5 flex flex-row'>
              <div className='min-w-0 flex-1'>
                <div className='flex flex-row items-center gap-1.5'>
                  <Text as='h1' variant='h1Semibold'>
                    {host.name}
                  </Text>
                  {isVenue && venue?.instagramUrl && (
                    <a
                      href={venue.instagramUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Instagram size={20} className='text-grayscale-300' />
                    </a>
                  )}
                </div>
                <div className='mt-2 flex flex-row items-center gap-1'>
                  <Text
                    as='span'
                    variant='body1Regular'
                    className='text-grayscale-0'
                  >
                    {t.followers} {host.followerCount}
                  </Text>
                  <Text as='span' className='text-grayscale-0'>
                    ·
                  </Text>
                  <Text
                    as='span'
                    variant='body1Regular'
                    className='text-grayscale-0'
                  >
                    {t.hostedEventsList} {allEvents.length}
                  </Text>
                </div>
              </div>
              <div className='relative ml-4 h-[70px] w-[70px] flex-shrink-0 self-center overflow-hidden rounded-full bg-grayscale-700'>
                {host.imageUrl && (
                  <Image
                    src={host.imageUrl}
                    alt={host.name}
                    fill
                    sizes='70px'
                    className='object-cover'
                  />
                )}
              </div>
            </div>
            {isVenue && venue && (
              <div className='mt-6 flex flex-row items-center gap-1'>
                <MapPin size={18} className='text-grayscale-300' />
                <Text variant='body3Regular' className='text-grayscale-300'>
                  {t.address} | {venue.place.address}
                </Text>
              </div>
            )}
          </div>

          {isVenue && host.description && (
            <div className='px-4 lg:px-0'>
              <Divider className='my-6' />
              <ExpandableCard
                title={t.description}
                content={host.description}
              />
            </div>
          )}

          <Divider className='mx-4 my-6 lg:mx-0' />
        </div>

        <div
          className={cn(
            'mt-4 px-4 lg:col-start-1 lg:mt-0 lg:px-0',
            !hasSidebar && 'lg:col-span-2',
          )}
        >
          <Text variant='headline2Medium' className='mb-5'>
            {t.hostedEventsList}
          </Text>
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            options={[
              { value: 'all', label: t.tabs.all },
              { value: 'before', label: t.tabs.before },
              { value: 'ongoing', label: t.tabs.ongoing },
              { value: 'past', label: t.tabs.past },
            ]}
          />
          <div
            className={cn(
              'mt-5 flex flex-col gap-4',
              !hasSidebar && 'lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5',
            )}
          >
            {filteredEvents.map((event) => (
              <EventListItem key={event.id} event={event} />
            ))}
          </div>
        </div>

        {hasSidebar && (
          <div className='mt-6 hidden px-4 lg:col-start-2 lg:row-start-2 lg:mt-0 lg:block lg:px-0 lg:sticky lg:top-8'>
            {ctaLabel && (
              <AppCTA
                label={ctaLabel}
                deepLink={`https://tixx.im/hosts/${host.id}`}
              />
            )}
          </div>
        )}
      </div>

      {ctaLabel && (
        <div className='fixed bottom-0 left-0 right-0 lg:hidden'>
          <AppCTA
            label={ctaLabel}
            deepLink={`https://tixx.im/hosts/${host.id}`}
          />
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={venueMedias.map((m) => ({ url: m.mediaUrl }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
