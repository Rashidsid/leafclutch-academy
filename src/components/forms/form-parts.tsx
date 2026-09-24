"use client";

import { useFormStatus } from "react-dom";
import { CircleCheck, LoaderCircle, TriangleAlert } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { FormState } from "@/app/actions";

export const initialFormState: FormState = { ok: false, message: "" };

export function Field({
  label,
  name,
  error,
  required,
  hint,
  className,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="label">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="mt-1.5 text-xs font-medium text-rose-600">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

/** Invisible field that only bots fill in. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function SubmitButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClass("primary", "lg", cn("w-full", className))}>
      {pending ? <LoaderCircle className="size-5 animate-spin" aria-hidden /> : null}
      {pending ? "Sending…" : children}
    </button>
  );
}

export function FormAlert({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <div
      role={state.ok ? "status" : "alert"}
      className={cn(
        "flex gap-3 rounded-xl p-4 text-sm",
        state.ok ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200" : "bg-rose-50 text-rose-800 ring-1 ring-rose-200",
      )}
    >
      {state.ok ? <CircleCheck className="size-5 shrink-0" aria-hidden /> : <TriangleAlert className="size-5 shrink-0" aria-hidden />}
      <p>{state.message}</p>
    </div>
  );
}

export function SuccessPanel({ title, message, children }: { title: string; message: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50/60 px-6 py-12 text-center">
      <span className="inline-flex size-14 items-center justify-center rounded-full bg-emerald-500 text-white">
        <CircleCheck className="size-7" aria-hidden />
      </span>
      <h3 className="mt-5 text-xl font-extrabold text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">{message}</p>
      {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}
