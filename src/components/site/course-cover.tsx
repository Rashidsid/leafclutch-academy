import Image from "next/image";
import { Sparkles } from "lucide-react";
import { IconByName } from "@/lib/icons";
import { cn } from "@/lib/cn";
import type { Course } from "@/lib/types";

type CoverCourse = Pick<Course, "title" | "icon" | "accent" | "thumbnail_url" | "is_ai_integrated" | "badge">;

/**
 * Course artwork. Uses the uploaded thumbnail when there is one, otherwise draws a
 * branded banner (accent gradient, large icon, title ribbon) in the style of a
 * professional-certificate cover.
 */
export function CourseCover({
  course,
  size = "card",
  showBadges = true,
  className,
}: {
  course: CoverCourse;
  size?: "thumb" | "card" | "hero";
  showBadges?: boolean;
  className?: string;
}) {
  const accent = course.accent || "#072069";
  const thumb = size === "thumb";

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden",
        thumb ? "aspect-square rounded-lg" : "aspect-[16/9] rounded-xl",
        className,
      )}
      style={{ background: `linear-gradient(135deg, ${accent} 0%, color-mix(in srgb, ${accent} 55%, #04133f) 100%)` }}
    >
      {course.thumbnail_url ? (
        <img src={course.thumbnail_url} alt="" loading="lazy" className="absolute inset-0 -z-10 size-full object-cover" />
      ) : (
        <>
          {/* decorative shapes */}
          <div className="absolute -top-1/3 -right-1/4 -z-10 aspect-square w-[85%] rounded-full bg-white/10" />
          <div className="absolute -right-[8%] -bottom-1/2 -z-10 aspect-square w-[60%] rounded-full bg-mint/25" />
          <div className="absolute top-1/2 -left-[10%] -z-10 aspect-square w-[35%] rounded-full bg-sky/25 blur-xl" />
          <div
            className={cn(
              "absolute flex items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur-sm",
              thumb ? "inset-[22%] rounded-lg" : "top-[44%] right-[9%] size-[30%] max-w-40 -translate-y-1/2",
              size === "hero" && "size-[30%]",
            )}
          >
            <IconByName name={course.icon} className={cn("text-white", thumb ? "size-1/2" : "size-1/2")} strokeWidth={1.5} />
          </div>
          {!thumb && (
            <span
              className={cn(
                "absolute right-0 bottom-[10%] line-clamp-2 max-w-[82%] rounded-l-lg bg-white/95 py-1.5 pr-3 pl-3.5 text-right leading-tight font-extrabold tracking-wide text-navy uppercase shadow-sm",
                course.title.length > 16 ? "text-[11px] sm:text-xs" : "text-[13px] sm:text-sm",
              )}
            >
              {course.title}
            </span>
          )}
        </>
      )}

      {!thumb && (
        <span className="absolute top-0 left-4 flex h-11 w-9 items-start justify-center rounded-b-lg bg-white pt-1.5 shadow-sm">
          <Image src="/brand/logo-footer.png" alt="" width={24} height={24} className="size-6" />
        </span>
      )}
      {showBadges && !thumb && course.is_ai_integrated && (
        <span className="absolute top-2.5 left-15 inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-navy uppercase shadow-sm">
          <Sparkles className="size-3 text-sky" aria-hidden /> AI Integrated
        </span>
      )}
    </div>
  );
}
