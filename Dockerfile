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
# TIXX_API_BASE_URL / SITE_URL are read at runtime for /events/[id] and
# /hosts/[id] (SSR, re-read on every request) and for /sitemap.xml's hourly
# ISR revalidation — no --build-arg needed for those. The one exception is
# /sitemap.xml's *first* prerendered snapshot, generated right now during
# `next build`: since neither env var is set in this build stage, it falls
# back to the real api.tixx.im default in lib/api/client.ts, which is fine
# for the real API but means a local override wouldn't apply until the
# first revalidation after the container starts.
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
