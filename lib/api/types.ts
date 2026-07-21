// Shapes mirror `@tixx/schema` (packages/schema/src/{events,hosts,tickets}.ts)
// in the tixx monorepo. Duplicated here because this is a separate deployable
// (marketing/SEO site) that only needs a read-only subset of those contracts.

export type EventCategory =
  | 'party'
  | 'venue'
  | 'meetup'
  | 'gig'
  | 'popup'
  | 'exhibition'
  | 'festival'
  | 'concert'
  | 'class'
  | 'other';

export type HostCategory = 'Brand' | 'Promote' | 'Venue' | 'Host';

export type TicketType = 'paid' | 'guest' | 'table';

export interface Place {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
}

export interface HostSummary {
  id: number;
  name: string;
  imageUrl: string | null;
}

export interface HashtagRef {
  id: number;
  tag: string;
  hashtag: { id: number; key: string; korName: string | null } | null;
}

export interface EventMedia {
  id: string;
  eventId: number;
  mediaUrl: string;
  mimeType: string;
  thumbnailUrl: string | null;
  altText: string | null;
  sortOrder: number;
}

export interface EventGalleryItem {
  id: string;
  eventId: number;
  mediaUrl: string;
  thumbnailUrl: string | null;
  mimeType: string;
  uploaderType: 'host' | 'user';
  uploaderUserId: number;
  sortOrder: number | null;
}

export interface EventInformation {
  isNoSmoking: boolean;
  hasSmokingBooth: boolean;
  hasParkingArea: boolean;
  hasWaitingArea: boolean;
}

export interface Coupon {
  id: number;
  ticketId: number;
  code: string | null;
  quantity: number;
  isClaimable?: boolean;
  expiredAt: string;
}

export interface Ticket {
  id: number;
  eventId: number | null;
  hostId?: number | null;
  scopeType: 'event' | 'host';
  name: string;
  type: TicketType;
  description: string | null;
  startAt: string;
  endAt: string;
  originalPrice: number | null;
  price: number | null;
  quantity: number | null;
  remainQuantity: number;
  coupons: Coupon[];
}

export interface Participant {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
}

export interface VenueSummary {
  id: number;
  name: string;
  imageUrl: string;
  host: HostSummary;
  eventHashtags: HashtagRef[];
}

/** GET /events/:id */
export interface EventDetail {
  id: number;
  hostId: number;
  placeId: number;
  name: string;
  name_en?: string | null;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  imageUrl: string;
  notice?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  blogUrl?: string | null;
  youtubeUrl?: string | null;
  homepageUrl?: string | null;
  viewCount: number;
  isVenue: boolean;
  allowUserGalleryUpload: boolean;
  category: EventCategory;
  place: Place;
  host: HostSummary;
  eventHashtags: HashtagRef[];
  eventMedias: EventMedia[];
  eventGallery: EventGalleryItem[];
  informations: EventInformation[];
  tickets: Ticket[];
  wishCount: number;
  isWished: boolean;
  participants: Participant[];
  participantCount: number;
  venue: VenueSummary | null;
}

/** Item shape returned by GET /events, /events/host/:id, etc. */
export interface EventListItemDto {
  id: number;
  hostId: number;
  name: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  imageUrl: string;
  isVenue: boolean;
  category: EventCategory;
  host?: HostSummary;
  place: Place;
  // Present on GET /events (list) responses; GET /events/host/:id items
  // don't join this relation and omit the field entirely.
  eventHashtags?: HashtagRef[];
  tickets: { id: number; coupons: Coupon[] }[];
}

export interface PaginatedEventList {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
  items: EventListItemDto[];
}

/**
 * Full Event entity as embedded in HostDetail.events[] (venue-type events at
 * the host's place) — a superset of EventListItemDto with media/hashtags/
 * informations joined, plus a synthetic samePlaceEvents[] sibling list.
 */
export interface HostVenueEvent extends EventListItemDto {
  description: string;
  instagramUrl: string | null;
  eventMedias: EventMedia[];
  eventHashtags: HashtagRef[];
  informations: EventInformation[];
  samePlaceEvents: HostVenueEvent[];
}

/** GET /hosts/:id */
export interface HostDetail {
  id: number;
  name: string;
  subName: string | null;
  description: string | null;
  imageUrl: string | null;
  contactName: string | null;
  contactPhone: string | null;
  category: HostCategory;
  followerCount: number;
  events: HostVenueEvent[];
  tickets: Ticket[];
}

export type TermsType = 'service_terms' | 'privacy_collection' | 'refund_policy';

/** Item shape returned by GET /terms/latest and GET /terms/:id (@tixx/schema TermSchema) */
export interface Term {
  id: number;
  type: TermsType;
  version: string;
  title: string;
  content: string;
  requiresExplicitConsent: boolean;
  noticeEmailSent: boolean;
  effectiveAt: string;
  updatedAt: string;
}
