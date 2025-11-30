import { env } from "@workspace/env";

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin;
  return env.NODE_ENV === "production" ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : `http://localhost:3000`;
};