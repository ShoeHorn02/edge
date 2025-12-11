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

# Accept build-time environment variables
ARG NEXT_PUBLIC_API_URL
ARG DATABASE_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV DATABASE_URL=$DATABASE_URL

# Build apps (dashboard)
RUN pnpm turbo run build --filter=dashboard...

# ----------------------------
# Stage 3: release
# ----------------------------
FROM node:22-slim AS release
WORKDIR /app

COPY --from=build /app /app

RUN pnpm install --frozen-lockfile --prod

ENV NODE_ENV=production
EXPOSE 3000

WORKDIR /app/apps/dashboard
CMD ["pnpm", "start"]
