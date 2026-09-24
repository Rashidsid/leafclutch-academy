"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { Building, Laptop, Shuffle } from "lucide-react";
import { submitEnrollment } from "@/app/actions";
import { buttonClass } from "@/components/ui/button";
import { Field, FormAlert, Honeypot, SubmitButton, SuccessPanel, initialFormState } from "./form-parts";
import { cn } from "@/lib/cn";
import { formatDate, formatNpr, MODE_DETAILS, MODE_LABELS } from "@/lib/format";
import type { Batch, Installment, LearningMode } from "@/lib/types";

export interface EnrollCourse {
  id: string;
  slug: string;
  title: string;
  fee: number;
  modes: LearningMode[];
  installments: Installment[];
}

const MODE_ICONS = { online: Laptop, hybrid: Shuffle, physical: Building } as const;

export function EnrollForm({
  courses,
  batches,
  defaultCourse,
  defaultMode,
  defaultBatch,
}: {
  courses: EnrollCourse[];
  batches: Pick<Batch, "id" | "course_id" | "start_date" | "mode" | "schedule" | "status">[];
  defaultCourse?: string;
  defaultMode?: LearningMode;
  defaultBatch?: string;
}) {
  const [state, action] = useActionState(submitEnrollment, initialFormState);
  const [courseId, setCourseId] = useState(
    () => courses.find((c) => c.slug === defaultCourse || c.id === defaultCourse)?.id ?? "",
  );
  const course = courses.find((c) => c.id === courseId);
  const [mode, setMode] = useState<LearningMode>(defaultMode ?? "online");
  const courseBatches = useMemo(
    () => batches.filter((b) => b.course_id === courseId && b.status !== "full" && b.status !== "closed"),
    [batches, courseId],
  );

  if (state.ok) {
    return (
      <SuccessPanel title="Enrollment request received" message={state.message}>
        <Link href="/courses" className={buttonClass("outline")}>Explore more courses</Link>
        <Link href="/" className={buttonClass("primary")}>Back to home</Link>
      </SuccessPanel>
    );
  }

  const e = state.errors ?? {};
  const v = state.values ?? {};
  const modes: LearningMode[] = course?.modes.length ? course.modes : ["online", "hybrid", "physical"];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <form action={action} className="relative space-y-5" noValidate>
        <Honeypot />
        <FormAlert state={state} />

        <Field label="Course" name="course_id" error={e.course_id} required>
          <select
            id="course_id"
            name="course_id"
            className="field"
            value={courseId}
            onChange={(ev) => setCourseId(ev.target.value)}
            required
          >
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({formatNpr(c.fee)})
              </option>
            ))}
          </select>
          <input type="hidden" name="course_title" value={course?.title ?? ""} />
        </Field>

        <fieldset>
          <legend className="label">
            Learning mode <span className="text-rose-500">*</span>
          </legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {modes.map((m) => {
              const Icon = MODE_ICONS[m];
              return (
                <label
                  key={m}
                  className={cn(
                    "cursor-pointer rounded-xl border p-3.5 transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-sky/30",
                    mode === m ? "border-sky bg-sky/5 ring-4 ring-sky/10" : "border-line hover:border-navy/30",
                  )}
                >
                  <input
                    type="radio"
                    name="mode"
                    value={m}
                    checked={mode === m}
                    onChange={() => setMode(m)}
                    className="sr-only"
                  />
                  <span className="flex items-center gap-2 font-bold text-ink">
                    <Icon className="size-4 text-sky" aria-hidden /> {MODE_LABELS[m]}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-muted">{MODE_DETAILS[m].summary}</span>
                </label>
              );
            })}
          </div>
          {e.mode && <p className="mt-1.5 text-xs font-medium text-rose-600">{e.mode}</p>}
        </fieldset>

        {courseBatches.length > 0 && (
          <Field label="Preferred batch" name="batch_id" hint="Optional. We will confirm the timing with you.">
            <select id="batch_id" name="batch_id" className="field" defaultValue={v.batch_id ?? defaultBatch ?? ""}>
              <option value="">Next available batch</option>
              {courseBatches.map((b) => (
                <option key={b.id} value={b.id}>
                  {formatDate(b.start_date)} · {MODE_LABELS[b.mode]}
                  {b.schedule ? ` · ${b.schedule}` : ""}
                </option>
              ))}
            </select>
          </Field>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" name="full_name" error={e.full_name} required className="sm:col-span-2">
            <input id="full_name" name="full_name" defaultValue={v.full_name} className="field" autoComplete="name" required maxLength={120} />
          </Field>
          <Field label="Email" name="email" error={e.email} required>
            <input id="email" name="email" defaultValue={v.email} type="email" className="field" autoComplete="email" required />
          </Field>
          <Field label="Phone / WhatsApp" name="phone" error={e.phone} required>
            <input id="phone" name="phone" defaultValue={v.phone} type="tel" className="field" autoComplete="tel" placeholder="98XXXXXXXX" required />
          </Field>
          <Field label="Current education or job" name="education" error={e.education} className="sm:col-span-2">
            <input
              id="education"
              name="education"
              defaultValue={v.education}
              className="field"
              placeholder="e.g. BSc CSIT 3rd year, +2 Science, Accountant"
            />
          </Field>
          <Field label="Anything we should know?" name="message" error={e.message} className="sm:col-span-2">
            <textarea id="message" name="message" defaultValue={v.message} rows={4} className="field resize-y" maxLength={2000} />
          </Field>
        </div>

        <SubmitButton>Submit enrollment request</SubmitButton>
        <p className="text-center text-xs text-muted">
          No payment is taken online. Our team will call you to confirm your seat and share payment details.
        </p>
      </form>

      <aside className="h-fit rounded-2xl border border-line bg-surface p-5 lg:sticky lg:top-28">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted">Payment summary</h3>
        {course ? (
          <>
            <p className="mt-3 font-bold text-ink">{course.title}</p>
            <p className="text-sm text-muted">{MODE_LABELS[mode]} · same fee for every mode</p>
            <dl className="mt-4 space-y-3 border-t border-line pt-4 text-sm">
              {course.installments.map((ins) => (
                <div key={ins.label} className="flex justify-between gap-4">
                  <dt>
                    <span className="font-semibold text-ink">{ins.label}</span>
                    <span className="block text-xs text-muted">{ins.note}</span>
                  </dt>
                  <dd className="whitespace-nowrap font-bold text-navy">{formatNpr(Math.round((course.fee * ins.percent) / 100))}</dd>
                </div>
              ))}
              <div className="flex justify-between border-t border-line pt-3 text-base">
                <dt className="font-bold text-ink">Total fee</dt>
                <dd className="font-extrabold text-navy">{formatNpr(course.fee)}</dd>
              </div>
            </dl>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted">Choose a course to see the fee and payment plan.</p>
        )}
      </aside>
    </div>
  );
}
