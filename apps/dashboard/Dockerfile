# ----------------------------
# Stage 1: deps
# ----------------------------
FROM node:22-slim AS deps
WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY packages ./packages
COPY apps ./apps
COPY tooling ./tooling

RUN pnpm install --frozen-lockfile

# ----------------------------
# Stage 2: build
# ----------------------------
FROM deps AS build
WORKDIR /app

COPY --from=deps /app /app

# Only build the dashboard app in a simple way
WORKDIR /app/apps/dashboard

# If env variables needed, set defaults so build doesn't break
ENV NEXT_PUBLIC_API_URL="https://example.com/api"
ENV DATABASE_URL="dummy"

RUN pnpm install
RUN pnpm build   # <- instead of turbo run build --filter=dashboard...
