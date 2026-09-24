"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CourseCard, type Rating } from "./course-card";
import { cn } from "@/lib/cn";
import type { CourseLite } from "@/lib/catalog";

export interface BandTab {
  label: string;
  courses: CourseLite[];
}

/** Gradient band with tabs on top and four course cards, like a "choose your field" strip. */
export function CourseTabsBand({
  title,
  text,
  cta,
  tabs,
  ratings,
}: {
  title: string;
  text: string;
  cta: { href: string; label: string };
  tabs: BandTab[];
  ratings: Record<string, Rating>;
}) {
  const [active, setActive] = useState(0);
  const tab = tabs[active];
  if (!tab) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-navy p-5 sm:p-8">
      <div className="animate-drift pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-navy-700" aria-hidden />
      <div className="pointer-events-none absolute -bottom-28 left-1/4 size-72 rounded-full border-[36px] border-navy-700/70" aria-hidden />
      <div className="relative grid gap-6 lg:grid-cols-[260px_1fr] lg:items-center">
        <div className="text-white">
          <h2 className="text-2xl leading-tight font-extrabold sm:text-[28px]">{title}</h2>
          <p className="mt-3 text-[15px] leading-7 text-white/85">{text}</p>
          <Link
            href={cta.href}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-navy transition hover:bg-tint"
          >
            {cta.label} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="min-w-0">
          <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1" role="tablist">
            {tabs.map((t, i) => (
              <button
                key={t.label}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
                  i === active ? "border-ink bg-ink text-white" : "border-white/70 bg-white text-ink hover:bg-tint",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className={cn("grid gap-4 sm:grid-cols-2", tab.courses.length >= 3 ? "xl:grid-cols-4" : "xl:grid-cols-3")}>
            {tab.courses.slice(0, 4).map((c) => (
              <CourseCard key={c.id} course={c} rating={ratings[c.id]} showSkills={false} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
