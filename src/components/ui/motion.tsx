"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

function useInView<T extends Element>(margin = "0px 0px -8% 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, inView] as const;
}

/** Fades and slides its children in the first time they scroll into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "left" | "right" | "zoom";
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-reveal={variant}
      data-shown={inView || undefined}
      className={cn("reveal", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/** Counts a stat like "12", "50%" or "3.5k+" up from zero when it becomes visible. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? Number.parseFloat(match[2]!) : null;
  const decimals = match?.[2]?.includes(".") ? match[2].split(".")[1]!.length : 0;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView || target === null) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const duration = reduced ? 1 : 1400;
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setCurrent(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);

  if (!match || target === null) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={className}>
      {match[1]}
      {current.toFixed(decimals)}
      {match[3]}
    </span>
  );
}
