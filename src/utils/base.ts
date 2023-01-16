// Fix for windows, should be reverted for production
export const BASEURL = process.env.BASE
  ? `https://${process.env.BASE}` // SSR should use vercel url
  : `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
