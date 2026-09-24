import Link from "next/link";
import { LinkedinIcon } from "@/components/ui/brand-icons";
import { initials } from "@/lib/format";
import type { Mentor } from "@/lib/types";

export function MentorCard({ mentor, showCourses = true }: { mentor: Mentor; showCourses?: boolean }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/4.2] overflow-hidden bg-tint">
        {mentor.photo_url ? (
          <img
            src={mentor.photo_url}
            alt={mentor.name}
            loading="lazy"
            className="size-full object-cover object-top transition duration-700 group-hover:scale-105"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-5xl font-extrabold text-navy/40">
            {initials(mentor.name)}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-900/70 to-transparent" />
        <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-navy">
          {mentor.role}
        </span>
        {mentor.linkedin_url && (
          <a
            href={mentor.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${mentor.name} on LinkedIn`}
            className="absolute right-4 bottom-4 inline-flex size-9 items-center justify-center rounded-full bg-white/95 text-navy hover:bg-sky hover:text-white"
          >
            <LinkedinIcon className="size-4" />
          </a>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-extrabold text-ink">{mentor.name}</h3>
        {mentor.bio && <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted">{mentor.bio}</p>}
        {showCourses && (mentor.courses?.length ?? 0) > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {mentor.courses!.map((c) => (
              <Link
                key={c.slug}
                href={`/courses/${c.slug}`}
                className="rounded-full bg-tint px-2.5 py-1 text-xs font-semibold text-navy hover:bg-navy hover:text-white"
              >
                {c.title}
              </Link>
            ))}
          </div>
        ) : mentor.expertise.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {mentor.expertise.map((x) => (
              <span key={x} className="rounded-full bg-tint px-2.5 py-1 text-xs font-semibold text-navy">
                {x}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
