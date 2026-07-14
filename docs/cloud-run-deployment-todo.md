# Cloud Run 배포 — 남은 수동 작업

`tixx-web` 서비스는 이미 Cloud Run(`asia-northeast3`)에 배포되어 있음:
`https://tixx-web-98342760010.asia-northeast3.run.app`

아래는 GCP 콘솔/도메인 등록기관 접근이 필요해 **직접 진행해야 하는** 남은 작업들.

## 1. `tixx.im` 도메인 소유권 인증 확인/재진행

- **현재 상태**: `gcloud domains verify tixx.im`을 실행했으나, `gcloud`가 인증된 `tjsrms1227@gmail.com` 계정 기준으로는 `tixx.im`이 인증된 도메인 목록(`gcloud domains list-user-verified`)에 없음. 브라우저 인증 과정에서 다른 구글 계정(예: 프로젝트에 접근 권한이 있는 `tixxofficial@tixx.im` 등)으로 로그인되어 있었을 가능성이 큼.
- **해야 할 일**:
  - 실제 어떤 구글 계정으로 인증했는지 확인
  - `tjsrms1227@gmail.com`으로 도메인 매핑을 생성하려면, 그 계정으로 다시 인증: `gcloud domains verify tixx.im` 실행 시 브라우저에서 **`tjsrms1227@gmail.com`으로 로그인된 상태인지 확인**
  - 또는 이미 인증된 계정이 있다면 `gcloud config set account <해당 계정>`으로 전환 후 매핑 생성 진행

## 2. Cloud Run 도메인 매핑 생성 + DNS 레코드 등록 (후이즈)

도메인 인증이 확인되면 실행:

```bash
gcloud beta run domain-mappings create \
  --service tixx-web \
  --domain tixx.im \
  --region asia-northeast3 \
  --project tixx-449502
```

- 출력되는 A/AAAA 레코드를 **후이즈(whois.co.kr) 도메인 관리 콘솔**에서 등록
- **주의**: 현재 `tixx.im` apex는 GitHub Pages A/AAAA 레코드(`185.199.108~111.153`)로 연결되어 있고, GitHub Pages가 이 저장소(`TIXX-official/tixx.website`)의 이전 정적 배포본을 서빙 중(`cname: tixx.im`, HTTPS 인증서 발급 완료 상태). 레코드를 Cloud Run이 안내하는 값으로 **교체**해야 하며, 이 시점부터 GitHub Pages 서빙은 중단됨 — 이번 마이그레이션의 의도된 결과.
- `api.tixx.im`, `app.tixx.im` 등 다른 서브도메인은 별도 VM에서 서비스 중이라 이번 변경과 무관, 손대지 않음

## 3. GitHub Pages 정리 (선택)

DNS가 Cloud Run으로 넘어간 뒤, 저장소 Settings → Pages에서 커스텀 도메인 설정을 해제하는 걸 권장 (안 해도 트래픽엔 영향 없지만, 나중에 헷갈릴 수 있어 정리 차원).

## 4. 예산 알림(Budget alert) 설정

GCP 콘솔 → 결제 → 예산 및 알림에서 직접 생성 필요.
- `gcloud billing budgets create`는 `tjsrms1227@gmail.com` 계정에 **결제 계정(billing account) 권한**이 없어 403으로 실패함 (프로젝트 Owner 권한과는 별개) — 콘솔에서 로그인된 세션의 권한으로 진행하거나, 결제 계정 관리자에게 Billing Account Administrator/User 역할을 요청
- 권장: 월 $10 기준, 50%/90%/100% 임계값 알림

## 참고: 이미 완료된 작업

- Cloud Build API 활성화 + 기본 Compute 서비스 계정에 `roles/cloudbuild.builds.builder` 부여
- Cloud Run 배포 (`tixx-web`, `asia-northeast3`, `--min-instances=0 --max-instances=2 --cpu=1 --memory=512Mi`)
- 배포 검증: SSR 렌더링, `/sitemap.xml`, `/robots.txt`, 404 처리, OG 태그(`SITE_URL` 반영) 확인 완료
- `README.md`의 "Deploying (Cloud Run)" 섹션을 실제 배포 설정으로 갱신
