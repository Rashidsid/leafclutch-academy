export type LearningMode = "online" | "hybrid" | "physical";

export interface CurriculumSection {
  title: string;
  points: string[];
}

/**
 * A lesson. New content uses `sections` (Lesson → 1.1 Section → points).
 * `topics` is the older flat format and is still displayed if present.
 */
export interface CurriculumModule {
  title: string;
  sections?: CurriculumSection[];
  topics?: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Installment {
  label: string;
  percent: number;
  note: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
}

export interface Mentor {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  expertise: string[];
  linkedin_url: string | null;
  is_published: boolean;
  sort_order: number;
  courses?: Pick<Course, "id" | "slug" | "title">[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category_id: string | null;
  category?: Category | null;
  description: string | null;
  fee: number;
  duration: string;
  level: string | null;
  modes: LearningMode[];
  badge: string | null;
  is_ai_integrated: boolean;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  icon: string | null;
  accent: string | null;
  thumbnail_url: string | null;
  tools: string[];
  outcomes: string[];
  prerequisites: string[];
  includes: string[];
  careers: string[];
  curriculum: CurriculumModule[];
  faqs: FaqItem[];
  installments: Installment[];
  seo_title: string | null;
  seo_description: string | null;
  created_at?: string | null;
  updated_at: string | null;
  mentors?: Mentor[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  organization: string | null;
  course_id: string | null;
  course?: Pick<Course, "id" | "slug" | "title"> | null;
  quote: string;
  rating: number;
  image_url: string | null;
  avatar_url: string | null;
  is_published: boolean;
  sort_order: number;
}

export type BatchStatus = "open" | "filling" | "full" | "closed";

export interface Batch {
  id: string;
  course_id: string;
  course?: Pick<Course, "id" | "slug" | "title" | "fee"> | null;
  title: string | null;
  start_date: string;
  mode: LearningMode;
  schedule: string | null;
  seats: number | null;
  status: BatchStatus;
  is_published: boolean;
}

export type ProgramAudience = "corporate" | "school" | "college" | "institution";

export interface Program {
  id: string;
  slug: string;
  title: string;
  audience: ProgramAudience;
  duration: string | null;
  summary: string | null;
  highlights: string[];
  icon: string | null;
  is_published: boolean;
  sort_order: number;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  is_published: boolean;
  sort_order: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  topic: string;
  is_published: boolean;
  sort_order: number;
}

export interface SiteSettings {
  site_name: string;
  tagline: string | null;
  announcement: string | null;
  hero_eyebrow: string | null;
  hero_title: string | null;
  hero_highlight: string | null;
  hero_subtitle: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  office_hours: string | null;
  map_embed_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  discord_url: string | null;
  certificate_image_url: string | null;
  stats: Stat[];
}

export interface CertificateResult {
  code: string;
  student_name: string;
  course_title: string;
  mode: string | null;
  issued_on: string;
  status: "valid" | "revoked";
}
