# RSVP 폼 응답 페이지 — 구현 계획 (`tixx.website`)

배경/제품 결정은 TIXX 모노레포의 `docs/rsvp-form-feature-plan.md`, 백엔드 요청 사항은 같은 위치의 `docs/rsvp-form-api-requirements.md`를 따른다. 이 문서는 그 결정을 `tixx.website`에서 어떤 순서로 구현할지 정리한다.

## 전제

- 백엔드 `rsvp-forms` API는 아직 존재하지 않는다. 실제 계약(`GET`/`POST` 응답 형태)이 확정되기 전까지는 API 요청 문서의 참고 형태를 기준으로 타입/함수를 작성하고, 백엔드가 준비되면 필요한 부분만 맞춰 조정한다.
- 이 저장소는 모노레포의 `@tixx/schema`를 import하지 않는 별도 배포 단위다(`lib/api/types.ts` 상단 주석 참고 — 읽기 전용 서브셋을 로컬에 중복 정의하는 기존 컨벤션). 새 타입도 같은 방식으로 로컬에 plain TS로 정의한다. 이 레포엔 `zod` 의존성이 없으므로 새로 추가하지 않고 기존처럼 수동 검증 함수로 처리한다.
- 이 레포엔 테스트 프레임워크가 없다(`package.json` scripts: `dev`/`build`/`start`/`lint`뿐). 단위별 검증은 `npm run lint` + `npm run build`(타입체크 겸함) + 개발 서버에서 브라우저 확인으로 한다.
- 실제 API가 없어 종단간(end-to-end) 검증은 불가능하다. 각 작업 단위는 로컬 fixture 데이터로 화면을 렌더링해 시각적으로 확인하고, 실제 fetch 연동 코드 자체는 API 요청 문서의 계약대로 작성해둔다.
- 새 라우트는 `(marketing)` 레이아웃(Navbar/Footer 포함)이 아니라 별도 route group으로 만든다 — Typeform처럼 전체 화면을 채우는 디자인이라 기존 마케팅 사이트 크롬(Navbar/Footer)이 어울리지 않는다. 다만 `wv`(웹뷰 전용, `noindex`)와 달리 이 페이지는 카카오톡 등으로 공유되는 공개 페이지라 OG/JSON-LD 메타데이터는 그대로 필요하다.

## 작업 단위

### 1. 데이터 타입 + API 클라이언트 함수
- `lib/api/types.ts`에 `RsvpForm`, `RsvpFormBlock`(타입별 config, discriminated union), `RsvpSubmission`, 제출 요청/응답 타입 추가.
- `lib/api/rsvp-forms.ts` 신규: `getRsvpForm(id)`(서버 사이드 GET, 무인증 공개 조회), `submitRsvpForm(id, payload)`(클라이언트에서 `api.tixx.im`에 직접 POST). 제출은 브라우저에서 호출해야 하므로 서버 전용인 기존 `apiGet`과 별도로 클라이언트용 fetch 헬퍼가 필요하다.

### 2. 라우트/레이아웃 뼈대
- `app/(forms)/layout.tsx` 신규 — 자체 `<html>/<body>`, Navbar/Footer 없음, `wv`와 달리 metadata는 페이지별로 채움.
- `app/(forms)/forms/[id]/page.tsx` — `generateMetadata`(OG/JSON-LD, `events/[id]` 패턴 재사용), 404 처리(`ApiNotFoundError`), fixture 데이터로 정적 렌더링 확인.

### 3. 테마 시스템
- 배경(색/이미지) · 폰트 프리셋(이미 `globals.css`에 있는 `--font-pretendard`/`--font-display`/`--font-sans`/`--font-noto-sans-kr` 재사용, 신규 폰트 추가 없음) · 사이즈 프리셋(`sm`/`md`/`lg`) · 액센트 컬러를 CSS 커스텀 프로퍼티로 주입.
- `pickReadableTextColor`(대비율 계산, `apps/mobile/src/utils/storyShareColor.ts` 이식) — 최종 배경색 기준 텍스트색을 렌더링 시점에 계산.

### 4. 스텝 엔진
- `framer-motion`의 `AnimatePresence`로 스텝 전환, 진행 표시(progress bar), 뒤로가기 시 이전 답변 유지.
- 문항 하나당 화면 하나를 꽉 채우는 레이아웃(배경 이미지가 필드마다 겹치지 않도록).

### 5. 블록 렌더러 5종
- `short_text` / `long_text` / `phone`(`libphonenumber-js` 포맷팅+검증) / `choice`(단일/다중, 최대 8개 옵션) / `legal`(항상 필수, 동의 문구 표시).
- 블록별 클라이언트 측 유효성 검증(필수값, 길이 제한, 전화번호 형식, 옵션 범위).

### 6. 제출 플로우
- 답변 수집 → `consentSnapshot`(legal 블록에 실제 표시된 문구 원문) 포함 payload 구성 → 허니팟 필드 → 제출 → 성공 시 완료 화면, 실패 시 에러 코드별 안내(`rsvp-form-api-requirements.md` 4번 참고).

## 커밋 방식

이 레포의 기존 컨벤션(`git log` 확인 결과: `type: 설명` 형식, 영문 소문자, 예: `feat: add version selector to legal document pages`)을 따른다. 각 작업 단위 완료 후 커밋한다.
