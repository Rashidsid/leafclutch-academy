import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Sample certificate shown on course pages. Uses the image uploaded in
 * Admin → Site settings when there is one, otherwise a built-in branded design.
 * The built-in design is sized in container units (cqw) so it scales with its width.
 */
export function CertificateSample({
  imageUrl,
  siteName,
  verifyUrl,
  className,
}: {
  imageUrl: string | null;
  siteName: string;
  verifyUrl: string;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`Sample ${siteName} certificate`}
        loading="lazy"
        className={cn("w-full rounded-xl border border-line bg-white object-contain shadow-lift", className)}
      />
    );
  }

  const cq = (n: number) => `${n}cqw`;

  return (
    <div className={cn("@container w-full", className)}>
      <div
        role="img"
        aria-label={`Sample ${siteName} certificate`}
        className="relative w-full overflow-hidden rounded-xl bg-white shadow-lift ring-1 ring-line"
        style={{ aspectRatio: "1.414 / 1", padding: cq(1.6) }}
      >
        <div
          className="relative flex h-full flex-col items-center border-double border-navy text-center"
          style={{ borderWidth: cq(0.7), padding: `${cq(3.6)} ${cq(6.5)}` }}
        >
          {/* corner ornaments */}
          {(
            [
              { pos: "top-0 left-0", sides: ["Top", "Left"] },
              { pos: "top-0 right-0", sides: ["Top", "Right"] },
              { pos: "bottom-0 left-0", sides: ["Bottom", "Left"] },
              { pos: "right-0 bottom-0", sides: ["Bottom", "Right"] },
            ] as const
          ).map(({ pos, sides }) => (
            <span
              key={pos}
              className={cn("pointer-events-none absolute border-sky", pos)}
              style={{
                width: cq(4.5),
                height: cq(4.5),
                margin: cq(0.8),
                borderStyle: "solid",
                borderWidth: 0,
                ...Object.fromEntries(sides.map((side) => [`border${side}Width`, cq(0.45)])),
              }}
              aria-hidden
            />
          ))}

          <div className="flex w-full items-center" style={{ gap: cq(1.2) }}>
            <Image src="/brand/logo-footer.png" alt="" width={64} height={64} style={{ width: cq(6), height: cq(6) }} />
            <div className="text-left leading-none">
              <p className="font-extrabold text-navy" style={{ fontSize: cq(2.6) }}>Leafclutch</p>
              <p className="font-bold text-leaf uppercase" style={{ fontSize: cq(1.3), letterSpacing: "0.3em", marginTop: cq(0.4) }}>
                Academy
              </p>
            </div>
          </div>

          <p className="leading-none font-extrabold tracking-tight text-navy" style={{ fontSize: cq(7.2), marginTop: cq(1) }}>
            Certificate
          </p>
          <p className="font-bold text-ink uppercase" style={{ fontSize: cq(1.8), letterSpacing: "0.25em", marginTop: cq(1) }}>
            of Achievement
          </p>
          <p
            className="rounded bg-navy font-bold text-white uppercase"
            style={{ fontSize: cq(1.4), letterSpacing: "0.12em", padding: `${cq(0.5)} ${cq(2)}`, marginTop: cq(1.4) }}
          >
            Proudly awarded to
          </p>

          <p className="border-b border-dashed border-muted font-serif text-ink/70 italic" style={{ fontSize: cq(3.4), width: "62%", marginTop: cq(2.4), paddingBottom: cq(0.4) }}>
            Learner Name
          </p>
          <p className="text-muted" style={{ fontSize: cq(1.5), marginTop: cq(1.4) }}>
            for successfully completing the professional training program
          </p>
          <p className="border-b border-dashed border-muted font-semibold text-ink/70" style={{ fontSize: cq(2), width: "48%", marginTop: cq(0.8), paddingBottom: cq(0.3) }}>
            Course Title
          </p>

          <div className="mt-auto flex w-full items-end justify-between">
            <p className="text-left leading-tight font-semibold text-navy" style={{ fontSize: cq(1.25), width: "34%" }}>
              Validate this certificate at
              <br />
              <span className="font-bold break-all">{verifyUrl}</span>
            </p>
            <span
              className="flex items-center justify-center rounded-full bg-navy ring-mint/60"
              style={{ width: cq(8.5), height: cq(8.5), boxShadow: `0 0 0 ${cq(0.8)} rgb(59 227 160 / 0.6)` }}
            >
              <Image src="/brand/logo-footer.png" alt="" width={48} height={48} style={{ width: cq(6), height: cq(6) }} />
            </span>
            <div className="text-center" style={{ width: "28%" }}>
              <div className="border-t border-ink/40" />
              <p className="font-semibold text-ink" style={{ fontSize: cq(1.3), marginTop: cq(0.6) }}>
                Authorised Signatory
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
