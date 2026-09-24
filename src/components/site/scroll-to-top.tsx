"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/cn";

/** Floating "back to top" button with a ring that fills as you scroll. */
export function ScrollToTop() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const visible = progress > 0.08;
  const r = 22;
  const c = 2 * Math.PI * r;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className={cn(
        "fixed right-4 bottom-38 z-30 inline-flex size-13 items-center justify-center rounded-full bg-navy text-white shadow-lift transition duration-300 hover:-translate-y-1 hover:bg-navy-700 lg:right-6 lg:bottom-24 lg:size-14",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 52 52" aria-hidden>
        <circle cx="26" cy="26" r={r} fill="none" stroke="rgb(255 255 255 / 0.15)" strokeWidth="3" />
        <circle
          cx="26"
          cy="26"
          r={r}
          fill="none"
          stroke="#3be3a0"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - progress)}
        />
      </svg>
      <ChevronUp className="relative size-6" />
    </button>
  );
}
