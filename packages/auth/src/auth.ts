import { db } from "@workspace/db/client";
import { env } from "@workspace/env";
import { magicLink, oAuthProxy } from "better-auth/plugins"
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Resend } from "resend";


const resend = new Resend(env.EMAIL_RESEND_API_KEY);

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin;
  return env.NODE_ENV === "production" ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : `http://localhost:3000`;
};

export const config = {
    database: drizzleAdapter(db, {
        provider: "pg"
    }),
    secret: env.AUTH_SECRET,
    session: {
    expiresIn: 60 * 60 * 24,
  },
  user: {
    additionalFields: {
      completedOnboarding: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
    },
  },
    plugins: [
		magicLink({
			async sendMagicLink(data) {
				console.log({
					data,
				});
				await resend.emails.send({
					from: env.EMAIL_FROM!,
					to: data.email,
					subject: "Sign in to Better Auth",
					html: `
						<p>Click the link below to sign in to Better Auth:</p>
						<a href="${data.url}">Sign in</a>
					`,
				});
			},
		}),
      oAuthProxy()
    ],
    socialProviders: {
        google: {
            clientId: env.AUTH_GOOGLE_CLIENT_ID!,
            clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET!,
            redirectURI: `${getBaseUrl()}/api/auth/callback/google`,
        },
        microsoft: {
            clientId: env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID!,
            clientSecret: env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET!,
            redirectURI: `${getBaseUrl()}/organizations`,
        },
    },
    onAPIError: {
      onError(error, ctx) {
        console.error("BETTER AUTH API ERROR", error, ctx);
      },
    },
} satisfies BetterAuthOptions

export const auth = betterAuth(config);

type BaseSession = typeof auth.$Infer.Session;

export type Session = {
  session: BaseSession['session'];
  user: Omit<BaseSession['user'], 'completedOnboarding'> & Partial<{
    completedOnboarding: boolean | null;
  }>;
};


