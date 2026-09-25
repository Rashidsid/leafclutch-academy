import { ArrowUpRight, Infinity as InfinityIcon, PlayCircle, Star } from "lucide-react";
import { cn } from "@/lib/cn";
import type { UdemyCourse } from "@/lib/types";

const nf = new Intl.NumberFormat("en-IN");

/** Card for a Udemy course included free with an academy course. */
export function UdemyCard({ course, className }: { course: UdemyCourse; className?: string }) {
  const chips = [
    course.rating ? { key: "rating", node: <><Star className="size-3.5 fill-amber-500 text-amber-500" aria-hidden /> {course.rating.toFixed(1)}</> } : null,
    course.ratings_count ? { key: "count", node: <>{nf.format(course.ratings_count)} ratings</> } : null,
    course.hours ? { key: "hours", node: <>{course.hours} total hours</> } : null,
    course.lectures ? { key: "lectures", node: <>{nf.format(course.lectures)} lectures</> } : null,
    course.level ? { key: "level", node: <>{course.level}</> } : null,
  ].filter(Boolean) as { key: string; node: React.ReactNode }[];

  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-2xl bg-white p-3 text-ink shadow-card ring-1 ring-line transition duration-300 hover:-translate-y-1.5 hover:shadow-lift",
        className,
      )}
    >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-tint">
        {course.image ? (
          <img
            src={course.image}
            alt=""
            loading="lazy"
            className="size-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-navy/40">
            <PlayCircle className="size-12" aria-hidden />
          </div>
        )}
        <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-md bg-mint px-2 py-0.5 text-[11px] font-extrabold tracking-wide text-navy-900 uppercase shadow-sm">
          <InfinityIcon className="size-3.5" aria-hidden /> Free · lifetime
        </span>
      </div>

      <div className="flex flex-1 flex-col px-1.5 pt-3.5 pb-1">
        <h3 className="text-[17px] leading-snug font-bold">{course.title}</h3>
        {course.headline && <p className="mt-1.5 line-clamp-2 text-[15px] leading-6 text-slate-700">{course.headline}</p>}
        {course.instructor && <p className="mt-1.5 text-xs text-muted">{course.instructor}</p>}

        {chips.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {chips.map((c) => (
              <li key={c.key} className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-line">
                {c.node}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-sm">
            <span className="font-extrabold text-navy">Free</span>{" "}
            <span className="text-muted">with your enrollment</span>
          </p>
          <a
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-bold text-navy ring-1 ring-navy transition hover:bg-navy hover:text-white"
          >
            Explore <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>
      </div>
    </article>
  );
}
