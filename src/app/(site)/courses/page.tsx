import type { Metadata } from "next";
import Link from "next/link";
import { SearchX, SlidersHorizontal } from "lucide-react";
import { CourseCard } from "@/components/site/course-card";
import { FilterMenu } from "@/components/site/filter-menu";
import { CtaBand } from "@/components/site/sections";
import { toLite } from "@/lib/catalog";
import { getCategories, getCourses, getSettings, getTestimonials, ratingsByCourse } from "@/lib/data";

export const metadata: Metadata = {
  title: "All Courses",
  description:
    "Browse 3-month IT training programs in AI, data, programming, web development, cyber security and design. Learn Online, Hybrid or Physical.",
  alternates: { canonical: "/courses" },
};

type SearchParams = Promise<{ q?: string; category?: string; level?: string; sort?: string }>;

const SORTS = [
  { value: "popular", label: "Most relevant" },
  { value: "fee-asc", label: "Fee: low to high" },
  { value: "fee-desc", label: "Fee: high to low" },
  { value: "title", label: "Name A–Z" },
];
const LEVELS = ["Beginner", "Intermediate"];

export default async function CoursesPage({ searchParams }: { searchParams: SearchParams }) {
  const { q = "", category = "", level = "", sort = "popular" } = await searchParams;
  const [settings, categories, courses, testimonials] = await Promise.all([
    getSettings(),
    getCategories(),
    getCourses(),
    getTestimonials(),
  ]);
  const ratings = ratingsByCourse(testimonials);

  const term = q.trim().toLowerCase();
  const activeCat = categories.find((c) => c.slug === category);
  const activeLevel = LEVELS.find((l) => l.toLowerCase() === level.toLowerCase());
  let list = courses.filter((c) => {
    if (activeCat && c.category_id !== activeCat.id) return false;
    if (activeLevel && !(c.level ?? "").toLowerCase().includes(activeLevel.toLowerCase())) return false;
    if (!term) return true;
    return [c.title, c.subtitle, c.category?.name, ...c.tools, ...c.careers]
      .filter(Boolean)
      .some((s) => s!.toLowerCase().includes(term));
  });
  if (sort === "fee-asc") list = [...list].sort((a, b) => a.fee - b.fee);
  if (sort === "fee-desc") list = [...list].sort((a, b) => b.fee - a.fee);
  if (sort === "title") list = [...list].sort((a, b) => a.title.localeCompare(b.title));

  const href = (next: Partial<{ q: string; category: string; level: string; sort: string }>) => {
    const params = new URLSearchParams();
    const merged = { q, category, level, sort, ...next };
    if (merged.q) params.set("q", merged.q);
    if (merged.category) params.set("category", merged.category);
    if (merged.level) params.set("level", merged.level);
    if (merged.sort && merged.sort !== "popular") params.set("sort", merged.sort);
    const s = params.toString();
    return `/courses${s ? `?${s}` : ""}`;
  };
  const filterCount = [activeCat, activeLevel, sort !== "popular" ? sort : null].filter(Boolean).length;

  return (
    <>
      <section className="container-x pt-8 pb-14">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
          <Link href="/" className="hover:text-navy hover:underline">Home</Link> <span aria-hidden>›</span>{" "}
          <span className="text-ink">Courses</span>
        </nav>
        <h1 className="text-[28px] font-bold tracking-tight text-ink sm:text-[34px]">
          {term ? (
            <>
              Results for &ldquo;{q}&rdquo;
            </>
          ) : activeCat ? (
            `${activeCat.name} courses`
          ) : (
            "All results"
          )}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[15px] font-semibold text-ink">
            <SlidersHorizontal className="size-4" aria-hidden /> Filter & Sort{filterCount ? ` (${filterCount})` : ""}
          </span>
          <span className="hidden h-7 w-px bg-line sm:block" aria-hidden />
          <FilterMenu
            label={activeCat ? activeCat.name : "Topic"}
            active={Boolean(activeCat)}
            options={[
              { href: href({ category: "" }), label: "All topics", selected: !activeCat },
              ...categories.map((c) => ({ href: href({ category: c.slug }), label: c.name, selected: activeCat?.id === c.id })),
            ]}
          />
          <FilterMenu
            label={activeLevel ?? "Level"}
            active={Boolean(activeLevel)}
            options={[
              { href: href({ level: "" }), label: "All levels", selected: !activeLevel },
              ...LEVELS.map((l) => ({ href: href({ level: l.toLowerCase() }), label: l, selected: activeLevel === l })),
            ]}
          />
          <FilterMenu
            label={SORTS.find((s) => s.value === sort)?.label ?? "Sort"}
            active={sort !== "popular"}
            options={SORTS.map((s) => ({ href: href({ sort: s.value }), label: s.label, selected: sort === s.value }))}
          />
          {(filterCount > 0 || term) && (
            <Link href="/courses" className="ml-1 text-[15px] font-bold text-navy hover:underline">
              Clear all
            </Link>
          )}
        </div>

        <p className="mt-6 mb-5 text-sm text-muted">
          {list.length} {list.length === 1 ? "result" : "results"} · Choose Online, Hybrid or Physical classes
        </p>

        {list.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((c) => (
              <CourseCard key={c.id} course={toLite(c)} rating={ratings.get(c.id)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-line py-16 text-center">
            <SearchX className="size-10 text-muted" aria-hidden />
            <p className="mt-4 font-bold">No courses match your search</p>
            <p className="mt-1 text-sm text-muted">Try another keyword, or talk to us and we will help you choose.</p>
            <Link href="/courses" className="mt-5 text-sm font-bold text-navy hover:underline">
              Clear filters
            </Link>
          </div>
        )}
      </section>

      <CtaBand title="Not sure which course to pick?" whatsapp={settings.whatsapp} />
    </>
  );
}
