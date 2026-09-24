import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { EnrollForm } from "@/components/forms/enroll-form";
import { PageHero } from "@/components/site/sections";
import { WhatsappIcon } from "@/components/ui/brand-icons";
import { getBatches, getCourses, getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/format";
import type { LearningMode } from "@/lib/types";

export const metadata: Metadata = {
  title: "Enroll",
  description: "Reserve your seat at Leafclutch Academy. Choose your course, learning mode and batch. Pay 50% to start.",
  alternates: { canonical: "/enroll" },
};

type SearchParams = Promise<{ course?: string; mode?: string; batch?: string }>;

export default async function EnrollPage({ searchParams }: { searchParams: SearchParams }) {
  const { course, mode, batch } = await searchParams;
  const [settings, courses, batches] = await Promise.all([getSettings(), getCourses(), getBatches()]);
  const defaultMode = (["online", "hybrid", "physical"] as const).find((m) => m === mode) as LearningMode | undefined;
  const wa = whatsappLink(settings.whatsapp, "Hi, I would like help with my enrollment.");

  return (
    <>
      <PageHero
        eyebrow="Enrollment"
        title="Reserve your seat"
        description="Fill in the form and our team will call you within one working day to confirm your batch and share payment details. You only pay 50% to start."
        breadcrumb={[{ href: "/enroll", label: "Enroll" }]}
      />
      <section className="container-x py-12 sm:py-16">
        <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-8">
          <EnrollForm
            courses={courses.map((c) => ({
              id: c.id,
              slug: c.slug,
              title: c.title,
              fee: c.fee,
              modes: c.modes,
              installments: c.installments,
            }))}
            batches={batches.map((b) => ({
              id: b.id,
              course_id: b.course_id,
              start_date: b.start_date,
              mode: b.mode,
              schedule: b.schedule,
              status: b.status,
            }))}
            defaultCourse={course}
            defaultMode={defaultMode}
            defaultBatch={batch}
          />
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 text-sm text-muted sm:flex-row sm:gap-6">
          <span>Prefer to talk?</span>
          {settings.phone && (
            <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="inline-flex items-center gap-2 font-bold text-navy">
              <Phone className="size-4" aria-hidden /> {settings.phone}
            </a>
          )}
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold text-emerald-700">
              <WhatsappIcon className="size-4" /> WhatsApp us
            </a>
          )}
        </div>
      </section>
    </>
  );
}
