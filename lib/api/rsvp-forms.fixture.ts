import type { RsvpForm } from './types';

// Mock data for local development/QA only — lets the component tree
// (RsvpFormView -> RsvpFormShell/RsvpStepEngine/rsvpBlocks) be iterated on
// without a live host session or preview token. For the real integration
// see getRsvpForm/getRsvpFormPreview in ./rsvp-forms.ts. Consumed by
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
      purpose: 'collection',
      content:
        '수집 항목: 이름, 전화번호. 수집 목적: 행사 안내 및 입장 확인. 보유 기간: 행사 종료 후 1개월. 동의를 거부할 수 있으며, 거부 시 신청이 제한됩니다.',
    },
  },
  {
    id: 6,
    order: 5,
    type: 'legal',
    label: '마케팅 정보 수신에 동의합니다',
    required: false,
    config: {
      type: 'legal',
      purpose: 'marketing_sms',
      content: '이후 TIXX Music의 행사 소식을 문자로 받아보실 수 있습니다. 동의하지 않아도 신청에는 영향이 없습니다.',
    },
  },
];

export const RSVP_FORM_FIXTURES: Record<string, RsvpForm> = {
  // 순수 색 배경, 오버레이 없음, 가운데 정렬
  'color-bg': {
    id: 1,
    hostId: 10,
    status: 'published',
    revision: 1,
    posterImageUrl: '/images/dj-club.png',
    caption: '2026 여름 루프탑 파티에 초대합니다',
    theme: {
      fontId: 'pretendard',
      fontColor: '#f5f5f0',
      sizeScale: 'md',
      alignment: 'center',
      buttonColor: '#f2f862',
      buttonTextColor: '#111111',
      answerColor: '#f5f5f0',
      backgroundColor: '#0b0b0f',
      backgroundImage: null,
      brightness: 0,
    },
    showHostBadge: true,
    host: { id: 10, name: 'TIXX Music', imageUrl: null },
    blocks: BASE_BLOCKS,
  },
  // 배경 이미지 + 어두운(검정) 오버레이, 왼쪽 정렬
  'image-bg': {
    id: 2,
    hostId: 10,
    status: 'published',
    revision: 1,
    posterImageUrl: '/images/dj-club.png',
    caption: '2026 여름 루프탑 파티에 초대합니다',
    theme: {
      fontId: 'outfit',
      fontColor: '#ffffff',
      sizeScale: 'lg',
      alignment: 'left',
      buttonColor: '#f2f862',
      buttonTextColor: '#111111',
      answerColor: '#ffffff',
      backgroundColor: '#0b0b0f',
      backgroundImage: '/images/dj-club.png',
      brightness: -60,
    },
    showHostBadge: true,
    host: { id: 10, name: 'TIXX Music', imageUrl: null },
    blocks: BASE_BLOCKS,
  },
  // 배경 이미지 + 밝은(흰색) 오버레이, 가운데 정렬
  'image-bg-light': {
    id: 4,
    hostId: 10,
    status: 'published',
    revision: 1,
    posterImageUrl: '/images/dj-club.png',
    caption: '2026 여름 루프탑 파티에 초대합니다',
    theme: {
      fontId: 'inter',
      fontColor: '#111111',
      sizeScale: 'md',
      alignment: 'center',
      buttonColor: '#111111',
      buttonTextColor: '#ffffff',
      answerColor: '#111111',
      backgroundColor: '#ffffff',
      backgroundImage: '/images/dj-club.png',
      brightness: 40,
    },
    showHostBadge: true,
    host: { id: 10, name: 'TIXX Music', imageUrl: null },
    blocks: BASE_BLOCKS,
  },
  // 순수 색 배경 + 왼쪽 정렬, 문항 최소 조합(2개), 포스터/호스트 배지 없음
  minimal: {
    id: 3,
    hostId: 11,
    status: 'published',
    revision: 1,
    posterImageUrl: null,
    caption: '조용한 소모임 RSVP',
    theme: {
      fontId: 'notoSansKr',
      fontColor: '#111111',
      sizeScale: 'sm',
      alignment: 'left',
      buttonColor: '#111111',
      buttonTextColor: '#ffffff',
      answerColor: '#111111',
      backgroundColor: '#ffffff',
      backgroundImage: null,
      brightness: 0,
    },
    showHostBadge: false,
    host: null,
    blocks: BASE_BLOCKS.slice(0, 2),
  },
};
