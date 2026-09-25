import type { MetadataRoute } from "next";
import { getCourses } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await getCourses();
  const pages = ["", "/courses", "/schedule", "/corporate", "/mentors", "/about", "/contact", "/enroll"];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...courses.map((c) => ({
      url: `${SITE_URL}/courses/${c.slug}`,
      lastModified: c.updated_at ?? undefined,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
