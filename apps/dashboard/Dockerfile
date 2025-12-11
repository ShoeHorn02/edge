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

# Set ARGs for build-time variables (passed by GitHub Actions)
# These are needed to satisfy the Next.js/build requirements.
ARG NEXT_PUBLIC_API_URL
ARG DATABASE_URL

# Set ENV variables from ARGs for the build process
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV DATABASE_URL=${DATABASE_URL}

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
# Set placeholders for runtime ENVs. DigitalOcean will override these with secrets.
ENV DATABASE_URL=dummy
ENV AUTH_SECRET=dummy

EXPOSE 3000

CMD ["pnpm", "start"]