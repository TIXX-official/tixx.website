# TIXX 웹 전환 분석

웹 분석은 Amplitude Browser SDK를 사용한다. 모바일과 같은 운영 프로젝트에
전송하며 모든 수동 이벤트에는 `platform=web`이 포함된다.

## 전환 정의

- 커스텀 폼: `rsvp_form_view` → `rsvp_form_start` →
  `rsvp_form_submit_success` → `app_cta_click` → `app_store_redirect`
- 이벤트 RSVP: `event_rsvp_view` → `event_rsvp_start` →
  `event_rsvp_submit_success` → `app_cta_click`
- 다운로드 페이지: `web_page_view(page_type=download)` → `app_store_click`

`app_store_redirect`와 `app_store_click`은 실제 설치가 아니라 스토어 이동이다.
웹과 앱의 익명 device ID도 서로 연결하지 않으므로 이 데이터만으로 설치 또는
앱 첫 실행을 판정하면 안 된다.

## 이벤트 원칙

- 폼 답변, 이름, 전화번호, 이메일, 인증 코드, 게스트 코드, 전체 URL과 전체
  referrer는 전송하지 않는다.
- 동적 경로는 `/forms/:id`, `/events/:id` 같은 템플릿으로 전송한다.
- 폼·이벤트 식별자는 별도의 `form_id`, `event_id`, `context_id`로 전송한다.
- `app_open_suspected`는 브라우저가 숨겨진 정황일 뿐 앱 실행 성공으로 집계하지 않는다.
- 분석 초기화나 전송 실패가 폼 제출과 페이지 이동을 막아서는 안 된다.

## 환경과 배포

`NEXT_PUBLIC_AMPLITUDE_API_KEY`는 Next.js 빌드 시 브라우저 번들에 포함된다.
로컬에서 비어 있으면 분석만 비활성화된다. 운영 배포는 GitHub Actions repository
variable에 같은 이름으로 값을 설정해야 하며, 누락 시 배포 검증이 실패한다.

운영 반영 전 개인정보처리방침에 Amplitude의 처리 목적, 자동 수집 항목,
보유·거부 방법과 국외 처리 여부를 반영하고 담당자 검토를 완료한다.
