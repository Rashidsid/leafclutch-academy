import type { Installment, SiteSettings } from "./types";

/** Used only if the site_settings row is missing. Everything real comes from Supabase. */
export const EMPTY_SETTINGS: SiteSettings = {
  site_name: "Leafclutch Academy",
  tagline: null,
  announcement: null,
  hero_eyebrow: null,
  hero_title: null,
  hero_highlight: null,
  hero_subtitle: null,
  phone: null,
  whatsapp: null,
  email: null,
  address: null,
  office_hours: null,
  map_embed_url: null,
  facebook_url: null,
  instagram_url: null,
  linkedin_url: null,
  tiktok_url: null,
  youtube_url: null,
  discord_url: null,
  certificate_image_url: null,
  stats: [],
};

/** Pre-filled payment plan when an admin creates a new course (editable in the form). */
export const NEW_COURSE_INSTALLMENTS: Installment[] = [
  { label: "First installment", percent: 50, note: "Payable at enrollment" },
  { label: "Second installment", percent: 50, note: "Payable when you are promoted to the internship" },
];
