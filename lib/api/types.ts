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

/** Metadata-only item returned by GET /terms (@tixx/schema TermsListItemSchema) — no content */
export interface TermsListItem {
  id: number;
  type: TermsType;
  version: string;
  title: string;
  effectiveAt: string;
}

// RSVP forms: mirrors `PublicRsvpFormDto`/`RsvpSubmission*` in
// `@tixx/schema` (packages/schema/src/rsvp-forms.ts) in the tixx monorepo.
// Duplicated here for the same reason as the types above — only the
// read/submit subset this site needs.

export type RsvpFormFontId = 'pretendard' | 'outfit' | 'inter' | 'notoSansKr';
export type RsvpFormSizeScale = 'sm' | 'md' | 'lg';
export type RsvpFormAlignment = 'left' | 'center';

export interface RsvpFormTheme {
  // 폰트
  fontId: RsvpFormFontId;
  fontColor: string;
  sizeScale: RsvpFormSizeScale;
  // Applies to the question label and free-text (short_text/long_text/phone)
  // input text only — choice/legal keep their current layout regardless.
  alignment: RsvpFormAlignment;

  // 버튼 — drives progress bar fill, selected choice option, legal checkbox
  // accent, and the next/submit button background+text as one shared pair.
  buttonColor: string;
  buttonTextColor: string;
  // Color of visitor-typed answer text. Placeholder color is derived from
  // this at render time (see buildAnswerPlaceholderColor), not stored.
  answerColor: string;

  // 배경 — backgroundColor is always the fallback; backgroundImage (if set)
  // renders full-bleed with a brightness-driven overlay for legibility.
  backgroundColor: string;
  backgroundImage: string | null;
  // -100..100. Negative = black overlay, positive = white overlay, opacity
  // = abs(brightness)/100. Not a CSS `filter: brightness()` on the image.
  brightness: number;
}

export type RsvpFormBlockType =
  | 'short_text'
  | 'long_text'
  | 'phone'
  | 'choice'
  | 'legal';

export type RsvpLegalPurpose = 'collection' | 'marketing_sms';

export type RsvpFormBlockConfig =
  | { type: 'short_text'; maxLength?: number }
  | { type: 'long_text'; maxLength?: number }
  | { type: 'phone' }
  | { type: 'choice'; multiple: boolean; options: string[] }
  | { type: 'legal'; purpose: RsvpLegalPurpose; content: string };

export interface RsvpFormBlock {
  id: number;
  order: number;
  type: RsvpFormBlockType;
  label: string;
  required: boolean;
  config: RsvpFormBlockConfig;
}

export interface RsvpHostBadge {
  id: number;
  name: string;
  imageUrl: string | null;
}

export type RsvpFormStatus = 'draft' | 'published';

/** GET /rsvp-forms/:id (public, unauthenticated) — only `published` forms are returned. */
export interface RsvpForm {
  publicId: string;
  status: RsvpFormStatus;
  // Bumped by the backend whenever the form/blocks change. Echoed back on
  // submission so the server can detect a stale form (see FORM_CHANGED).
  revision: number;
  posterImageUrl: string | null;
  caption: string | null;
  theme: RsvpFormTheme;
  showHostBadge: boolean;
  host: RsvpHostBadge | null;
  blocks: RsvpFormBlock[];
}

export type RsvpSubmissionAnswerValue = string | string[] | boolean;

export interface RsvpSubmissionAnswer {
  blockId: number;
  value: RsvpSubmissionAnswerValue;
}

/** POST /rsvp-forms/:id/submissions request body */
export interface CreateRsvpSubmissionRequest {
  // The RsvpForm.revision this submission was built against — lets the
  // server reject submissions against a form that changed underneath the
  // visitor (see FORM_CHANGED below).
  revision: number;
  answers: RsvpSubmissionAnswer[];
}

/** One entry of VALIDATION_ERROR's `errors` array — per-block validation
 * failure (RsvpValidationErrorSchema in @tixx/schema). `message` is an
 * internal/English description, not meant to be shown to visitors as-is. */
export interface RsvpValidationErrorDetail {
  blockId?: number;
  code: string;
  message: string;
}

/** Failure shape returned by POST /rsvp-forms/:id/submissions, matching
 * @tixx/schema (RsvpValidationErrorSchema + the plain {code, message}
 * exceptions thrown for the other cases). `message` on every variant is an
 * internal/English description for logs — build user-facing copy from
 * `code` instead (see resolveErrorMessage in RsvpFormView.tsx). */
export type RsvpSubmissionErrorResponse =
  | { code: 'FORM_NOT_FOUND'; message?: string }
  | { code: 'FORM_CHANGED'; message?: string }
  | { code: 'RATE_LIMITED'; message?: string; retryAfterSeconds?: number }
  | { code: 'VALIDATION_ERROR'; message?: string; errors: RsvpValidationErrorDetail[] };
