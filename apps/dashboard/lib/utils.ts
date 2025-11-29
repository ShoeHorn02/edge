export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin;
  return process.env.NODE_ENV === "production" ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3000}`;
};