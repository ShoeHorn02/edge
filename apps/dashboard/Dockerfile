# ----------------------------
# Stage 1: deps
# ----------------------------
FROM node:22-slim AS deps

WORKDIR /app

# Install pnpm
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

WORKDIR /app

# Copy installed deps
COPY --from=deps /app /app

# Build apps (dashboard)
# Make sure your build scripts can handle missing .env (use defaults or NEXT_PUBLIC_*)
RUN pnpm turbo run build --filter=dashboard...

# ----------------------------
# Stage 3: release
# ----------------------------
FROM node:22-slim AS release

WORKDIR /app

# Copy built files from build stage
COPY --from=build /app /app

# Install only production deps
RUN pnpm install --frozen-lockfile --prod

ENV NODE_ENV=production
EXPOSE 3000

WORKDIR /app/apps/dashboard
CMD ["pnpm", "start"]
