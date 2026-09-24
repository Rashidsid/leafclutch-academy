import type { Metadata } from "next";
import Image from "next/image";
import { Eye, HeartHandshake, Lightbulb, Rocket, ShieldCheck, Target } from "lucide-react";
import { CtaBand, Journey, PageHero } from "@/components/site/sections";
import { SectionHeading } from "@/components/ui/section-heading";
import { getSettings } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Leafclutch Academy is the training wing of Leafclutch Technologies Pvt. Ltd., teaching practical, job-ready IT skills from Siddharthanagar, Rupandehi.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  { icon: Lightbulb, title: "Practical first", text: "We teach what teams actually use, and every concept ends in something you build." },
  { icon: HeartHandshake, title: "Mentorship over lectures", text: "Small batches, code reviews and one-to-one guidance throughout the course." },
  { icon: ShieldCheck, title: "Honest and transparent", text: "One clear fee for every mode, a simple two-part payment plan, and no hidden costs." },
  { icon: Rocket, title: "Career focused", text: "Projects, internships and portfolio support that help you take the next step." },
];

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        eyebrow="About us"
        title={
          <>
            From ideas to impact, <span className="text-gradient">one learner at a time</span>
          </>
        }
        description={`${settings.site_name} is the training wing of Leafclutch Technologies Pvt. Ltd., a software company based in Siddharthanagar, Rupandehi.`}
        breadcrumb={[{ href: "/about", label: "About" }]}
      />

      <section className="container-x grid gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Taught by a team that builds software every day</h2>
          <div className="prose-lc mt-5">
            <p>
              Leafclutch Technologies builds restaurant, pharmacy and school management systems, websites and digital
              solutions for businesses across Nepal. Leafclutch Academy brings that real-world experience into the
              classroom.
            </p>
            <p>
              Our programs in AI, data, development, cyber security and design are built around the tools and workflows
              we use on real projects. Learners attend live classes online, in our lab, or both, get recordings of every
              session, and build a portfolio of projects before moving into an internship.
            </p>
            <p>
              We also partner with companies, schools, colleges and institutes to run customised training, campaigns and
              bootcamps across the country.
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-8 -z-10 rounded-full bg-gradient-to-br from-sky/30 to-mint/30 blur-3xl" />
          <div className="mx-auto flex aspect-square max-w-sm items-center justify-center rounded-[40px] bg-navy p-12 shadow-lift">
            <Image src="/brand/logo-footer.png" alt="Leafclutch logo" width={320} height={320} className="h-auto w-full" />
          </div>
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-line">
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-tint text-navy">
              <Target className="size-6" aria-hidden />
            </span>
            <h2 className="mt-4 text-2xl font-extrabold">Our mission</h2>
            <p className="mt-2 leading-7 text-slate-600">
              To make quality, industry-relevant tech education accessible across Nepal, with flexible learning modes,
              fair pricing and a clear path from learning to real work.
            </p>
          </div>
          <div className="rounded-3xl bg-navy p-8 text-white shadow-lift">
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-white/10 text-mint">
              <Eye className="size-6" aria-hidden />
            </span>
            <h2 className="mt-4 text-2xl font-extrabold">Our vision</h2>
            <p className="mt-2 leading-7 text-white/75">
              A generation of Nepali builders who create technology for the world, starting from their own cities.
            </p>
          </div>
        </div>
      </section>

      <section className="container-x py-16 sm:py-20">
        <SectionHeading align="center" eyebrow="What we believe" title="Our values" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-line p-6">
              <v.icon className="size-7 text-sky" aria-hidden />
              <h3 className="mt-4 text-lg font-extrabold">{v.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading align="center" eyebrow="Learning path" title="How every program works" />
          <Journey />
        </div>
      </section>

      <CtaBand whatsapp={settings.whatsapp} />
    </>
  );
}
