import "server-only";
import type { UdemyCourse } from "./types";

/** Normalises and validates a Udemy course link; only https://www.udemy.com/course/<slug>/ is accepted. */
export function normalizeUdemyUrl(input: string): string | null {
  try {
    const url = new URL(input.trim());
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || !(host === "udemy.com" || host.endsWith(".udemy.com"))) return null;
    const match = url.pathname.match(/^\/course\/([a-z0-9-]+)\/?/i);
    if (!match) return null;
    return `https://www.udemy.com/course/${match[1]!.toLowerCase()}/`;
  } catch {
    return null;
  }
}

/** ISO-8601 duration (PT99H48M) → hours, rounded to the nearest half hour. */
function durationHours(iso: unknown): number | null {
  if (typeof iso !== "string") return null;
  const m = iso.match(/P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/);
  if (!m) return null;
  const hours = Number(m[1] ?? 0) * 24 + Number(m[2] ?? 0) + Number(m[3] ?? 0) / 60;
  return hours > 0 ? Math.round(hours * 2) / 2 : null;
}

type Json = Record<string, unknown>;

function findCourse(ldText: string | null | undefined): Json | null {
  if (!ldText) return null;
  try {
    const data = JSON.parse(ldText) as Json;
    const graph = (Array.isArray(data["@graph"]) ? data["@graph"] : [data]) as Json[];
    return graph.find((g) => g["@type"] === "Course") ?? null;
  } catch {
    return null;
  }
}

/**
 * Udemy blocks direct server requests (bot protection), so the public course page is read
 * through microlink.io, a link-preview service. We ask it for the page's schema.org Course
 * data and the "Course content" stats line. Returns null when nothing usable comes back;
 * admins can then fill the fields by hand.
 */
export async function fetchUdemyCourse(input: string): Promise<UdemyCourse | null> {
  const url = normalizeUdemyUrl(input);
  if (!url) return null;

  const api = new URL("https://api.microlink.io/");
  api.searchParams.set("url", url);
  api.searchParams.set("data.ld.selector", 'script[type="application/ld+json"]');
  api.searchParams.set("data.ld.type", "text");
  api.searchParams.set("data.stats.selector", '[data-testid="curriculum-stats"]');
  api.searchParams.set("data.stats.type", "text");

  let data: Json;
  try {
    const res = await fetch(api, { signal: AbortSignal.timeout(20000), cache: "no-store" });
    const body = (await res.json()) as { status?: string; data?: Json };
    if (!res.ok || body.status !== "success" || !body.data) return null;
    data = body.data;
  } catch {
    return null;
  }

  const course = findCourse(data.ld as string | undefined);
  const title = (course?.name as string | undefined) ?? (data.title as string | undefined);
  if (!title || /^udemy$/i.test(title)) return null;

  const rating = course?.aggregateRating as Json | undefined;
  const people = ((course?.author ?? (course?.hasCourseInstance as Json | undefined)?.instructor) as Json[] | undefined) ?? [];
  const lectures = String(data.stats ?? "").match(/(\d[\d,]*)\s+lectures/)?.[1];
  const image = (course?.image as string | undefined) ?? ((data.image as Json | undefined)?.url as string | undefined) ?? null;

  return {
    url,
    title,
    headline: (course?.description as string | undefined) ?? (data.description as string | undefined) ?? null,
    image,
    instructor: people.map((p) => p.name).filter(Boolean).join(", ") || ((data.author as string | undefined) ?? null),
    rating: rating?.ratingValue ? Math.round(Number(rating.ratingValue) * 10) / 10 : null,
    ratings_count: rating?.ratingCount ? Number(rating.ratingCount) : null,
    hours: durationHours((course?.hasCourseInstance as Json | undefined)?.courseWorkload),
    lectures: lectures ? Number(lectures.replace(/,/g, "")) : null,
    level: (course?.educationalLevel as string | undefined) ?? null,
  };
}
