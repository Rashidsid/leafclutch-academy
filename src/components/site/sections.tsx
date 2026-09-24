import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Briefcase,
  Building,
  CircleCheck,
  ClipboardCheck,
  Hammer,
  Laptop,
  MessagesSquare,
  PlayCircle,
  Play,
  Shuffle,
  Users,
  Video,
} from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/ui/brand-icons";
import { cn } from "@/lib/cn";
import { MODE_DETAILS, whatsappLink } from "@/lib/format";
import type { FaqItem, LearningMode } from "@/lib/types";

/* ------------------------------------------------------------------ */

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  breadcrumb,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  breadcrumb?: { href: string; label: string }[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-tint">
      <div className="animate-drift absolute -top-24 -right-24 size-96 rounded-full bg-white/60" aria-hidden />
      <div className="absolute top-10 right-40 hidden size-40 rounded-full border-18 border-mint/30 lg:block" aria-hidden />
      <div className="container-x relative animate-fade-up py-10 sm:py-14">
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="mb-5 text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/" className="hover:text-navy hover:underline">Home</Link></li>
              {breadcrumb.map((b) => (
                <li key={b.href} className="flex items-center gap-1.5">
                  <span aria-hidden>›</span>
                  <Link href={b.href} className="hover:text-navy hover:underline">{b.label}</Link>
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="mb-2 text-sm font-bold text-navy">{eyebrow}</p>}
        <h1 className="max-w-3xl text-balance text-3xl font-bold tracking-tight text-ink sm:text-[44px] sm:leading-[1.1]">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-slate-600 sm:text-lg">{description}</p>}
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function FaqList({ items, className }: { items: FaqItem[]; className?: string }) {
  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((f, i) => (
        <details key={i} className="group" name="faq">
          <summary className="flex cursor-pointer list-none items-center gap-4 px-1 py-4 text-left font-semibold text-ink transition hover:text-navy">
            <Play className="size-3.5 shrink-0 fill-ink text-ink transition group-open:rotate-90" aria-hidden />
            <span className="flex-1 text-[16px]">{f.question}</span>
          </summary>
          <p className="pr-2 pb-5 pl-8 text-[15px] leading-7 text-slate-600">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */

const MODE_ICONS: Record<LearningMode, typeof Laptop> = { online: Laptop, hybrid: Shuffle, physical: Building };

export function ModeCards({ modes = ["online", "hybrid", "physical"], compact = false }: { modes?: LearningMode[]; compact?: boolean }) {
  return (
    <div className={cn("grid gap-4", compact ? "sm:grid-cols-3" : "md:grid-cols-3")}>
      {modes.map((m, i) => {
        const d = MODE_DETAILS[m];
        const Icon = MODE_ICONS[m];
        const featured = m === "hybrid" && !compact;
        return (
          <div
            key={m}
            className={cn(
              "relative flex flex-col rounded-2xl border p-6 transition hover:-translate-y-1",
              featured ? "border-navy bg-navy text-white shadow-lift" : "border-line bg-white shadow-card",
              compact && "p-5",
            )}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {featured && (
              <span className="absolute top-5 right-5 rounded-full bg-mint px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-navy-900">
                Most flexible
              </span>
            )}
            <span
              className={cn(
                "inline-flex size-12 items-center justify-center rounded-xl",
                featured ? "bg-white/10 text-mint" : "bg-tint text-navy",
              )}
            >
              <Icon className="size-6" aria-hidden />
            </span>
            <h3 className="mt-4 text-xl font-extrabold">{d.title}</h3>
            <p className={cn("mt-2 text-sm leading-6", featured ? "text-white/75" : "text-muted")}>{d.summary}</p>
            {!compact && (
              <ul className="mt-5 space-y-2.5 text-sm">
                {d.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <CircleCheck className={cn("mt-0.5 size-4 shrink-0", featured ? "text-mint" : "text-leaf")} aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export const INCLUDE_ICONS = [Video, PlayCircle, Hammer, MessagesSquare, Briefcase, Award, Users, BadgeCheck];

export function IncludesGrid({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item, i) => {
        const Icon = INCLUDE_ICONS[i % INCLUDE_ICONS.length]!;
        return (
          <li
            key={item}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-3.5 text-sm font-medium",
              dark ? "border-white/10 bg-white/5 text-white" : "border-line bg-white text-ink",
            )}
          >
            <span
              className={cn(
                "inline-flex size-9 shrink-0 items-center justify-center rounded-lg",
                dark ? "bg-white/10 text-mint" : "bg-tint text-navy",
              )}
            >
              <Icon className="size-[18px]" aria-hidden />
            </span>
            {item}
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */

const JOURNEY = [
  { icon: Laptop, title: "Learn", text: "Three months of live classes with recordings, guided by working mentors." },
  { icon: Hammer, title: "Build", text: "Weekly assignments and real projects that grow into your portfolio." },
  { icon: ClipboardCheck, title: "Get evaluated", text: "Your capstone and project work are reviewed against industry standards." },
  { icon: Briefcase, title: "Intern", text: "Learners who meet the standard are promoted to a supervised internship." },
  { icon: Award, title: "Get certified", text: "Earn a certificate employers can verify online with a unique code." },
];

export function Journey() {
  return (
    <ol className="relative grid gap-6 md:grid-cols-5 md:gap-4">
      <div className="absolute top-7 right-[10%] left-[10%] hidden h-0.5 bg-navy/15 md:block" aria-hidden />
      {JOURNEY.map((s, i) => (
        <li key={s.title} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
          <span className="relative z-10 inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white text-navy shadow-card ring-1 ring-line">
            <s.icon className="size-6" aria-hidden />
            <span className="absolute -top-2 -right-2 inline-flex size-6 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
              {i + 1}
            </span>
          </span>
          <div>
            <h3 className="font-extrabold text-ink md:mt-4">{s.title}</h3>
            <p className="mt-1 text-sm leading-6 text-muted">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */

export function CtaBand({
  title = "Ready to start your tech career?",
  text = "Talk to our counsellors for free. We will help you choose the right course, mode and batch.",
  whatsapp,
}: {
  title?: string;
  text?: string;
  whatsapp?: string | null;
}) {
  const wa = whatsappLink(whatsapp, "Hi Leafclutch Academy, I would like to know more about your courses.");
  return (
    <section className="container-x py-14">
      <div className="relative overflow-hidden rounded-3xl bg-navy px-6 py-12 text-white sm:px-12">
        <div className="animate-drift absolute -top-20 -right-10 size-64 rounded-full bg-navy-700" aria-hidden />
        <div className="absolute -bottom-24 left-1/3 size-56 rounded-full border-[30px] border-navy-700/70" aria-hidden />
        <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
            <p className="mt-3 text-white/90">{text}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/enroll" className={buttonClass("white", "lg")}>
              Enroll now <ArrowRight className="size-4" aria-hidden />
            </Link>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClass("whatsapp", "lg")}>
                <WhatsappIcon className="size-5" /> Chat on WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function WhatsAppFloat({ number }: { number: string | null }) {
  const href = whatsappLink(number, "Hi Leafclutch Academy, I have a question about your courses.");
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-4 bottom-20 z-30 inline-flex size-13 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_10px_30px_-8px_rgb(37_211_102/0.7)] transition hover:scale-110 lg:right-6 lg:bottom-6 lg:size-14"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-whatsapp/40 [animation-duration:2.5s]" aria-hidden />
      <WhatsappIcon className="relative size-7" />
    </a>
  );
}
