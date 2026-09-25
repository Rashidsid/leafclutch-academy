"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Building, CircleCheck, Laptop, Shuffle, Tag } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatNpr, MODE_LABELS } from "@/lib/format";
import type { ModePrice } from "@/lib/pricing";
import type { Installment, LearningMode } from "@/lib/types";

const ICONS: Record<LearningMode, typeof Laptop> = { online: Laptop, hybrid: Shuffle, physical: Building };

/** Sidebar price box: pick Online, Hybrid or Physical and the price, discount and enroll link follow. */
export function ModePriceCard({
  prices,
  installments,
  courseSlug,
}: {
  prices: ModePrice[];
  installments: Installment[];
  courseSlug: string;
}) {
  const [mode, setMode] = useState<LearningMode>(prices[0]?.mode ?? "online");
  const current = prices.find((p) => p.mode === mode) ?? prices[0];
  if (!current) return null;

  const first = installments[0];
  const startAmount = first ? Math.round((current.final * first.percent) / 100) : null;
  const saving = current.price - current.final;

  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      {prices.length > 1 && (
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-ink">Choose your class type</legend>
          <div className={cn("grid gap-2", prices.length === 3 ? "grid-cols-3" : "grid-cols-2")} role="radiogroup">
            {prices.map((p) => {
              const Icon = ICONS[p.mode];
              const active = p.mode === mode;
              return (
                <button
                  key={p.mode}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setMode(p.mode)}
                  className={cn(
                    "relative flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-center transition duration-200",
                    active ? "border-navy bg-navy text-white shadow-lift" : "border-line bg-white text-ink hover:border-navy/40 hover:bg-tint",
                  )}
                >
                  {p.discount > 0 && (
                    <span className={cn("absolute -top-2 right-1.5 rounded-full px-1.5 text-[10px] font-extrabold", active ? "bg-mint text-navy-900" : "bg-emerald-600 text-white")}>
                      -{p.discount}%
                    </span>
                  )}
                  <Icon className={cn("size-4", active ? "text-mint" : "text-navy")} aria-hidden />
                  <span className="text-[13px] font-bold">{MODE_LABELS[p.mode]}</span>
                  <span className={cn("text-[11px]", active ? "text-white/80" : "text-muted")}>{formatNpr(p.final)}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className={cn(prices.length > 1 && "mt-5")}>
        <p className="text-sm font-medium text-muted">{MODE_LABELS[current.mode]} class fee</p>
        <div key={current.mode} className="animate-pop flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-3xl font-extrabold text-navy">{formatNpr(current.final)}</p>
          {current.discount > 0 && (
            <>
              <s className="text-lg font-semibold text-muted">{formatNpr(current.price)}</s>
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-extrabold text-white">
                <Tag className="size-3" aria-hidden /> {current.discount}% OFF
              </span>
            </>
          )}
        </div>
        {saving > 0 && <p className="mt-1 text-sm font-semibold text-emerald-700">You save {formatNpr(saving)}</p>}
        {startAmount !== null && first && (
          <p className="mt-1 text-sm text-slate-600">
            Start with <strong className="text-ink">{formatNpr(startAmount)}</strong> ({first.percent}% at enrollment)
          </p>
        )}
      </div>

      <p className="mt-4 flex items-start gap-1.5 rounded-lg bg-tint px-3 py-2 text-xs leading-5 text-slate-700">
        <CircleCheck className="mt-0.5 size-3.5 shrink-0 text-navy" aria-hidden />
        Same curriculum, mentors, recordings and certificate in every class type.
      </p>

      <Link href={`/enroll?course=${courseSlug}&mode=${current.mode}`} className={buttonClass("primary", "lg", "mt-5 w-full")}>
        Enroll now <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
