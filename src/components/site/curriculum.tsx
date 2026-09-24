"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Download, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { curriculumStats, lessonSections } from "@/lib/curriculum";
import type { CurriculumModule } from "@/lib/types";

/**
 * Three-level curriculum: Lesson → numbered sections (1.1, 1.2 …) → points.
 * The first lesson and its first section start open.
 */
export function Curriculum({ lessons, pdfHref }: { lessons: CurriculumModule[]; pdfHref?: string }) {
  const data = useMemo(() => lessons.map((l) => ({ title: l.title, sections: lessonSections(l) })), [lessons]);
  const stats = curriculumStats(lessons);
  const allSectionKeys = useMemo(() => data.flatMap((l, i) => l.sections.map((_, j) => `${i}.${j}`)), [data]);

  const [openLessons, setOpenLessons] = useState<Set<number>>(() => new Set([0]));
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set(["0.0"]));
  const allOpen = openLessons.size === data.length && openSections.size === allSectionKeys.length;

  const toggle = <T,>(set: Set<T>, key: T) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {stats.lessons} lessons{stats.sections ? ` · ${stats.sections} sections` : ""} · {stats.points} topics
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              if (allOpen) {
                setOpenLessons(new Set());
                setOpenSections(new Set());
              } else {
                setOpenLessons(new Set(data.map((_, i) => i)));
                setOpenSections(new Set(allSectionKeys));
              }
            }}
            className="rounded-lg bg-tint px-3.5 py-2 text-sm font-bold text-navy transition hover:bg-navy hover:text-white"
          >
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
          {pdfHref && (
            <a
              href={pdfHref}
              download
              className="shine inline-flex items-center gap-1.5 rounded-lg bg-navy px-3.5 py-2 text-sm font-bold text-white transition hover:bg-navy-700"
            >
              <Download className="size-4" aria-hidden /> Download PDF
            </a>
          )}
        </div>
      </div>

      <ol className="overflow-hidden rounded-2xl border border-line">
        {data.map((lesson, i) => {
          const open = openLessons.has(i);
          return (
            <li key={i} className="border-b border-line bg-surface last:border-b-0">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpenLessons((s) => toggle(s, i))}
                  aria-expanded={open}
                  aria-controls={`lesson-${i}`}
                  className={cn(
                    "flex w-full items-center gap-4 px-4 py-4 text-left transition sm:px-6 sm:py-5",
                    open ? "bg-tint" : "hover:bg-tint/60",
                  )}
                >
                  <span className="flex-1 text-[15px] font-bold text-ink sm:text-base">
                    Lesson {i + 1}: {lesson.title}
                  </span>
                  <ChevronDown className={cn("size-5 shrink-0 text-slate-600 transition duration-300", open && "rotate-180 text-navy")} aria-hidden />
                </button>
              </h3>
              <div id={`lesson-${i}`} className={cn("grid transition-all duration-300", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                  <div className="space-y-1 px-4 pt-2 pb-5 sm:px-6">
                    {lesson.sections.map((section, j) => {
                      const key = `${i}.${j}`;
                      const points = (
                        <ul className="space-y-3 py-2 pl-7 sm:pl-9">
                          {section.points.map((p, k) => (
                            <li key={k} className="flex gap-3 text-[15px] leading-6 text-slate-700">
                              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-ink" aria-hidden />
                              {p}
                            </li>
                          ))}
                        </ul>
                      );
                      if (!section.title) return <div key={key}>{points}</div>;
                      const sectionOpen = openSections.has(key);
                      return (
                        <div key={key}>
                          <button
                            type="button"
                            onClick={() => setOpenSections((s) => toggle(s, key))}
                            aria-expanded={sectionOpen}
                            className="flex w-full items-center gap-3 py-2.5 text-left text-[15px] font-bold text-ink hover:text-navy"
                          >
                            {sectionOpen ? (
                              <Minus className="size-4 shrink-0" aria-hidden />
                            ) : (
                              <Plus className="size-4 shrink-0" aria-hidden />
                            )}
                            {i + 1}.{j + 1} {section.title}
                          </button>
                          <div className={cn("grid transition-all duration-300", sectionOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                            <div className="overflow-hidden">{points}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
