# ----------------------------
# 1. Base Builder (Node 22 + PNPM)
# ----------------------------
FROM node:22-slim AS base
RUN npm install -g pnpm

# ----------------------------
# 2. Install Dependencies
# ----------------------------
FROM base AS deps
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY packages ./packages
COPY apps ./apps

RUN pnpm install --frozen-lockfile

# ----------------------------
# 3. Build all Turborepo packages
# ----------------------------
FROM base AS build
WORKDIR /app
COPY --from=deps /app /app

# Build everything including Next.js "dashboard"
RUN pnpm turbo run build --filter=dashboard...

# ----------------------------
# 4. Production Runner for Next.js (Standalone Output)
# ----------------------------
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy the Next.js server (standalone)
COPY --from=build /app/apps/dashboard/.next/standalone ./
COPY --from=build /app/apps/dashboard/.next/static ./apps/dashboard/.next/static
COPY --from=build /app/apps/dashboard/public ./apps/dashboard/public

EXPOSE 3000
CMD ["node", "apps/dashboard/server.js"]
