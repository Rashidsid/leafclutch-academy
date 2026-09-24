import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-surface px-4 text-center">
      <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-navy text-mint">
        <Compass className="size-8" aria-hidden />
      </span>
      <p className="mt-6 text-sm font-bold uppercase tracking-widest text-sky">404</p>
      <h1 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">We could not find that page</h1>
      <p className="mt-3 max-w-md text-muted">The page may have moved, or the course is no longer offered.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonClass("outline")}>Go home</Link>
        <Link href="/courses" className={buttonClass("primary")}>Browse courses</Link>
      </div>
    </main>
  );
}
