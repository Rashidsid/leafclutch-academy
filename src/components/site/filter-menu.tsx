"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface FilterOption {
  href: string;
  label: string;
  selected: boolean;
}

/** Pill dropdown for the course filters. Closes on outside click, Escape, or choosing an option. */
export function FilterMenu({ label, active, options }: { label: string; active: boolean; options: FilterOption[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-4 py-2 text-[15px] font-semibold transition",
          active || open ? "border-navy bg-tint text-navy" : "border-line bg-white text-ink hover:border-slate-400",
        )}
      >
        {label}
        <ChevronDown className={cn("size-4 transition", open && "rotate-180")} aria-hidden />
      </button>
      {open && (
        <div role="listbox" className="animate-pop absolute left-0 z-30 mt-2 min-w-56 origin-top-left rounded-xl border border-line bg-white p-1.5 shadow-lift">
          {options.map((o) => (
            <Link
              key={o.href + o.label}
              href={o.href}
              role="option"
              aria-selected={o.selected}
              scroll={false}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center justify-between gap-4 rounded-lg px-3 py-2 text-sm hover:bg-tint",
                o.selected ? "font-bold text-navy" : "text-ink",
              )}
            >
              {o.label}
              {o.selected && <Check className="size-4" aria-hidden />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
