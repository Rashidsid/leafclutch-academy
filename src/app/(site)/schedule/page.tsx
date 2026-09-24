import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, CalendarX, Clock, Users } from "lucide-react";
import { CtaBand, PageHero } from "@/components/site/sections";
import { buttonClass } from "@/components/ui/button";
import { getBatches, getSettings } from "@/lib/data";
import { BATCH_STATUS, formatDate, formatNpr, MODE_LABELS } from "@/lib/format";
import { cn } from "@/lib/cn";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Upcoming Classes",
  description: "Upcoming batches at Leafclutch Academy. Find start dates, timings and learning modes for every course.",
  alternates: { canonical: "/schedule" },
};

export default async function SchedulePage() {
  const [settings, batches] = await Promise.all([getSettings(), getBatches()]);

  return (
    <>
      <PageHero
        eyebrow="Schedule"
        title="Upcoming classes"
        description="New batches start regularly in Online, Hybrid and Physical modes. Reserve your seat early, because batches are kept small."
        breadcrumb={[{ href: "/schedule", label: "Upcoming Classes" }]}
      />
      <section className="container-x py-12 sm:py-16">
        {batches.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {batches.map((b) => {
              const d = new Date(`${b.start_date}T00:00:00`);
              return (
                <article key={b.id} className="flex flex-col rounded-2xl border border-line bg-white p-5 shadow-card">
                  <div className="flex items-start gap-4">
                    <div className="flex w-16 shrink-0 flex-col items-center rounded-xl bg-navy py-2 text-white">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-mint">
                        {formatDate(d, { month: "short" })}
                      </span>
                      <span className="text-2xl leading-tight font-extrabold">{d.getDate()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1", BATCH_STATUS[b.status].tone)}>
                        {BATCH_STATUS[b.status].label}
                      </span>
                      <h2 className="mt-2 text-lg leading-snug font-extrabold text-ink">
                        {b.course ? (
                          <Link href={`/courses/${b.course.slug}`} className="hover:text-navy">
                            {b.title || b.course.title}
                          </Link>
                        ) : (
                          b.title
                        )}
                      </h2>
                    </div>
                  </div>
                  <ul className="mt-5 mb-5 space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-sky" aria-hidden /> Starts {formatDate(b.start_date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </li>
                    {b.schedule && (
                      <li className="flex items-center gap-2">
                        <Clock className="size-4 text-sky" aria-hidden /> {b.schedule}
                      </li>
                    )}
                    <li className="flex items-center gap-2">
                      <Users className="size-4 text-sky" aria-hidden /> {MODE_LABELS[b.mode]} class
                      {b.seats ? ` · ${b.seats} seats` : ""}
                    </li>
                  </ul>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
                    {b.course && <span className="font-extrabold text-navy">{formatNpr(b.course.fee)}</span>}
                    {b.status !== "full" && b.course && (
                      <Link
                        href={`/enroll?course=${b.course.slug}&mode=${b.mode}&batch=${b.id}`}
                        className={buttonClass("primary", "sm")}
                      >
                        Reserve seat
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-line py-16 text-center">
            <CalendarX className="size-10 text-muted" aria-hidden />
            <p className="mt-4 font-bold">New batch dates are being finalised</p>
            <p className="mt-1 max-w-md text-sm text-muted">
              Send an enrollment request and we will contact you as soon as the next batch for your course opens.
            </p>
            <Link href="/enroll" className={buttonClass("primary", "md", "mt-6")}>
              Request a seat
            </Link>
          </div>
        )}
      </section>
      <CtaBand whatsapp={settings.whatsapp} />
    </>
  );
}
