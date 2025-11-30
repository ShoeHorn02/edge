import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

/**
 * Centralized environment variable validation for the entire monorepo.
 * This ensures all packages and apps use the same validated environment variables.
 */
export const env = createEnv({
  /**
   * Server-side environment variables schema.
   * These are only available on the server and will never be exposed to the client.
   */
  server: {
    // Database
    DATABASE_URL: z.string().min(1).url(),
    
    // Auth
    AUTH_SECRET: z.string().min(1),
    AUTH_GOOGLE_CLIENT_ID: z.string().min(1).optional(),
    AUTH_GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
    AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID: z.string().min(1).optional(),
    AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET: z.string().min(1).optional(),
    
    // Email
    EMAIL_RESEND_API_KEY: z.string().min(1).optional(),
    EMAIL_FROM: z.string().email().optional(),
    
    // Node Environment
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  },

  /**
   * Client-side environment variables schema.
   * These will be exposed to the client, so never put secrets here!
   * They must be prefixed with NEXT_PUBLIC_
   */
  client: {
    // Add client-side env vars here when needed
    // NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  },

  /**
   * Runtime environment variables mapping.
   * This tells the library where to find the actual values.
   */
  runtimeEnv: {
    // Server
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GOOGLE_CLIENT_ID: process.env.AUTH_GOOGLE_CLIENT_ID,
    AUTH_GOOGLE_CLIENT_SECRET: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID: process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID,
    AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET: process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET,
    EMAIL_RESEND_API_KEY: process.env.EMAIL_RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    NODE_ENV: process.env.NODE_ENV,
    
    // Client (add when needed)
    // NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  /**
   * Skip validation during build if needed.
   * Set to true in CI/CD environments where env vars might not be available during build.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Makes it so that empty strings are treated as undefined.
   * Useful for optional environment variables.
   */
  emptyStringAsUndefined: true,
});
