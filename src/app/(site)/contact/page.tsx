import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { FaqList, PageHero } from "@/components/site/sections";
import { WhatsappIcon } from "@/components/ui/brand-icons";
import { getCourseBySlug, getFaqs, getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/format";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Leafclutch Academy for course counselling, fees, schedules and corporate training.",
  alternates: { canonical: "/contact" },
};

type SearchParams = Promise<{ course?: string }>;

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const { course: courseSlug } = await searchParams;
  const [settings, faqs, course] = await Promise.all([
    getSettings(),
    getFaqs(),
    courseSlug ? getCourseBySlug(courseSlug.slice(0, 120)) : Promise.resolve(null),
  ]);
  const wa = whatsappLink(settings.whatsapp, "Hi Leafclutch Academy!");

  const cards = [
    settings.phone && {
      icon: Phone,
      label: "Call us",
      value: settings.phone,
      href: `tel:${settings.phone.replace(/[^+\d]/g, "")}`,
    },
    wa && { icon: WhatsappIcon, label: "WhatsApp", value: "Chat with a counsellor", href: wa },
    settings.email && { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    settings.address && { icon: MapPin, label: "Visit", value: settings.address, href: null },
  ].filter(Boolean) as { icon: React.ComponentType<{ className?: string }>; label: string; value: string; href: string | null }[];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We would love to hear from you"
        description="Questions about courses, fees or schedules? Our counsellors are happy to help you choose the right path."
        breadcrumb={[{ href: "/contact", label: "Contact" }]}
      />

      <section className="container-x -mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const inner = (
            <>
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-tint text-navy">
                <c.icon className="size-5" />
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted">{c.label}</p>
              <p className="mt-1 break-words font-bold text-ink">{c.value}</p>
            </>
          );
          return c.href ? (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="relative rounded-2xl border border-line bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-sky/40"
            >
              {inner}
            </a>
          ) : (
            <div key={c.label} className="relative rounded-2xl border border-line bg-white p-5 shadow-card">
              {inner}
            </div>
          );
        })}
      </section>

      <section className="container-x grid gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-8">
          <h2 className="text-2xl font-extrabold">Send us a message</h2>
          <p className="mt-1 mb-6 text-sm text-muted">We usually reply within one working day.</p>
          <ContactForm defaultSubject={course ? `Inquiry about ${course.title}` : undefined} />
        </div>
        <div className="space-y-6">
          {settings.office_hours && (
            <div className="flex items-center gap-4 rounded-2xl bg-navy p-5 text-white">
              <Clock className="size-6 text-mint" aria-hidden />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/60">Office hours</p>
                <p className="font-bold">{settings.office_hours}</p>
              </div>
            </div>
          )}
          {settings.map_embed_url ? (
            <iframe
              src={settings.map_embed_url}
              title="Map to Leafclutch Academy"
              className="aspect-[4/3] w-full rounded-2xl border border-line"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : null}
          {faqs.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-extrabold">Quick answers</h2>
              <FaqList items={faqs.slice(0, 5)} />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
