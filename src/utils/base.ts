// Fix for windows, should be reverted for production
export const BASEURL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  : `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
