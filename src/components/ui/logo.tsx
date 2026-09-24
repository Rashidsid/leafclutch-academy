import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)} aria-label="Leafclutch Academy home">
      <Image src="/brand/logo-footer.png" alt="" width={44} height={44} className="size-10 sm:size-11" priority />
      <span className="flex flex-col leading-none">
        <span className={cn("text-lg font-extrabold tracking-tight sm:text-xl", light ? "text-white" : "text-navy")}>
          Leafclutch
        </span>
        <span
          className={cn(
            "mt-0.5 text-[10px] font-bold uppercase tracking-[0.32em]",
            light ? "text-mint" : "text-leaf",
          )}
        >
          Academy
        </span>
      </span>
    </Link>
  );
}
