import "server-only";
import { cache } from "react";
import { EMPTY_SETTINGS } from "@/lib/defaults";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getPublicClient } from "@/lib/supabase/public";
import type {
  Batch,
  Category,
  CertificateResult,
  Course,
  Faq,
  Mentor,
  Partner,
  Program,
  SiteSettings,
  Testimonial,
} from "@/lib/types";

/*
 * Everything the website shows comes from Supabase. Until the env vars are set,
 * queries return empty results and pages show their empty states.
 */

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function logError(scope: string, error: unknown) {
  console.error(`[data:${scope}]`, error instanceof Error ? error.message : error);
}

type Row = Record<string, unknown>;

function normalizeCourse(row: Row): Course {
  const mentors = ((row.course_mentors as { mentor: Mentor | null }[] | undefined) ?? [])
    .map((cm) => cm.mentor)
    .filter((m): m is Mentor => Boolean(m && m.is_published))
    .sort((a, b) => a.sort_order - b.sort_order);
  const { course_mentors: _ignored, ...rest } = row;
  void _ignored;
  return {
    ...(rest as unknown as Course),
    fee: Number(row.fee ?? 0),
    tools: (row.tools as string[]) ?? [],
    outcomes: (row.outcomes as string[]) ?? [],
    prerequisites: (row.prerequisites as string[]) ?? [],
    includes: (row.includes as string[]) ?? [],
    careers: (row.careers as string[]) ?? [],
    curriculum: (row.curriculum as Course["curriculum"]) ?? [],
    faqs: (row.faqs as Course["faqs"]) ?? [],
    installments: (row.installments as Course["installments"]) ?? [],
    mentors,
  };
}

const COURSE_SELECT = "*, category:categories(*), course_mentors(mentor:mentors(*))";

/* ------------------------------------------------------------------ */
/* Public queries                                                      */
/* ------------------------------------------------------------------ */

export const getSettings = cache(async (): Promise<SiteSettings> => {
  if (!isSupabaseConfigured) return EMPTY_SETTINGS;
  const { data, error } = await getPublicClient().from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) {
    if (error) logError("settings", error);
    return EMPTY_SETTINGS;
  }
  return { ...EMPTY_SETTINGS, ...data, stats: (data.stats as SiteSettings["stats"]) ?? [] };
});

export const getCategories = cache(async (): Promise<Category[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await getPublicClient().from("categories").select("*").order("sort_order");
  if (error) logError("categories", error);
  return (data as Category[]) ?? [];
});

export const getCourses = cache(async (): Promise<Course[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await getPublicClient()
    .from("courses")
    .select(COURSE_SELECT)
    .eq("is_published", true)
    .order("sort_order")
    .order("title");
  if (error) logError("courses", error);
  return (data ?? []).map(normalizeCourse);
});

export const getCourseBySlug = cache(async (slug: string): Promise<Course | null> => {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await getPublicClient()
    .from("courses")
    .select(COURSE_SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) logError("course", error);
  return data ? normalizeCourse(data) : null;
});

export const getMentors = cache(async (): Promise<Mentor[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await getPublicClient()
    .from("mentors")
    .select("*, course_mentors(course:courses(id, slug, title, is_published))")
    .eq("is_published", true)
    .order("sort_order");
  if (error) logError("mentors", error);
  return (data ?? []).map((row) => {
    const { course_mentors, ...rest } = row as Row & {
      course_mentors: { course: (Course & { is_published: boolean }) | null }[];
    };
    return {
      ...(rest as unknown as Mentor),
      expertise: (rest.expertise as string[]) ?? [],
      courses: (course_mentors ?? [])
        .map((cm) => cm.course)
        .filter((c): c is Course => Boolean(c && c.is_published))
        .map(({ id, slug, title }) => ({ id, slug, title })),
    };
  });
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await getPublicClient()
    .from("testimonials")
    .select("*, course:courses(id, slug, title)")
    .eq("is_published", true)
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) logError("testimonials", error);
  return (data as Testimonial[]) ?? [];
});

export const getFaqs = cache(async (): Promise<Faq[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await getPublicClient().from("faqs").select("*").eq("is_published", true).order("sort_order");
  if (error) logError("faqs", error);
  return (data as Faq[]) ?? [];
});

/** Upcoming published batches, soonest first. */
export const getBatches = cache(async (): Promise<Batch[]> => {
  if (!isSupabaseConfigured) return [];
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await getPublicClient()
    .from("batches")
    .select("*, course:courses(id, slug, title, fee, is_published)")
    .eq("is_published", true)
    .neq("status", "closed")
    .gte("start_date", today)
    .order("start_date");
  if (error) logError("batches", error);
  return ((data ?? []) as (Batch & { course: { is_published: boolean } | null })[]).filter(
    (b) => b.course?.is_published,
  );
});

export const getPrograms = cache(async (): Promise<Program[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await getPublicClient().from("programs").select("*").eq("is_published", true).order("sort_order");
  if (error) logError("programs", error);
  return ((data as Program[]) ?? []).map((p) => ({ ...p, highlights: p.highlights ?? [] }));
});

export const getPartners = cache(async (): Promise<Partner[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await getPublicClient().from("partners").select("*").eq("is_published", true).order("sort_order");
  if (error) logError("partners", error);
  return (data as Partner[]) ?? [];
});

export async function verifyCertificate(code: string): Promise<CertificateResult | null> {
  if (!isSupabaseConfigured || !code.trim()) return null;
  const { data, error } = await getPublicClient().rpc("verify_certificate", { p_code: code.trim() });
  if (error) {
    logError("certificate", error);
    return null;
  }
  return ((data as CertificateResult[]) ?? [])[0] ?? null;
}

/** Average rating and count from published testimonials, per course id. */
export function ratingsByCourse(testimonials: Testimonial[]) {
  const map = new Map<string, { total: number; count: number }>();
  for (const t of testimonials) {
    if (!t.course_id) continue;
    const r = map.get(t.course_id) ?? { total: 0, count: 0 };
    r.total += t.rating;
    r.count += 1;
    map.set(t.course_id, r);
  }
  return new Map([...map].map(([id, r]) => [id, { average: r.total / r.count, count: r.count }]));
}
