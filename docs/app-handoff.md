# 상세 공유 링크 자동 앱 핸드오프

이 문서는 이벤트·호스트 상세 링크가 카카오톡과 Instagram 인앱 브라우저에서 열렸을 때 TIXX 앱으로 자동 전환하는 구현의 배경, 동작 조건, 운영 절차를 설명한다.

## 배경과 목표

iOS Universal Link와 Android App Link가 올바르게 설정되어 있어도 카카오톡·Instagram은 링크를 자체 WebView에서 열 수 있다. 이 경우 앱이 설치되어 있어도 OS의 링크 연결 단계가 실행되지 않고 읽기 전용 웹 상세가 표시된다. 웹에서는 티켓 수령·구매 등 핵심 기능을 수행할 수 없으므로, 외부 공유 링크로 들어온 설치 사용자에게 앱 전환을 한 번 자동 시도한다.

목표 동작은 다음과 같다.

| 진입 환경 | 앱 설치 | 동작 |
| --- | --- | --- |
| KakaoTalk/Instagram 외부 링크 | 설치됨 | 앱 상세 화면 자동 전환 시도 |
| KakaoTalk/Instagram 외부 링크 | 미설치 | 현재 웹 상세 화면 유지 |
| Safari/Chrome 외부 링크 | 무관 | Universal Link/App Link 결과를 존중하고 웹에서 재시도하지 않음 |
| TIXX 웹 내부 탐색 | 무관 | 자동 전환하지 않음 |
| 새로고침·뒤로가기·앞으로가기 | 무관 | 자동 전환하지 않음 |

웹에는 임의의 iOS/Android 앱 설치 여부를 모든 WebView에서 미리 확인할 수 있는 범용 API가 없다. 따라서 이 구현은 설치 여부를 판별한 뒤 실행하는 방식이 아니라, 현재 문서를 손상시키지 않는 위치에서 딥링크를 한 번 시도하는 방식이다.

## URL 구조와 공유 미리보기

기존 상세 URL은 검색과 웹 탐색을 위한 canonical URL로 유지한다.

```text
https://tixx.im/events/:id
https://tixx.im/hosts/:id
```

외부 공유에는 별도 gateway URL을 사용한다.

```text
https://tixx.im/open/events/:id
https://tixx.im/open/hosts/:id
```

Gateway는 redirect 응답이 아니라 기존 상세 콘텐츠를 `200 OK`로 직접 SSR한다. 따라서 OG 크롤러가 JavaScript를 실행하지 않아도 이벤트·호스트별 제목, 설명, 이미지를 읽을 수 있다.

- `canonical`과 `og:url`: 기존 `/events/:id`, `/hosts/:id`
- `robots`: `noindex,follow`
- JSON-LD와 화면 콘텐츠: canonical 상세와 동일
- sitemap: gateway URL은 포함하지 않음

현재 이벤트 상세의 공유 버튼은 `/open/events/:id`를 공유한다. 호스트 gateway도 지원하지만 호스트 상세에 별도 공유 버튼을 추가하지는 않았다.

## 자동 실행 흐름

마케팅 layout의 초기 스크립트는 페이지를 숨기거나 이동시키지 않고 최초 문서 진입 정보만 `window.__TIXX_INITIAL_ENTRY__`에 저장한다.

```text
최초 pathname + document.referrer + Navigation Timing type
                           ↓
                  상세 페이지 hydration
                           ↓
                     실행 조건 판정
                    ↙             ↘
                 대상 아님       대상 맞음
                 웹 유지       session flag 기록
                                      ↓
                           hidden iframe에 tixx:// 로드
                              ↙                 ↘
                           처리됨              미처리
                       TIXX 앱 전환        부모 웹 화면 유지
```

다음 조건을 모두 만족할 때만 실행한다.

1. `/events/:id`, `/hosts/:id` 또는 대응하는 `/open/...` 상세 경로다.
2. 최초 문서 pathname과 현재 pathname이 같다.
3. Navigation Timing type이 `navigate`다.
4. referrer가 없거나 현재 사이트와 다른 origin이다.
5. UA가 KakaoTalk 또는 Instagram이며 iOS/Android로 판별된다.
6. 해당 WebView/OS 조합이 `AUTO_APP_HANDOFF_TARGETS`에 활성화되어 있다.
7. 현재 browsing session에서 아직 자동 시도하지 않았다.
8. query에 `noapp` 또는 `web`이 없다.

Next.js client navigation은 최초 pathname과 현재 pathname이 달라 제외된다. 일반 `<a>`를 통한 same-origin 전체 페이지 이동은 referrer origin으로 제외된다. `reload`와 `back_forward`도 Navigation Timing 값으로 제외된다.

## 실패 격리와 이전 구현과의 차이

커밋 `6708fa1`은 실행 전에 전체 `<body>`를 `visibility:hidden`으로 숨기고 top-level `location.href`를 `intent://` 또는 `tixx://`로 변경했다. 앱 미설치 WebView가 fallback을 처리하지 않거나 기존 문서를 suspend하면 복구 타이머도 실행되지 않아 검은 화면이 남을 수 있었다.

현재 구현은 다음 원칙을 따른다.

- 웹 본문과 URL을 처음부터 끝까지 유지한다.
- 전체 화면 오버레이를 사용하지 않는다.
- 자동 실행에서 top-level `location.href`와 `intent://`를 사용하지 않는다.
- `tixx://event/:id` 또는 `tixx://host/:id`는 숨겨진 iframe에서만 로드한다.
- iframe은 1.5초 후 제거한다.
- `visibilitychange`를 앱 설치 성공 판정으로 사용하지 않는다.
- 명시적 CTA 클릭의 앱 실행 및 스토어 fallback 로직은 기존대로 유지한다.

일부 WebView는 iframe에서 외부 scheme 실행 자체를 차단할 수 있다. 이 경우 앱이 설치되어 있어도 자동 전환되지 않지만 웹은 정상 유지된다. 안전한 자동 실행이 확인되지 않은 조합을 top-level navigation으로 승격하지 않는다.

## 운영 설정과 롤아웃

자동 실행은 기본 비활성화다. 서버 런타임 환경변수에 실기기 검증을 통과한 조합만 comma-separated value로 지정한다.

```text
AUTO_APP_HANDOFF_TARGETS=kakao-ios,kakao-android,instagram-ios,instagram-android
```

지원 값은 다음 네 개다.

- `kakao-ios`
- `kakao-android`
- `instagram-ios`
- `instagram-android`

예를 들어 KakaoTalk 조합만 활성화한다.

```bash
gcloud run services update tixx-web \
  --region asia-northeast1 \
  --update-env-vars '^@^AUTO_APP_HANDOFF_TARGETS=kakao-ios,kakao-android'
```

전체 자동 실행을 즉시 중단한다.

```bash
gcloud run services update tixx-web \
  --region asia-northeast1 \
  --remove-env-vars AUTO_APP_HANDOFF_TARGETS
```

배포 workflow는 다른 런타임 값을 제거하지 않도록 `--update-env-vars`를 사용한다. 설정 변경 후에는 새 Cloud Run revision이 serving 상태인지 확인한다.

## 실기기 승인 체크리스트

각 `KakaoTalk/Instagram × iOS/Android` 조합을 독립적으로 검증한 뒤 하나씩 활성화한다.

### 앱 설치 상태

- `/open/events/:id`와 기존 `/events/:id` 외부 링크가 앱의 정확한 이벤트로 열린다.
- `/open/hosts/:id`와 기존 `/hosts/:id` 외부 링크가 앱의 정확한 호스트로 열린다.
- 앱이 종료·백그라운드·포그라운드 상태일 때 각각 정상 동작한다.
- 앱에서 WebView로 돌아왔을 때 반복 실행 루프가 없다.

### 앱 미설치 상태

- 이벤트·호스트 웹 상세가 처음부터 표시된다.
- 검은 화면, 빈 탭, 오류 다이얼로그, 앱스토어 강제 이동이 없다.
- 1.5초 이후에도 URL과 웹 상호작용이 유지된다.
- 새로고침과 뒤로가기가 정상 동작한다.

### 진입 경로와 미리보기

- TIXX 웹 내부 client navigation에서는 자동 실행하지 않는다.
- same-origin 전체 페이지 이동에서도 자동 실행하지 않는다.
- `?web=1`, `?noapp=1`에서 자동 실행하지 않는다.
- 카카오톡과 Meta 공유 미리보기에 상세별 제목·설명·이미지가 표시된다.
- 일반 Safari·Chrome에서는 별도 iframe 시도를 하지 않는다.

실패한 조합은 `AUTO_APP_HANDOFF_TARGETS`에 넣지 않고 웹 상세와 명시적 앱 CTA를 유지한다.

## 테스트와 진단

자동화 검증은 다음 명령으로 실행한다.

```bash
npm test
npx tsc --noEmit
npm run build
```

`lib/appHandoff.test.ts`는 UA/플랫폼 allowlist, 외부·내부 진입, reload/back-forward, opt-out query와 딥링크 계약을 검증한다.

자동 시도 시 브라우저에 다음 custom event가 발생한다. 개발자 도구나 E2E 테스트에서 대상 조합과 ID를 확인할 수 있다.

```ts
window.addEventListener('tixx:app-handoff-attempt', (event) => {
  console.log((event as CustomEvent).detail);
});
```

세션 중 재시험하려면 개발자 도구에서 다음 값을 삭제하거나 새 인앱 브라우저 세션을 시작한다.

```js
sessionStorage.removeItem('tixx:auto-app-handoff-attempted');
```

문제가 발생하면 먼저 해당 target을 환경변수에서 제거한 뒤 UA, OS/앱 버전, 진입 URL, 설치 여부, `window.__TIXX_INITIAL_ENTRY__` 값을 기록한다.

## 주요 코드 위치

- `lib/appHandoff.ts`: 대상 판별, 진입 조건, 딥링크 생성 계약
- `components/detail/AppHandoff.tsx`: session guard와 iframe 실행·정리
- `app/(marketing)/layout.tsx`: 최초 문서 진입 정보 기록
- `app/(marketing)/open/`: 공유 gateway 라우트
- `lib/seo/detailMetadata.ts`: canonical과 gateway가 공유하는 metadata 생성
- `components/detail/ShareButton.tsx`: 공유 gateway URL 생성
