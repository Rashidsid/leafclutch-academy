"use client";

import { useActionState, useState } from "react";
import { submitCorporateInquiry } from "@/app/actions";
import { Field, FormAlert, Honeypot, SubmitButton, SuccessPanel, initialFormState } from "./form-parts";
import { AUDIENCE_LABELS } from "@/lib/format";
import type { Program, ProgramAudience } from "@/lib/types";

export function CorporateForm({ programs }: { programs: Pick<Program, "id" | "title" | "audience">[] }) {
  const [state, action] = useActionState(submitCorporateInquiry, initialFormState);
  const [programId, setProgramId] = useState("");
  const [orgType, setOrgType] = useState<ProgramAudience>("corporate");
  const program = programs.find((p) => p.id === programId);

  if (state.ok) return <SuccessPanel title="Request received" message={state.message} />;
  const e = state.errors ?? {};
  const v = state.values ?? {};

  return (
    <form action={action} className="relative grid gap-5 sm:grid-cols-2" noValidate>
      <Honeypot />
      <div className="empty:hidden sm:col-span-2">
        <FormAlert state={state} />
      </div>
      <Field label="Organisation name" name="organization" error={e.organization} required className="sm:col-span-2">
        <input id="organization" name="organization" defaultValue={v.organization} className="field" autoComplete="organization" required />
      </Field>
      <Field label="Organisation type" name="org_type" error={e.org_type} required>
        <select
          id="org_type"
          name="org_type"
          className="field"
          value={orgType}
          onChange={(ev) => setOrgType(ev.target.value as ProgramAudience)}
        >
          {(Object.keys(AUDIENCE_LABELS) as ProgramAudience[]).map((k) => (
            <option key={k} value={k}>
              {AUDIENCE_LABELS[k]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Program of interest" name="program_id" error={e.program_id}>
        <select
          id="program_id"
          name="program_id"
          className="field"
          value={programId}
          onChange={(ev) => {
            setProgramId(ev.target.value);
            const p = programs.find((x) => x.id === ev.target.value);
            if (p) setOrgType(p.audience);
          }}
        >
          <option value="">Not sure yet</option>
          {programs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
        <input type="hidden" name="program_title" value={program?.title ?? ""} />
      </Field>
      <Field label="Contact person" name="contact_name" error={e.contact_name} required>
        <input id="contact_name" name="contact_name" defaultValue={v.contact_name} className="field" autoComplete="name" required />
      </Field>
      <Field label="Email" name="email" error={e.email} required>
        <input id="email" name="email" defaultValue={v.email} type="email" className="field" autoComplete="email" required />
      </Field>
      <Field label="Phone" name="phone" error={e.phone} required>
        <input id="phone" name="phone" defaultValue={v.phone} type="tel" className="field" autoComplete="tel" required />
      </Field>
      <Field label="Number of participants" name="participants" error={e.participants}>
        <input id="participants" name="participants" defaultValue={v.participants} type="number" min={1} className="field" />
      </Field>
      <Field label="Preferred dates or duration" name="preferred_dates" error={e.preferred_dates} className="sm:col-span-2">
        <input
          id="preferred_dates"
          name="preferred_dates"
          defaultValue={v.preferred_dates}
          className="field"
          placeholder="e.g. Two weeks in Mangsir, weekends only"
        />
      </Field>
      <Field label="Tell us about your goals" name="message" error={e.message} className="sm:col-span-2">
        <textarea id="message" name="message" defaultValue={v.message} rows={4} className="field resize-y" maxLength={3000} />
      </Field>
      <div className="sm:col-span-2">
        <SubmitButton>Request a proposal</SubmitButton>
      </div>
    </form>
  );
}
