"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Briefcase,
  Building,
  Building2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Laptop,
  PlayCircle,
  School,
  Shuffle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";

export interface HeroSlide {
  id: string;
  theme: "dark" | "blue" | "light" | "mint";
  title: string;
  text: string;
  cta: { href: string; label: string };
  art: "ai" | "career" | "teams" | "modes";
}

const THEMES: Record<HeroSlide["theme"], { card: string; text: string; button: string }> = {
  dark: { card: "bg-ink", text: "text-white", button: "border-white/70 bg-white text-navy hover:bg-tint" },
  blue: { card: "bg-navy", text: "text-white", button: "bg-white text-navy hover:bg-tint" },
  light: { card: "bg-tint", text: "text-ink", button: "bg-navy text-white hover:bg-navy-700" },
  mint: { card: "bg-navy-900", text: "text-white", button: "bg-white text-navy hover:bg-tint" },
};

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const first = el.firstElementChild as HTMLElement | null;
      if (!first) return;
      const step = first.offsetWidth + 16;
      setIndex(Math.min(slides.length - 1, Math.round(el.scrollLeft / step)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [slides.length]);

  const go = (i: number) => {
    const el = track.current;
    const target = el?.children[i] as HTMLElement | undefined;
    if (el && target) el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div ref={track} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth">
        {slides.map((s) => {
          const t = THEMES[s.theme];
          return (
            <article
              key={s.id}
              className={cn(
                "relative flex min-h-[300px] w-[92%] shrink-0 snap-start overflow-hidden rounded-3xl sm:min-h-[370px] lg:w-[calc(50%-8px)]",
                t.card,
              )}
            >
              <div className={cn("relative z-10 flex max-w-full flex-col justify-center p-7 sm:max-w-[58%] sm:p-10", t.text)}>
                <h2 className="text-balance text-2xl leading-tight font-extrabold tracking-tight sm:text-[34px]">{s.title}</h2>
                <p className="mt-3 text-[15px] leading-6 opacity-85 sm:text-base">{s.text}</p>
                <Link
                  href={s.cta.href}
                  className={cn("mt-6 inline-flex w-fit items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition", t.button)}
                >
                  {s.cta.label} <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
              <div className="hidden sm:block">
                <SlideArt art={s.art} />
              </div>
            </article>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => go(Math.max(0, index - 1))}
        disabled={index === 0}
        aria-label="Previous"
        className="absolute top-1/2 -left-4 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-lift ring-1 ring-line transition hover:bg-tint disabled:opacity-0 sm:inline-flex"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => go(Math.min(slides.length - 1, index + 1))}
        disabled={index >= slides.length - 1}
        aria-label="Next"
        className="absolute top-1/2 -right-4 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-lift ring-1 ring-line transition hover:bg-tint disabled:opacity-0 sm:inline-flex"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="mt-5 flex gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === index}
            className={cn("h-2 rounded-full transition-all", i === index ? "w-7 bg-navy" : "w-2 bg-slate-300 hover:bg-slate-400")}
          />
        ))}
      </div>
    </div>
  );
}

function Bubble({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "animate-float absolute inline-flex size-16 items-center justify-center rounded-full bg-white/10 text-white ring-2 ring-white/30 backdrop-blur-md sm:size-20",
        className,
      )}
    >
      {children}
    </span>
  );
}

function SlideArt({ art }: { art: HeroSlide["art"] }) {
  if (art === "ai") {
    return (
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[42%]" aria-hidden>
        <div className="animate-spin-slow absolute top-1/2 -right-16 aspect-square w-[130%] -translate-y-1/2 rounded-full border-2 border-dashed border-white/15 bg-navy" />
        <div className="absolute top-1/2 -right-6 aspect-square w-[95%] -translate-y-1/2 rounded-full bg-navy-700" />
        <Bubble className="top-[12%] right-[34%]"><Sparkles className="size-8" /></Bubble>
        <Bubble className="top-[40%] right-[12%]"><BrainCircuit className="size-8" /></Bubble>
        <Bubble className="top-[66%] right-[38%]"><Bot className="size-8" /></Bubble>
      </div>
    );
  }
  if (art === "career") {
    return (
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[40%]" aria-hidden>
        <div className="animate-drift absolute -top-10 -right-10 size-72 rounded-full bg-navy-700" />
        <div className="animate-spin-slow absolute -right-6 -bottom-16 size-80 rounded-full border-[28px] border-dashed border-navy-700" />
        <div className="absolute top-1/2 right-[10%] flex size-36 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-2xl sm:size-44">
          <GraduationCap className="size-20 text-navy sm:size-24" strokeWidth={1.4} />
        </div>
        <span className="absolute top-[18%] right-[8%] rounded-full bg-mint px-3 py-1 text-xs font-extrabold text-navy-900 shadow-lg">Internship</span>
        <span className="absolute right-[40%] bottom-[14%] rounded-full bg-white px-3 py-1 text-xs font-extrabold text-navy shadow-lg">Certificate</span>
      </div>
    );
  }
  if (art === "teams") {
    const tiles = [
      { icon: Briefcase, label: "Companies" },
      { icon: School, label: "Schools" },
      { icon: GraduationCap, label: "Colleges" },
      { icon: Building2, label: "Institutes" },
    ];
    return (
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[40%] items-center pr-6 sm:flex" aria-hidden>
        <div className="grid w-full grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line">
          {tiles.map((t) => (
            <div key={t.label} className="flex flex-col items-center gap-2 bg-white py-5">
              <t.icon className="size-7 text-navy" strokeWidth={1.6} />
              <span className="text-xs font-bold text-slate-600">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 w-[42%]" aria-hidden>
      <div className="animate-drift absolute top-1/2 -right-20 size-96 -translate-y-1/2 rounded-full bg-navy-700" />
      {[
        { icon: Laptop, label: "Online", cls: "top-[14%] right-[20%]", delay: "0s" },
        { icon: Shuffle, label: "Hybrid", cls: "top-[42%] right-[46%]", delay: "1.2s" },
        { icon: Building, label: "Physical", cls: "top-[68%] right-[16%]", delay: "2.4s" },
      ].map((m) => (
        <span key={m.label} className={cn("animate-float absolute inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-navy shadow-xl", m.cls)} style={{ animationDelay: m.delay }}>
          <m.icon className="size-5 text-sky" /> {m.label}
        </span>
      ))}
      <span className="absolute right-[10%] bottom-[6%] inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/20">
        <PlayCircle className="size-3.5 text-mint" /> Every class recorded
      </span>
    </div>
  );
}
