import Image from "next/image";
import Link from "next/link";
import { Star, TrendingUp } from "lucide-react";
import { CourseCover } from "./course-cover";
import { formatNpr } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { CourseLite } from "@/lib/catalog";

export type Rating = { average: number; count: number };

function OrgLine({ small = false }: { small?: boolean }) {
  return (
    <p className={cn("flex items-center gap-1.5 text-muted", small ? "text-xs" : "text-sm")}>
      <span className="inline-flex size-5 items-center justify-center rounded-md bg-navy">
        <Image src="/brand/logo-footer.png" alt="" width={14} height={14} className="size-3.5" />
      </span>
      Leafclutch Academy
    </p>
  );
}

function Meta({ course, rating }: { course: CourseLite; rating?: Rating }) {
  const parts = [course.level, course.duration].filter(Boolean);
  return (
    <p className="text-[13px] text-muted">
      {rating && (
        <span className="font-semibold text-ink">
          <Star className="-mt-0.5 mr-0.5 inline size-3.5 fill-ink text-ink" aria-hidden />
          {rating.average.toFixed(1)} <span className="font-normal text-muted">({rating.count})</span>
          {" · "}
        </span>
      )}
      {parts.join(" · ")}
    </p>
  );
}

/** Large card: catalogue grids and tabbed bands. */
export function CourseCard({
  course,
  rating,
  showSkills = true,
}: {
  course: CourseLite;
  rating?: Rating;
  showSkills?: boolean;
}) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-line bg-white p-2.5 transition duration-300 hover:-translate-y-1.5 hover:border-navy/20 hover:shadow-lift"
    >
      <div className="overflow-hidden rounded-xl">
        <CourseCover course={course} className="transition duration-500 group-hover:scale-[1.04]" />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-2 pt-3 pb-2">
        <OrgLine />
        <h3 className="text-[17px] leading-snug font-bold text-ink group-hover:underline">{course.title}</h3>
        {showSkills && course.tools.length > 0 && (
          <p className="line-clamp-2 text-[13px] leading-5 text-slate-600">
            <span className="font-semibold text-ink">Skills you&apos;ll gain:</span> {course.tools.join(", ")}
          </p>
        )}
        <div className="mt-auto space-y-2 pt-1">
          <Meta course={course} rating={rating} />
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-baseline gap-1.5 rounded-md bg-tint px-2 py-0.5 text-xs font-bold text-navy">
              {course.variable_pricing && <span className="font-medium text-muted">From</span>}
              {formatNpr(course.price_from.final)}
              {course.price_from.discount > 0 && <s className="font-medium text-muted">{formatNpr(course.price_from.price)}</s>}
            </span>
            {course.price_from.discount > 0 && (
              <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-extrabold text-white">{course.price_from.discount}% OFF</span>
            )}
            {course.badge && (
              <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-600">
                <TrendingUp className="size-3" aria-hidden /> {course.badge === "New" ? "New program" : course.badge === "Popular" ? "Trending right now" : course.badge}
              </span>
            )}
            {course.start_percent !== null && course.start_percent < 100 && (
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                Pay {course.start_percent}% to start
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

/** Compact row: "New and popular" panels and search suggestions. */
export function CourseRow({ course, rating }: { course: CourseLite; rating?: Rating }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex items-center gap-3 rounded-xl bg-white p-2.5 transition duration-300 hover:translate-x-1 hover:shadow-card"
    >
      <CourseCover course={course} size="thumb" className="w-19 shrink-0" />
      <div className="min-w-0 flex-1">
        <OrgLine small />
        <p className="mt-0.5 truncate font-bold text-ink group-hover:underline">{course.title}</p>
        <p className="mt-0.5 text-xs text-muted">
          {course.category ?? "Program"} · {course.duration}
          {rating && (
            <>
              {" · "}
              <Star className="-mt-0.5 inline size-3 fill-ink text-ink" aria-hidden /> {rating.average.toFixed(1)}
            </>
          )}
        </p>
      </div>
    </Link>
  );
}
