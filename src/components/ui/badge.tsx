import { cn } from "@/lib/cn";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-tint px-2.5 py-1 text-xs font-semibold text-navy ring-1 ring-inset ring-navy/10",
        className,
      )}
    >
      {children}
    </span>
  );
}
