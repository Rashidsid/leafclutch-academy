"use client";

import { useActionState } from "react";
import { submitContact } from "@/app/actions";
import { Field, FormAlert, Honeypot, SubmitButton, SuccessPanel, initialFormState } from "./form-parts";

export function ContactForm({ defaultSubject }: { defaultSubject?: string }) {
  const [state, action] = useActionState(submitContact, initialFormState);
  if (state.ok) return <SuccessPanel title="Message sent" message={state.message} />;
  const e = state.errors ?? {};
  const v = state.values ?? {};

  return (
    <form action={action} className="relative grid gap-5 sm:grid-cols-2" noValidate>
      <Honeypot />
      <div className="empty:hidden sm:col-span-2">
        <FormAlert state={state} />
      </div>
      <Field label="Your name" name="name" error={e.name} required>
        <input id="name" name="name" defaultValue={v.name} className="field" autoComplete="name" required />
      </Field>
      <Field label="Email" name="email" error={e.email} required>
        <input id="email" name="email" defaultValue={v.email} type="email" className="field" autoComplete="email" required />
      </Field>
      <Field label="Phone" name="phone" error={e.phone}>
        <input id="phone" name="phone" defaultValue={v.phone} type="tel" className="field" autoComplete="tel" />
      </Field>
      <Field label="Subject" name="subject" error={e.subject}>
        <input id="subject" name="subject" defaultValue={v.subject ?? defaultSubject} className="field" placeholder="Course enquiry, fees, schedule…" />
      </Field>
      <Field label="Message" name="message" error={e.message} required className="sm:col-span-2">
        <textarea id="message" name="message" defaultValue={v.message} rows={5} className="field resize-y" required maxLength={3000} />
      </Field>
      <div className="sm:col-span-2">
        <SubmitButton>Send message</SubmitButton>
      </div>
    </form>
  );
}
