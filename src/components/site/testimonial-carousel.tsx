"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Stars } from "@/components/ui/stars";
import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";
import type { Testimonial } from "@/lib/types";

const AUTOPLAY_MS = 7000;

/**
 * One story at a time: a large photo on the left, the quote on the right,
 * outlined arrow buttons at both edges and dots underneath.
 */
export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerX = useRef<number | null>(null);
  const count = items.length;

  const go = useCallback((dir: 1 | -1) => setIndex((i) => (i + dir + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, count, go]);

  if (!count) return null;

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Learner testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div
        className="relative overflow-hidden px-0 sm:px-16"
        onPointerDown={(e) => (pointerX.current = e.clientX)}
        onPointerUp={(e) => {
          if (pointerX.current === null) return;
          const dx = e.clientX - pointerX.current;
          pointerX.current = null;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
      >
        <div className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,0.8,0.24,1)]" style={{ transform: `translateX(-${index * 100}%)` }}>
          {items.map((t, i) => (
            <figure
              key={t.id}
              aria-hidden={i !== index}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              className="grid w-full shrink-0 items-center gap-6 md:grid-cols-[1.1fr_1fr] md:gap-12"
            >
              <div className="relative aspect-16/10 overflow-hidden rounded-2xl bg-tint">
                {t.image_url ? (
                  <img src={t.image_url} alt={t.name} className="size-full object-cover" draggable={false} loading="lazy" />
                ) : (
                  <Placeholder t={t} />
                )}
              </div>
              <div>
                <span className="block font-serif text-7xl leading-none text-navy" aria-hidden>
                  &ldquo;
                </span>
                <blockquote className="-mt-6 pl-1 text-lg leading-8 font-semibold text-ink sm:text-xl sm:leading-9">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 pl-1">
                  {t.avatar_url && <img src={t.avatar_url} alt="" className="size-11 rounded-full object-cover" />}
                  <div>
                    <p className="font-bold text-ink">{t.name}</p>
                    <p className="text-sm text-muted">
                      {[t.role, t.organization, t.course?.title].filter(Boolean).join(" · ")}
                    </p>
                    <Stars value={t.rating} className="mt-1" />
                  </div>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="absolute top-1/2 left-0 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-navy bg-white text-navy transition hover:bg-navy hover:text-white sm:inline-flex"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="absolute top-1/2 right-0 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-navy bg-white text-navy transition hover:bg-navy hover:text-white sm:inline-flex"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {items.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial ${i + 1}`}
              aria-current={i === index}
              className={cn("h-2 rounded-full transition-all", i === index ? "w-7 bg-navy" : "w-2 bg-slate-300 hover:bg-slate-400")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Placeholder({ t }: { t: Testimonial }) {
  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden bg-navy">
      <div className="animate-drift absolute -right-16 -bottom-20 size-72 rounded-full bg-navy-700" />
      <div className="absolute -top-16 -left-10 size-56 rounded-full bg-white/10" />
      {t.avatar_url ? (
        <img src={t.avatar_url} alt="" className="relative size-32 rounded-full object-cover ring-4 ring-white/40" />
      ) : (
        <span className="relative inline-flex size-32 items-center justify-center rounded-full bg-white/15 text-5xl font-extrabold text-white ring-4 ring-white/30">
          {initials(t.name)}
        </span>
      )}
      {t.course && (
        <span className="absolute bottom-5 left-5 rounded-full bg-white px-3 py-1 text-xs font-bold text-navy">{t.course.title}</span>
      )}
    </div>
  );
}
