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

Build and run the container:

```bash
docker build -t tixx-web .
docker run -p 8080:8080 \
  -e TIXX_API_BASE_URL=https://api.tixx.im \
  -e SITE_URL=https://<your-domain> \
  tixx-web
```

Deploy target is **Cloud Run**. Both env vars above are read server-side only, at request time — not baked into the image at build time — so the same image can be pushed to `gcloud run deploy` for any environment (dev/staging/prod) without rebuilding:

```bash
gcloud run deploy tixx-web \
  --source . \
  --region <region> \
  --set-env-vars TIXX_API_BASE_URL=https://api.tixx.im,SITE_URL=https://<your-domain> \
  --allow-unauthenticated
```

`TIXX_API_BASE_URL` calls happen server-side only (SSR), so the API's CORS allowlist is never involved. If the API server is reachable over an internal GCP network from the Cloud Run service, pointing `TIXX_API_BASE_URL` at that internal address instead of the public `api.tixx.im` avoids the public network hop entirely.

The GitHub Actions workflow (`.github/workflows/nextjs.yml`) currently only runs lint + build as a CI check — it doesn't deploy. Wiring an actual `gcloud run deploy` step into CI needs the target project/region/service name plus a service account or Workload Identity Federation setup, none of which is configured yet.
