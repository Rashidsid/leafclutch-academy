"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CircleCheck, ExternalLink, LoaderCircle, Save, TriangleAlert } from "lucide-react";
import { saveResource, saveSettings } from "@/app/admin/actions";
import { buttonClass } from "@/components/ui/button";
import {
  CheckboxGroup,
  ColorField,
  CurriculumField,
  FaqsField,
  IconField,
  ImageField,
  InstallmentsField,
  ListField,
  StatsField,
  UdemyField,
  PricingField,
} from "./fields";
import { cn } from "@/lib/cn";
import { slugify } from "@/lib/format";
import type { Field, Group, Option, OptionSource } from "@/lib/admin/resources";

type Values = Record<string, unknown>;

export function ResourceForm({
  resourceKey,
  id,
  groups,
  initial,
  options,
  publicUrl,
  settings = false,
}: {
  resourceKey: string;
  id: string | null;
  groups: Group[];
  initial: Values;
  options: Partial<Record<OptionSource, Option[]>>;
  publicUrl?: string | null;
  settings?: boolean;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(initial);
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [dirty, setDirty] = useState(false);

  const set = (name: string, value: unknown) => {
    setValues((v) => ({ ...v, [name]: value }));
    setDirty(true);
  };

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    start(async () => {
      const result = settings ? await saveSettings(values) : await saveResource(resourceKey, id, values);
      if (!result.ok) {
        setStatus({ ok: false, message: result.error ?? "Could not save." });
        return;
      }
      setDirty(false);
      if (!settings && !id && result.id) {
        router.push(`/admin/${resourceKey}/${result.id}?created=1`);
        return;
      }
      setStatus({ ok: true, message: "Saved. The website has been updated." });
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 pb-24">
      {groups.map((group) => (
        <section key={group.title} className="rounded-2xl border border-line bg-white p-5 shadow-xs sm:p-6">
          <h2 className="text-base font-extrabold text-ink">{group.title}</h2>
          {group.description && <p className="mt-1 text-sm text-muted">{group.description}</p>}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {group.fields.map((field) => (
              <div key={field.name} className={cn(field.wide || isWideType(field) ? "md:col-span-2" : "")}>
                <FieldControl field={field} values={values} set={set} options={options} />
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <div className="min-w-0 flex-1 text-sm">
            {status ? (
              <p className={cn("flex items-center gap-2 font-medium", status.ok ? "text-emerald-700" : "text-rose-700")} role={status.ok ? "status" : "alert"}>
                {status.ok ? <CircleCheck className="size-4 shrink-0" /> : <TriangleAlert className="size-4 shrink-0" />}
                <span className="truncate">{status.message}</span>
              </p>
            ) : dirty ? (
              <p className="text-amber-700">You have unsaved changes.</p>
            ) : (
              <p className="text-muted">All changes saved.</p>
            )}
          </div>
          {publicUrl && (
            <a href={publicUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("outline", "md")}>
              <ExternalLink className="size-4" aria-hidden /> View on site
            </a>
          )}
          <button type="submit" disabled={pending} className={buttonClass("primary", "md", "min-w-32")}>
            {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Save className="size-4" aria-hidden />}
            {pending ? "Saving…" : id || settings ? "Save changes" : "Create"}
          </button>
        </div>
      </div>
    </form>
  );
}

/** Amount used to preview installments: the cheapest enabled mode, else the stored fee. */
function previewFee(values: Values) {
  const pricing = values.pricing as Record<string, { enabled?: boolean; price?: string; discount?: string }> | undefined;
  const finals = Object.values(pricing ?? {})
    .filter((p) => p?.enabled && Number(p.price) > 0)
    .map((p) => Math.round((Number(p.price) * (100 - (Number(p.discount) || 0))) / 100));
  return finals.length ? Math.min(...finals) : Number(values.fee) || 0;
}

function isWideType(field: Field) {
  return ["curriculum", "faqs", "installments", "stats", "relation", "list", "udemy", "pricing"].includes(field.type);
}

function FieldControl({
  field,
  values,
  set,
  options,
}: {
  field: Field;
  values: Values;
  set: (name: string, value: unknown) => void;
  options: Partial<Record<OptionSource, Option[]>>;
}) {
  const id = `f-${field.name}`;
  const raw = values[field.name];
  const str = raw == null ? "" : String(raw);
  const opts = field.options ?? (field.optionsFrom ? options[field.optionsFrom] ?? [] : []);

  const label = (
    <label htmlFor={id} className="label">
      {field.label} {field.required && <span className="text-rose-500">*</span>}
    </label>
  );
  const help = field.help ? <p className="mt-1.5 text-xs text-muted">{field.help}</p> : null;

  switch (field.type) {
    case "switch":
      return (
        <div>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-line px-4 py-3">
            <span className="text-sm font-semibold text-ink">{field.label}</span>
            <span className="relative inline-flex">
              <input type="checkbox" className="peer sr-only" checked={raw === true} onChange={(e) => set(field.name, e.target.checked)} />
              <span className="h-6 w-11 rounded-full bg-line transition peer-checked:bg-navy peer-focus-visible:ring-4 peer-focus-visible:ring-sky/30" />
              <span className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
            </span>
          </label>
          {help}
        </div>
      );
    case "textarea":
      return (
        <div>
          {label}
          <textarea id={id} className="field" rows={field.rows ?? 3} value={str} placeholder={field.placeholder} onChange={(e) => set(field.name, e.target.value)} />
          {help}
        </div>
      );
    case "number":
      return (
        <div>
          {label}
          <input id={id} type="number" className="field" value={str} placeholder={field.placeholder} onChange={(e) => set(field.name, e.target.value)} />
          {help}
        </div>
      );
    case "date":
      return (
        <div>
          {label}
          <input id={id} type="date" className="field" value={str.slice(0, 10)} onChange={(e) => set(field.name, e.target.value)} />
          {help}
        </div>
      );
    case "select":
      return (
        <div>
          {label}
          <select id={id} className="field" value={str} onChange={(e) => set(field.name, e.target.value)}>
            <option value="">{field.required ? "Select…" : "None"}</option>
            {opts.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {help}
        </div>
      );
    case "slug": {
      const source = String(values[field.from ?? ""] ?? "");
      return (
        <div>
          {label}
          <div className="flex gap-2">
            <input id={id} className="field font-mono text-[13px]" value={str} placeholder={slugify(source) || "auto-generated"} onChange={(e) => set(field.name, e.target.value)} />
            <button type="button" className={buttonClass("outline", "md")} onClick={() => set(field.name, slugify(source))}>
              Generate
            </button>
          </div>
          {help}
        </div>
      );
    }
    case "image":
      return (
        <div>
          {label}
          <ImageField id={id} value={str} onChange={(v) => set(field.name, v)} folder={field.folder} />
          {help}
        </div>
      );
    case "color":
      return (
        <div>
          {label}
          <ColorField id={id} value={str} onChange={(v) => set(field.name, v)} />
          {help}
        </div>
      );
    case "icon":
      return (
        <div>
          <p className="label">{field.label}</p>
          <IconField value={str} onChange={(v) => set(field.name, v)} />
          {help}
        </div>
      );
    case "list":
      return (
        <div>
          {label}
          <ListField id={id} value={(raw as string[]) ?? []} onChange={(v) => set(field.name, v)} />
          {help}
        </div>
      );
    case "modes":
    case "relation":
      return (
        <div>
          <p className="label">{field.label}</p>
          <CheckboxGroup options={opts} value={(raw as string[]) ?? []} onChange={(v) => set(field.name, v)} />
          {help}
        </div>
      );
    case "curriculum":
      return <CurriculumField value={(raw as never) ?? []} onChange={(v) => set(field.name, v)} />;
    case "faqs":
      return <FaqsField value={(raw as never) ?? []} onChange={(v) => set(field.name, v)} />;
    case "installments":
      return (
        <div>
          <p className="label">{field.label}</p>
          <InstallmentsField value={(raw as never) ?? []} onChange={(v) => set(field.name, v)} fee={previewFee(values)} />
        </div>
      );
    case "pricing":
      return (
        <div>
          <p className="label">{field.label}</p>
          <PricingField value={raw as never} onChange={(v) => set(field.name, v)} />
        </div>
      );
    case "udemy":
      return <UdemyField value={(raw as never) ?? []} onChange={(v) => set(field.name, v)} />;
    case "stats":
      return <StatsField value={(raw as never) ?? []} onChange={(v) => set(field.name, v)} />;
    default:
      return (
        <div>
          {label}
          <input id={id} className="field" value={str} placeholder={field.placeholder} onChange={(e) => set(field.name, e.target.value)} />
          {help}
        </div>
      );
  }
}
