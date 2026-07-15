# TIXX Marketing Site

Next.js marketing site for TIXX. Most pages (`/`, `/about`, `/app`, `/business`, `/promoters`, `/download`) are static content.

`/events/[id]` and `/hosts/[id]` are read-only, SEO-oriented mirrors of the mobile app's Event Detail / Host Detail screens — server-rendered per request against the live TIXX API, with no login/purchase/chat (those actions CTA out to the app). See `lib/api/`, `components/event-detail/`, `components/host-detail/`. `/sitemap.xml` and `/robots.txt` (`app/sitemap.ts`, `app/robots.ts`) list every event/host page so search engines can discover them — there are no other internal links into `/events/[id]` or `/hosts/[id]` yet.

## Getting Started

```bash
npm install
cp .env.example .env.local   # set TIXX_API_BASE_URL / SITE_URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If `.env`/`.env.local` doesn't set `TIXX_API_BASE_URL`, it defaults to the real `https://api.tixx.im` — don't point it at a local API instance unless that's actually running, or every event/host page (and the sitemap) will fail to fetch.

## Build

```bash
npm run build
npm run start
```

`next.config.ts` uses `output: 'standalone'` (not static export) — `/events/[id]` and `/hosts/[id]` fetch fresh data from the API on every request, which a static host (GitHub Pages, etc.) can't do.

## Deploying (Cloud Run)

Build and run the container locally:

```bash
docker build -t tixx-web .
docker run -p 8080:8080 \
  -e TIXX_API_BASE_URL=https://api.tixx.im \
  -e SITE_URL=https://tixx.im \
  tixx-web
```

Deploy target is **Cloud Run**, region **`asia-northeast1`** (Tokyo), service name **`tixx-web`**, custom domain **`tixx.im`**. Both env vars above are read server-side only, at request time — not baked into the image at build time — so the same image can be reused across environments without rebuilding.

> **Region note**: the service was originally in `asia-northeast3` (Seoul) and was moved to `asia-northeast1` (Tokyo) because Cloud Run domain mappings (custom domains) aren't supported in `asia-northeast3` — see "Custom domain" below. Tokyo adds negligible latency for Korean traffic.

> **Known issue**: `gcloud run deploy --source . --region asia-northeast1` reliably fails with `ERROR: ... Container import failed` (`ContainerImageImportFailed`) — this looks like a bug specific to the auto-created `asia-northeast1-docker.pkg.dev/.../cloud-run-source-deploy` Artifact Registry repo (confirmed: the identical image pulled from the pre-existing `asia-northeast3` repo deploys to `asia-northeast1` without issue). Until that's resolved upstream, build locally with `docker build` and push straight to the Seoul repo (same as `.github/workflows/deploy.yml` does — no Cloud Build involved anywhere in this project), then deploy that image to the Tokyo service:

```bash
gcloud auth configure-docker asia-northeast3-docker.pkg.dev

docker build -t asia-northeast3-docker.pkg.dev/tixx-449502/cloud-run-source-deploy/tixx-web:latest .
docker push asia-northeast3-docker.pkg.dev/tixx-449502/cloud-run-source-deploy/tixx-web:latest

gcloud run deploy tixx-web \
  --image asia-northeast3-docker.pkg.dev/tixx-449502/cloud-run-source-deploy/tixx-web:latest \
  --region asia-northeast1 \
  --allow-unauthenticated \
  --min-instances=0 \
  --max-instances=2 \
  --cpu=1 \
  --memory=512Mi \
  --set-env-vars TIXX_API_BASE_URL=https://api.tixx.im,SITE_URL=https://tixx.im
```

(If a future `gcloud`/Artifact Registry fix resolves the Tokyo repo import bug, `gcloud run deploy --source . --region asia-northeast1 ...` should work directly again — worth retrying periodically.)

Cost-minimizing choices, in case they need revisiting as traffic grows:
- `--min-instances=0`: scale-to-zero, no idle billing (trade-off: ~1-2s cold start on the first request after idle)
- `--max-instances=2`: hard cap on cost exposure from traffic spikes/abuse; raise if legitimate traffic needs more headroom
- `--cpu=1 --memory=512Mi`: minimum sane allocation for the standalone Next.js server; watch actual memory usage in the Cloud Run console before tuning down further
- CPU is billed "only while handling requests" by default (don't pass `--no-cpu-throttling`, which switches to always-on billing)

`TIXX_API_BASE_URL` calls happen server-side only (SSR), so the API's CORS allowlist is never involved. If the API server is reachable over an internal GCP network from the Cloud Run service, pointing `TIXX_API_BASE_URL` at that internal address instead of the public `api.tixx.im` avoids the public network hop entirely.

### Custom domain (`tixx.im`, `www.tixx.im`)

Mapped via Cloud Run's native domain mapping (`gcloud run domain-mappings create`), not a Global External Load Balancer + Serverless NEG — the LB path adds a fixed forwarding-rule cost (~$18-25/month) that isn't worth it at this traffic level; native mapping has no extra fixed cost and still gets a Google-managed TLS cert.

Native domain mappings are only supported in a subset of regions (`asia-east1`, `asia-northeast1`, `asia-southeast1`, `europe-north1`, `europe-west1`, `europe-west4`, `us-central1`, `us-east1`, `us-east4`, `us-west1` as of this writing) — **not** `asia-northeast3`, which is why the service lives in Tokyo.

1. Verify domain ownership once per Google account: `gcloud domains verify tixx.im` (opens a browser flow / Search Console)
2. `gcloud beta run domain-mappings create --service tixx-web --domain tixx.im --region asia-northeast1` — prints A/AAAA records to add at the apex
3. `gcloud beta run domain-mappings create --service tixx-web --domain www.tixx.im --region asia-northeast1` — prints a CNAME record for the `www` subdomain
4. Add those records at whatever registrar manages `tixx.im` (not automatable via `gcloud`) — apex records replace what used to point at GitHub Pages

Previously the site was served from GitHub Pages (this repo, static export) with `tixx.im`/`www.tixx.im` pointed at GitHub's IPs/`github.io`. That's been fully cut over to Cloud Run; GitHub Pages custom domain config is already cleared (`cname: null` via the Pages API).

### Budget alert

A monthly budget alert (Billing → Budgets & alerts in the GCP console) is the recommended safety net against unexpected cost — set one for a few dollars over the expected baseline. Creating it via `gcloud billing budgets create` requires a Billing Account Administrator/User role on the billing account itself (project Owner isn't sufficient); the console works with whatever access the logged-in user already has there.

### CI/CD

- `.github/workflows/nextjs.yml` (**Build check**) — runs lint + build on every push/PR. Doesn't deploy.
- `.github/workflows/deploy.yml` (**Deploy**) — on push to `main`, builds the Docker image, pushes it to the `asia-northeast3` Artifact Registry repo (see the region note above), and deploys it to the `tixx-web` Cloud Run service in `asia-northeast1`.

Deploy auth uses Workload Identity Federation, not a service account key:
- Service account: `gha-deployer-tixx-web@tixx-449502.iam.gserviceaccount.com`, scoped to just `roles/run.developer` (project), `roles/artifactregistry.writer` (on the `cloud-run-source-deploy` repo in `asia-northeast3` only), and `roles/iam.serviceAccountUser` (on the Cloud Run runtime service account `98342760010-compute@developer.gserviceaccount.com`) — deliberately kept separate from the pre-existing `github-actions-deployer` service account, which has `roles/compute.instanceAdmin.v1` for unrelated VM deploys; sharing it would let either pipeline's compromise reach the other's infrastructure.
- Workload Identity Pool `github-pool` / provider `github-provider`, with an attribute condition restricting it to `assertion.repository == 'TIXX-official/tixx.website'` — no other repo can impersonate this service account.

The manual deploy path (`docker build` + `docker push` + `gcloud run deploy`, above) still works and is useful for one-off deploys or debugging the pipeline itself. Nothing in this project uses Cloud Build.
