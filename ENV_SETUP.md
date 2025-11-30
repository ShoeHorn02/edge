# Environment Variables Setup

This monorepo uses a **centralized environment variable management system** to ensure consistency and type safety across all packages and applications.

## Overview

All environment variables are:

- ✅ Defined once in the root `.env` file
- ✅ Validated with Zod schemas in `@workspace/env`
- ✅ Type-safe and auto-completed in your IDE
- ✅ Available across all packages and apps

## Architecture

```
edge/
├── .env                          # Single source of truth for all env vars
├── packages/
│   └── env/                      # Centralized env validation package
│       └── src/
│           └── index.ts          # Zod schemas + validation
└── apps/
    └── dashboard/
        └── next.config.mjs       # Loads root .env file
```

## How It Works

### 1. Root `.env` File

All environment variables are defined in `/edge/.env`:

```env
# Database
DATABASE_URL='postgresql://...'

# Auth
AUTH_SECRET='...'
AUTH_GOOGLE_CLIENT_ID='...'
AUTH_GOOGLE_CLIENT_SECRET='...'

# Email
EMAIL_RESEND_API_KEY='...'
EMAIL_FROM='noreply@example.com'

# Environment
NODE_ENV='development'
```

### 2. Centralized Validation (`@workspace/env`)

The `packages/env` package validates all environment variables using `@t3-oss/env-nextjs` and Zod:

```typescript
import { env } from "@workspace/env";

// ✅ Type-safe and validated
const dbUrl = env.DATABASE_URL;
const secret = env.AUTH_SECRET;
```

**Key Features:**

- **Type Safety**: Full TypeScript support with autocomplete
- **Runtime Validation**: Validates env vars on startup
- **Clear Error Messages**: Shows exactly which env vars are missing or invalid
- **Optional Variables**: Supports optional env vars with `.optional()`
- **Client/Server Separation**: Prevents accidentally exposing server secrets to the client

### 3. Usage in Packages

All packages (`db`, `auth`, `api`) import from `@workspace/env`:

```typescript
// packages/db/src/client.ts
import { env } from "@workspace/env";

const sql = neon(env.DATABASE_URL);
```

```typescript
// packages/auth/src/auth.ts
import { env } from "@workspace/env";

export const config = {
  secret: env.AUTH_SECRET,
  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
    },
  },
};
```

### 4. Next.js Integration

The dashboard app's `next.config.mjs` automatically loads the root `.env` file:

```javascript
import { config } from "dotenv";
config({ path: join(__dirname, "../../.env") });
```

This ensures environment variables are available during:

- Development (`pnpm dev`)
- Build time (`pnpm build`)
- Runtime (production)

## Adding New Environment Variables

### Step 1: Add to Root `.env`

```env
# Add your new variable
MY_NEW_API_KEY='your-key-here'
```

### Step 2: Add to `packages/env/src/index.ts`

```typescript
export const env = createEnv({
  server: {
    // ... existing vars
    MY_NEW_API_KEY: z.string().min(1), // Required
    // OR
    MY_OPTIONAL_VAR: z.string().optional(), // Optional
  },

  runtimeEnv: {
    // ... existing mappings
    MY_NEW_API_KEY: process.env.MY_NEW_API_KEY,
    MY_OPTIONAL_VAR: process.env.MY_OPTIONAL_VAR,
  },
});
```

### Step 3: Add to `turbo.json` (if needed for caching)

```json
{
  "globalEnv": [
    "DATABASE_URL",
    "AUTH_SECRET",
    "MY_NEW_API_KEY" // Add here
  ]
}
```

### Step 4: Use in Your Code

```typescript
import { env } from "@workspace/env";

const apiKey = env.MY_NEW_API_KEY;
```

## Client-Side Environment Variables

For variables that need to be exposed to the browser:

### Step 1: Prefix with `NEXT_PUBLIC_`

```env
NEXT_PUBLIC_APP_URL='https://example.com'
```

### Step 2: Add to `client` Schema

```typescript
export const env = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },

  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
```

⚠️ **Warning**: Never put secrets in `NEXT_PUBLIC_*` variables - they're exposed to the browser!

## Environment-Specific Files

You can create environment-specific files:

```
.env                 # Default values (committed to git with dummy values)
.env.local          # Local overrides (gitignored)
.env.development    # Development-specific
.env.production     # Production-specific
```

**Load Order** (later files override earlier ones):

1. `.env`
2. `.env.local`
3. `.env.development` or `.env.production`
4. `.env.development.local` or `.env.production.local`

## Skipping Validation

For CI/CD environments where env vars aren't available during build:

```bash
SKIP_ENV_VALIDATION=true pnpm build
```

## Troubleshooting

### Build Fails with "Invalid environment variables"

**Problem**: Environment variables are not being loaded.

**Solutions**:

1. Ensure `.env` file exists at the root
2. Check that `next.config.mjs` loads the root `.env`
3. Verify the env var is added to `packages/env/src/index.ts`
4. Make sure `@workspace/env` is in `transpilePackages` in `next.config.mjs`

### TypeScript Can't Find `@workspace/env`

**Problem**: Module not found error.

**Solutions**:

1. Run `pnpm install` to ensure the package is linked
2. Rebuild the env package: `pnpm --filter @workspace/env build`
3. Restart your TypeScript server in your IDE

### Environment Variable is Undefined at Runtime

**Problem**: `env.MY_VAR` is undefined.

**Solutions**:

1. Check the variable is in `.env`
2. Verify it's mapped in `runtimeEnv` in `packages/env/src/index.ts`
3. Restart your dev server
4. For production, ensure the variable is set in your hosting environment

## Best Practices

1. ✅ **Never commit secrets** - Use `.env.local` for local secrets
2. ✅ **Use descriptive names** - `AUTH_GOOGLE_CLIENT_ID` not `GOOGLE_ID`
3. ✅ **Group related vars** - Use comments to organize
4. ✅ **Validate strictly** - Use specific Zod validators (`.url()`, `.email()`, etc.)
5. ✅ **Document required vars** - Add comments in `.env.example`
6. ✅ **Use optional() sparingly** - Most env vars should be required
7. ✅ **Keep client vars minimal** - Only expose what's absolutely necessary

## Migration from Old Setup

The old setup used:

- ❌ `packages/db/keys.js` - JavaScript file with no types
- ❌ Separate env validation in each package
- ❌ Inconsistent env var access

The new setup provides:

- ✅ Single source of truth (`@workspace/env`)
- ✅ Full TypeScript support
- ✅ Centralized validation
- ✅ Better error messages
- ✅ Easier to maintain

## Example: Complete Flow

1. **Add to `.env`**:

   ```env
   STRIPE_SECRET_KEY='sk_test_...'
   ```

2. **Add to `packages/env/src/index.ts`**:

   ```typescript
   server: {
     STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
   },
   runtimeEnv: {
     STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
   },
   ```

3. **Use in your code**:

   ```typescript
   import { env } from "@workspace/env";

   const stripe = new Stripe(env.STRIPE_SECRET_KEY);
   ```

4. **Build and run**:
   ```bash
   pnpm build  # ✅ Validates env vars
   pnpm dev    # ✅ Type-safe access
   ```

## Resources

- [@t3-oss/env-nextjs Documentation](https://env.t3.gg/)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Zod Documentation](https://zod.dev/)
