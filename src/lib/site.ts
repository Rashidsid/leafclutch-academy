export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const NAV_LINKS = [
  { href: "/courses", label: "Courses" },
  { href: "/schedule", label: "Upcoming Classes" },
  { href: "/corporate", label: "Corporate" },
  { href: "/mentors", label: "Mentors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** How often public pages refresh from Supabase (seconds). Admin saves refresh them immediately. */
export const REVALIDATE_SECONDS = 300;
