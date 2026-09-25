/**
 * Public site address for SEO links, the sitemap and share previews.
 * Set NEXT_PUBLIC_SITE_URL once you have a custom domain; until then Vercel's
 * own production address (….vercel.app) is used automatically.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  "http://localhost:3000"
).replace(/\/$/, "");

export const NAV_LINKS = [
  { href: "/courses", label: "Courses" },
  { href: "/schedule", label: "Upcoming Courses" },
  { href: "/corporate", label: "Corporate" },
  { href: "/mentors", label: "Mentors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** How often public pages refresh from Supabase (seconds). Admin saves refresh them immediately. */
export const REVALIDATE_SECONDS = 300;
