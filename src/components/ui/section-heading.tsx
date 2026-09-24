import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  action,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-sky">{eyebrow}</p>
        )}
        <h2 className="text-balance text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-pretty text-base leading-7 text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
