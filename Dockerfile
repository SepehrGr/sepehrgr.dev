# ---------- Stage 1: install dependencies ----------
FROM node:22-alpine AS deps
WORKDIR /app
# Copy ONLY the package files first. If they haven't changed, Docker reuses
# the cached "npm ci" layer and skips reinstalling (much faster rebuilds).
COPY package.json package-lock.json ./
RUN npm ci

# ---------- Stage 2: build the app ----------
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- Stage 3: the small image that actually runs ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Run as a normal user, not root, so a compromised app has fewer powers
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

# Next.js writes its image-optimization cache here, so the user needs write access
RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]