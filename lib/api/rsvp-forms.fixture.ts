import type { RsvpForm } from './types';

// Mock data for local development/QA only — the real backend API doesn't
// exist yet (see docs/rsvp-form-api-requirements.md). Consumed by
// app/(forms)/forms/preview/page.tsx, which 404s outside development.

const BASE_BLOCKS: RsvpForm['blocks'] = [
  {
    id: 1,
    order: 0,
    type: 'short_text',
    label: '이름을 알려주세요',
    required: true,
    config: { type: 'short_text', maxLength: 50 },
  },
  {
    id: 2,
    order: 1,
    type: 'phone',
    label: '연락처를 남겨주세요',
    required: true,
    config: { type: 'phone' },
  },
  {
    id: 3,
    order: 2,
    type: 'choice',
    label: '몇 분과 함께 오시나요?',
    required: true,
    config: { type: 'choice', multiple: false, options: ['혼자', '1명과 함께', '2명 이상'] },
  },
  {
    id: 4,
    order: 3,
    type: 'long_text',
    label: '전달하고 싶은 말이 있다면 남겨주세요',
    required: false,
    config: { type: 'long_text', maxLength: 300 },
  },
  {
    id: 5,
    order: 4,
    type: 'legal',
    label: '개인정보 수집 및 이용에 동의합니다',
    required: true,
    config: {
      type: 'legal',
      content:
        '수집 항목: 이름, 전화번호. 수집 목적: 행사 안내 및 입장 확인. 보유 기간: 행사 종료 후 1개월. 동의를 거부할 수 있으며, 거부 시 신청이 제한됩니다.',
    },
  },
];

export const RSVP_FORM_FIXTURES: Record<string, RsvpForm> = {
  'color-bg': {
    id: 1,
    hostId: 10,
    posterImageUrl: '/images/dj-club.png',
    caption: '2026 여름 루프탑 파티에 초대합니다',
    theme: {
      backgroundType: 'color',
      backgroundValue: '#0b0b0f',
      fontId: 'pretendard',
      sizeScale: 'md',
      accentColor: '#f2f862',
    },
    showHostBadge: true,
    host: { id: 10, name: 'TIXX Music', imageUrl: null },
    blocks: BASE_BLOCKS,
  },
  'image-bg': {
    id: 2,
    hostId: 10,
    posterImageUrl: '/images/dj-club.png',
    caption: '2026 여름 루프탑 파티에 초대합니다',
    theme: {
      backgroundType: 'image',
      backgroundValue: '/images/dj-club.png',
      fontId: 'outfit',
      sizeScale: 'lg',
      accentColor: '#f2f862',
    },
    showHostBadge: true,
    host: { id: 10, name: 'TIXX Music', imageUrl: null },
    blocks: BASE_BLOCKS,
  },
  minimal: {
    id: 3,
    hostId: 11,
    posterImageUrl: null,
    caption: '조용한 소모임 RSVP',
    theme: {
      backgroundType: 'color',
      backgroundValue: '#ffffff',
      fontId: 'notoSansKr',
      sizeScale: 'sm',
      accentColor: '#111111',
    },
    showHostBadge: false,
    host: null,
    blocks: BASE_BLOCKS.slice(0, 2),
  },
};
