# ----------------------------
# Stage 1: deps
# ----------------------------
FROM node:22-slim AS deps

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy monorepo manifests
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY packages ./packages
COPY apps ./apps
COPY tooling ./tooling

# Install dependencies
RUN pnpm install --frozen-lockfile

# ----------------------------
# Stage 2: build
# ----------------------------
FROM deps AS build

WORKDIR /app/apps/dashboard

# Copy all from deps stage
COPY --from=deps /app /app

# Set default env vars so build doesn't break
ENV NEXT_PUBLIC_API_URL="https://example.com/api"
ENV DATABASE_URL="dummy"

# Build the dashboard app
RUN pnpm install
RUN pnpm build

# ----------------------------
# Stage 3: release
# ----------------------------
FROM node:22-slim AS release

WORKDIR /app/apps/dashboard

# Copy built app
COPY --from=build /app/apps/dashboard /app/apps/dashboard

# Install only production deps
RUN pnpm install --frozen-lockfile --prod

ENV NODE_ENV=production
EXPOSE 3000

CMD ["pnpm", "start"]
