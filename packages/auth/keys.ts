import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      AUTH_SECRET: z.string().min(1),
      AUTH_GOOGLE_CLIENT_ID: z.string().min(1),
      AUTH_GOOGLE_CLIENT_SECRET: z.string().min(1),
      AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID: z.string().min(1),
      AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET: z.string().min(1),
      EMAIL_RESEND_API_KEY: z.string().min(1),
      EMAIL_FROM: z.string().min(1),
    },
    runtimeEnv: {
      AUTH_SECRET: process.env.AUTH_SECRET,
      AUTH_GOOGLE_CLIENT_ID: process.env.AUTH_GOOGLE_CLIENT_ID,
      AUTH_GOOGLE_CLIENT_SECRET: process.env.AUTH_GOOGLE_CLIENT_SECRET,
      AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID: process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID,
      AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET: process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET,
      EMAIL_RESEND_API_KEY: process.env.EMAIL_RESEND_API_KEY,
      EMAIL_FROM: process.env.EMAIL_FROM,
    }
  });