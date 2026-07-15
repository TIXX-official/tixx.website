# Multi-stage build producing a Next.js "standalone" server image.
# Works on Cloud Run as-is; also runnable on a plain VM via `docker run`.

FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# TIXX_API_BASE_URL is read at runtime for /events/[id] and /hosts/[id]
# (SSR, re-read on every request) and for /sitemap.xml's hourly ISR
# revalidation — no --build-arg needed: if unset in this build stage it
# falls back to the real api.tixx.im default in lib/api/client.ts, which is
# already correct for production.
#
# SITE_URL doesn't get the same free pass. sitemap.ts/robots.ts need it to
# emit absolute URLs (Search Console rejects relative ones), and if it's
# unset during `next build` that gets baked into /sitemap.xml's first
# prerendered snapshot. Normally the hourly ISR revalidate would fix that
# once the container is live and reading the real runtime env var — but
# Cloud Run runs this service with --min-instances=0, so low-traffic
# containers routinely get recycled before an hour passes, and the broken
# build-time snapshot never self-heals. So, unlike TIXX_API_BASE_URL, it's
# ALSO supplied as a --build-arg here for a correct first snapshot. It's
# still not NEXT_PUBLIC_-prefixed, so this doesn't get inlined into
# client-side JS — it's read server-side same as always, just seeded
# correctly at build time too instead of relying solely on runtime env vars.
ARG SITE_URL
ENV SITE_URL=$SITE_URL
#
# NEXT_PUBLIC_NAVER_MAP_CLIENT_ID is different again: Next.js inlines
# NEXT_PUBLIC_* vars into the client bundle at build time, so it MUST be
# supplied as a --build-arg, not a runtime env var. A missing value bakes in
# `undefined`, which NaverMap.tsx treats as "unset" and falls back to the
# keyless OSM embed; it doesn't error, but the map silently stays static.
# Since it's compiled in, one image can no longer be reused with a
# different value — a real value change needs a rebuild.
ARG NEXT_PUBLIC_NAVER_MAP_CLIENT_ID
ENV NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=$NEXT_PUBLIC_NAVER_MAP_CLIENT_ID
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Cloud Run injects $PORT at runtime and overrides this default; 8080 is
# Cloud Run's conventional default for local `docker run` testing.
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"
EXPOSE 8080

CMD ["node", "server.js"]
