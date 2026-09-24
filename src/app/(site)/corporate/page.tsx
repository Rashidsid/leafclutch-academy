import type { Metadata } from "next";
import { CircleCheck, Clock, FileText, Handshake, Presentation, Settings2, Trophy } from "lucide-react";
import { CorporateForm } from "@/components/forms/corporate-form";
import { PageHero } from "@/components/site/sections";
import { buttonClass } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPrograms } from "@/lib/data";
import { AUDIENCE_LABELS } from "@/lib/format";
import { IconByName } from "@/lib/icons";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Corporate & Institutional Training",
  description:
    "Customised AI, data, development and cyber security training for companies, plus short-term campaigns, bootcamps and workshops for schools, colleges and institutes in Nepal.",
  alternates: { canonical: "/corporate" },
};

const STEPS = [
  { icon: Handshake, title: "Consult", text: "We understand your goals, audience, schedule and budget." },
  { icon: Settings2, title: "Customise", text: "We tailor the curriculum, duration and delivery mode for you." },
  { icon: Presentation, title: "Deliver", text: "Our mentors run hands-on sessions on-site, online or hybrid." },
  { icon: Trophy, title: "Certify & report", text: "Participants get certificates and you receive a progress report." },
];

export default async function CorporatePage() {
  const programs = await getPrograms();

  return (
    <>
      <PageHero
        eyebrow="Corporate & institutions"
        title="Upskill your team, school or campus"
        description="From corporate AI adoption to week-long coding campaigns in schools, we design and deliver practical programs around your goals and calendar."
        breadcrumb={[{ href: "/corporate", label: "Corporate & Institutions" }]}
      >
        <a href="#proposal" className={buttonClass("primary", "lg", "mt-8")}>
          <FileText className="size-4" aria-hidden /> Request a proposal
        </a>
      </PageHero>

      {programs.length > 0 && (
        <section id="programs" className="container-x scroll-mt-24 py-16 sm:py-20">
          <SectionHeading
            align="center"
            eyebrow="Programs"
            title="Programs for every kind of organisation"
            description="Each program is customised. These are the formats we run most often."
          />
          <div className="grid gap-6 md:grid-cols-2">
            {programs.map((p) => {
              return (
                <article key={p.id} className="flex flex-col rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-navy text-white">
                      <IconByName name={p.icon} className="size-7" aria-hidden />
                    </span>
                    <span className="rounded-full bg-tint px-3 py-1 text-xs font-bold text-navy">
                      For {AUDIENCE_LABELS[p.audience]}
                    </span>
                  </div>
                  <h2 className="mt-5 text-2xl font-extrabold text-ink">{p.title}</h2>
                  {p.duration && (
                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-sky">
                      <Clock className="size-4" aria-hidden /> {p.duration}
                    </p>
                  )}
                  {p.summary && <p className="mt-3 leading-7 text-slate-600">{p.summary}</p>}
                  {p.highlights.length > 0 && (
                    <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex gap-2 text-sm text-slate-700">
                          <CircleCheck className="mt-0.5 size-4 shrink-0 text-leaf" aria-hidden /> {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className="bg-surface py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading align="center" eyebrow="Process" title="How we work with you" />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-line bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-tint text-navy">
                    <s.icon className="size-6" aria-hidden />
                  </span>
                  <span className="text-4xl font-extrabold text-line">0{i + 1}</span>
                </div>
                <h3 className="mt-4 text-lg font-extrabold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="proposal" className="container-x scroll-mt-24 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-sky">Get a proposal</p>
            <h2 className="text-3xl font-extrabold tracking-tight">Tell us what you need</h2>
            <p className="mt-3 leading-7 text-muted">
              Share a few details and our partnerships team will send a tailored proposal with curriculum, schedule and
              pricing, usually within two working days.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {[
                "Group pricing for teams and institutions",
                "Sessions in English or Nepali",
                "On-site anywhere in Nepal, or online",
                "Certificates for every participant",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <CircleCheck className="mt-0.5 size-4 shrink-0 text-leaf" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-8">
            <CorporateForm programs={programs.map((p) => ({ id: p.id, title: p.title, audience: p.audience }))} />
          </div>
        </div>
      </section>
    </>
  );
}
