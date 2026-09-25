import Link from "next/link";
import { ArrowRight, CircleCheck, Gift, Infinity as InfinityIcon } from "lucide-react";
import { Reveal } from "@/components/ui/motion";
import { UdemyCard } from "./udemy-card";
import type { UdemyCourse } from "@/lib/types";

/** Sidebar card: every enrollment includes a free Udemy course with lifetime access. */
export function UdemyOfferCard({ courseTitle, courseSlug, count }: { courseTitle: string; courseSlug: string; count: number }) {
  return (
    <div className="shine group relative overflow-hidden rounded-2xl bg-navy p-6 text-white shadow-lift">
      <div className="absolute -top-16 -right-16 size-48 animate-pulse rounded-full bg-mint/25 blur-2xl" aria-hidden />
      <div className="animate-spin-slow absolute -right-10 -bottom-10 size-40 rounded-full border-[18px] border-dashed border-navy-700" aria-hidden />

      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-[11px] font-extrabold tracking-wider text-navy-900 uppercase">
            <Gift className="size-3.5" aria-hidden /> Exclusive bonus
          </span>
          <span className="animate-float inline-flex size-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <InfinityIcon className="size-7 text-mint" aria-hidden />
          </span>
        </div>

        <h2 className="mt-4 text-xl leading-snug font-bold">
          Get a <span className="text-mint">FREE Udemy course</span> with lifetime access
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/80">
          Included in your {courseTitle} fee. Choose the Udemy course that fits your program and keep it forever.
        </p>

        <ul className="mt-4 space-y-2 text-sm text-white/90">
          {["No extra cost, included in the fee", "Lifetime access on Udemy", "You pick the course that suits you"].map((t) => (
            <li key={t} className="flex gap-2">
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-mint" aria-hidden /> {t}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-col gap-2">
          {count > 0 && (
            <a
              href="#udemy"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-navy transition hover:bg-tint"
            >
              See the {count} Udemy {count === 1 ? "course" : "courses"} <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
            </a>
          )}
          <Link
            href={`/enroll?course=${courseSlug}`}
            className="inline-flex h-11 items-center justify-center rounded-xl text-sm font-bold text-white ring-1 ring-white/30 transition hover:bg-white/10"
          >
            Enroll & choose yours
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Blue section listing the Udemy courses for this academy course. */
export function UdemySection({ courses, courseTitle }: { courses: UdemyCourse[]; courseTitle: string }) {
  if (!courses.length) return null;
  return (
    <section id="udemy" className="relative scroll-mt-36 overflow-hidden rounded-3xl bg-navy p-5 text-white sm:p-8">
      <div className="animate-drift absolute -top-24 -right-24 size-72 rounded-full bg-navy-700" aria-hidden />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-[11px] font-extrabold tracking-wider text-navy-900 uppercase">
              <Gift className="size-3.5" aria-hidden /> Bonus with your enrollment
            </span>
            <h2 className="mt-3 text-2xl leading-tight font-bold sm:text-[28px]">Free Udemy courses with lifetime access</h2>
            <p className="mt-2 text-[15px] leading-7 text-white/80">
              Enroll in {courseTitle} and choose one of these Udemy courses at no extra cost. It stays yours for life, so you
              can keep learning long after the program ends.
            </p>
          </div>
          <span className="animate-float hidden size-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 sm:inline-flex">
            <InfinityIcon className="size-9 text-mint" aria-hidden />
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {courses.map((c, i) => (
            <Reveal key={c.url + i} delay={i * 120} variant="zoom">
              <UdemyCard course={c} />
            </Reveal>
          ))}
        </div>
        <p className="mt-5 text-xs text-white/60">
          Udemy is a separate platform. Course access is arranged by Leafclutch Academy after your enrollment is confirmed.
        </p>
      </div>
    </section>
  );
}
