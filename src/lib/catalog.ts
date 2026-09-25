import { hasVariablePricing, lowestPrice, type ModePrice } from "./pricing";
import type { Course } from "./types";

/** Items ranked by how many courses mention them (ties keep catalogue order). */
function rank(courses: Course[], pick: (c: Course) => string[], limit: number) {
  const counts = new Map<string, number>();
  for (const c of courses) for (const item of pick(c)) counts.set(item, (counts.get(item) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => name);
}

export const topCareers = (courses: Course[], limit = 8) => rank(courses, (c) => c.careers, limit);
export const topSkills = (courses: Course[], limit = 10) => rank(courses, (c) => c.tools, limit);

export const coursesForCareer = (courses: Course[], career: string) => courses.filter((c) => c.careers.includes(career));

export const popularCourses = (courses: Course[]) =>
  [...courses].sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || Number(b.badge === "Popular") - Number(a.badge === "Popular"));

export const newCourses = (courses: Course[]) =>
  [...courses].sort(
    (a, b) =>
      Number(b.badge === "New") - Number(a.badge === "New") ||
      (b.updated_at ?? "").localeCompare(a.updated_at ?? ""),
  );

/** Courses for a career, topped up with same-category courses so a tab always has a full row. */
export function coursesForCareerFilled(courses: Course[], career: string, size = 4) {
  const direct = coursesForCareer(courses, career);
  const categories = new Set(direct.map((c) => c.category_id));
  const related = courses.filter((c) => !direct.includes(c) && categories.has(c.category_id));
  return [...direct, ...related].slice(0, size);
}

export const beginnerFriendly = (c: Course) => (c.level ?? "").toLowerCase().includes("beginner");

/** Minimal course shape sent to client components (menus, search, tabs). */
export type CourseLite = Pick<
  Course,
  "id" | "slug" | "title" | "subtitle" | "icon" | "accent" | "thumbnail_url" | "tools" | "is_ai_integrated" | "badge" | "level" | "duration" | "fee" | "category_id"
> & { category: string | null; start_percent: number | null; price_from: ModePrice; variable_pricing: boolean };

export function toLite(c: Course): CourseLite {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    subtitle: c.subtitle,
    icon: c.icon,
    accent: c.accent,
    thumbnail_url: c.thumbnail_url,
    tools: c.tools,
    is_ai_integrated: c.is_ai_integrated,
    badge: c.badge,
    level: c.level,
    duration: c.duration,
    fee: c.fee,
    category_id: c.category_id,
    category: c.category?.name ?? null,
    start_percent: c.installments[0]?.percent ?? null,
    price_from: lowestPrice(c),
    variable_pricing: hasVariablePricing(c),
  };
}
