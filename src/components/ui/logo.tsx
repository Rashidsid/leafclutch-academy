import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

/** Company logo (public/brand/logo-full.png, a trimmed copy of public/logo.png). */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex shrink-0 items-center", className)} aria-label="Leafclutch Academy home">
      <Image
        src="/brand/logo-full.png"
        alt="Leafclutch Technologies"
        width={720}
        height={225}
        priority
        className="h-10 w-auto sm:h-11"
      />
    </Link>
  );
}
