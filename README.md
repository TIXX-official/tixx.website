# TIXX Marketing Site

Next.js marketing site for TIXX. Most pages (`/`, `/about`, `/app`, `/business`, `/promoters`, `/download`) are static content.

`/events/[id]` and `/hosts/[id]` are read-only, SEO-oriented mirrors of the mobile app's Event Detail / Host Detail screens — server-rendered per request against the live TIXX API, with no login/purchase/chat (those actions CTA out to the app). See `lib/api/`, `components/event-detail/`, `components/host-detail/`.

## Getting Started

```bash
npm install
cp .env.example .env.local   # set TIXX_API_BASE_URL / NEXT_PUBLIC_SITE_URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

`next.config.ts` uses `output: 'standalone'` (not static export) — `/events/[id]` and `/hosts/[id]` fetch fresh data from the API on every request, which a static host (GitHub Pages, etc.) can't do.

## Deploying

Build and run the container:

```bash
docker build -t tixx-web .
docker run -p 8080:8080 \
  -e TIXX_API_BASE_URL=https://api.tixx.im \
  -e NEXT_PUBLIC_SITE_URL=https://<your-domain> \
  tixx-web
```

This image runs unmodified on Cloud Run or any container host. `TIXX_API_BASE_URL` calls happen server-side only (SSR), so the API's CORS allowlist is never involved.

The GitHub Actions workflow (`.github/workflows/nextjs.yml`) currently only runs lint + build as a CI check — it no longer deploys anywhere. Wire up an actual deploy step once the hosting target (Cloud Run vs. existing GCP VM) is decided.
