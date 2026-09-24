"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, LoaderCircle, Plus, Trash2, X } from "lucide-react";
import { ICONS } from "@/lib/icons";
import { cn } from "@/lib/cn";
import { MEDIA_BUCKET } from "@/lib/supabase/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Option } from "@/lib/admin/resources";
import { curriculumStats, lessonSections, parseOutline, toOutline } from "@/lib/curriculum";
import type { CurriculumModule, CurriculumSection, FaqItem, Installment, Stat } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Small shared bits                                                   */
/* ------------------------------------------------------------------ */

function move<T>(arr: T[], from: number, to: number) {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item!);
  return next;
}

function RowTools({
  index,
  total,
  onMove,
  onRemove,
}: {
  index: number;
  total: number;
  onMove: (to: number) => void;
  onRemove: () => void;
}) {
  const btn = "inline-flex size-8 items-center justify-center rounded-lg text-muted hover:bg-tint hover:text-navy disabled:opacity-30";
  return (
    <div className="flex shrink-0 items-center">
      <button type="button" className={btn} onClick={() => onMove(index - 1)} disabled={index === 0} aria-label="Move up">
        <ArrowUp className="size-4" />
      </button>
      <button type="button" className={btn} onClick={() => onMove(index + 1)} disabled={index === total - 1} aria-label="Move down">
        <ArrowDown className="size-4" />
      </button>
      <button type="button" className={cn(btn, "hover:bg-rose-50 hover:text-rose-600")} onClick={onRemove} aria-label="Remove">
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-2 text-sm font-semibold text-navy hover:border-sky hover:bg-sky/5"
    >
      <Plus className="size-4" aria-hidden /> {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* List of strings                                                     */
/* ------------------------------------------------------------------ */

export function ListField({ value, onChange, id }: { value: string[]; onChange: (v: string[]) => void; id: string }) {
  const [bulk, setBulk] = useState(false);
  if (bulk) {
    return (
      <div>
        <textarea
          id={id}
          className="field font-mono text-[13px]"
          rows={Math.max(4, value.length + 1)}
          value={value.join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n"))}
        />
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>One item per line.</span>
          <button type="button" className="font-semibold text-sky" onClick={() => { onChange(value.map((v) => v.trim()).filter(Boolean)); setBulk(false); }}>
            Done
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            id={i === 0 ? id : undefined}
            className="field"
            value={item}
            onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))}
          />
          <RowTools index={i} total={value.length} onMove={(to) => onChange(move(value, i, to))} onRemove={() => onChange(value.filter((_, j) => j !== i))} />
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-3">
        <AddButton onClick={() => onChange([...value, ""])}>Add item</AddButton>
        <button type="button" className="text-xs font-semibold text-muted hover:text-navy" onClick={() => setBulk(true)}>
          Edit as text
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Curriculum                                                          */
/* ------------------------------------------------------------------ */

export function CurriculumField({ value, onChange }: { value: CurriculumModule[]; onChange: (v: CurriculumModule[]) => void }) {
  // Work on the Lesson → Section → Points shape; older flat lessons are converted on first edit
  const lessons = value.map((l) => ({ title: l.title, sections: lessonSections(l) }));
  const [mode, setMode] = useState<"editor" | "outline">("editor");
  const [outline, setOutline] = useState("");
  const [openLesson, setOpenLesson] = useState<number | null>(lessons.length ? 0 : null);

  const setLessons = (next: { title: string; sections: CurriculumSection[] }[]) => onChange(next);
  const updateLesson = (i: number, patch: Partial<{ title: string; sections: CurriculumSection[] }>) =>
    setLessons(lessons.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const updateSection = (i: number, k: number, patch: Partial<CurriculumSection>) =>
    updateLesson(i, { sections: lessons[i]!.sections.map((s, j) => (j === k ? { ...s, ...patch } : s)) });

  if (mode === "outline") {
    const parsed = parseOutline(outline);
    return (
      <div className="rounded-xl border border-line bg-surface p-4">
        <p className="text-sm text-slate-600">
          Paste or edit the whole syllabus. Use <code className="rounded bg-white px-1"># Lesson</code>,{" "}
          <code className="rounded bg-white px-1">## Section</code> and <code className="rounded bg-white px-1">- point</code> on separate lines.
          Numbering is added automatically.
        </p>
        <textarea
          className="field mt-3 font-mono text-[13px] leading-6"
          rows={Math.min(30, Math.max(12, outline.split("\n").length + 2))}
          value={outline}
          onChange={(e) => setOutline(e.target.value)}
          placeholder={"# Python Programming Language\n## Introduction to Python\n- What exactly is Python?\n- Python installation and IDE setup\n## Python Basics\n- Variables and data types"}
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted">
            Preview: {curriculumStats(parsed).lessons} lessons · {curriculumStats(parsed).sections} sections · {curriculumStats(parsed).points} points
          </p>
          <div className="flex gap-2">
            <button type="button" className="rounded-lg px-3 py-2 text-sm font-semibold text-muted hover:text-navy" onClick={() => setMode("editor")}>
              Cancel
            </button>
            <button
              type="button"
              className="rounded-lg bg-navy px-3 py-2 text-sm font-bold text-white hover:bg-navy-700"
              onClick={() => {
                onChange(parsed);
                setOpenLesson(parsed.length ? 0 : null);
                setMode("editor");
              }}
            >
              Apply outline
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted">
          {curriculumStats(value).lessons} lessons · {curriculumStats(value).sections} sections · {curriculumStats(value).points} points ·
          visitors can download this as a PDF
        </p>
        <button
          type="button"
          onClick={() => {
            setOutline(toOutline(value));
            setMode("outline");
          }}
          className="text-sm font-semibold text-navy hover:underline"
        >
          Edit as outline / paste syllabus
        </button>
      </div>

      {lessons.map((lesson, i) => {
        const open = openLesson === i;
        return (
          <div key={i} className="overflow-hidden rounded-xl border border-line bg-surface">
            <div className="flex items-center gap-2 p-3">
              <button
                type="button"
                onClick={() => setOpenLesson(open ? null : i)}
                aria-expanded={open}
                aria-label={open ? "Collapse lesson" : "Expand lesson"}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-navy text-xs font-bold text-white"
              >
                {i + 1}
              </button>
              <input
                className="field font-semibold"
                placeholder="Lesson title, e.g. Python Programming Language"
                value={lesson.title}
                onChange={(e) => updateLesson(i, { title: e.target.value })}
                aria-label={`Lesson ${i + 1} title`}
              />
              <RowTools
                index={i}
                total={lessons.length}
                onMove={(to) => setLessons(move(lessons, i, to))}
                onRemove={() => setLessons(lessons.filter((_, j) => j !== i))}
              />
            </div>
            {open ? (
              <div className="space-y-3 border-t border-line bg-white p-3 sm:pl-13">
                {lesson.sections.map((section, k) => (
                  <div key={k} className="rounded-lg border border-line p-3">
                    <div className="flex items-center gap-2">
                      <span className="w-10 shrink-0 text-sm font-bold text-navy">
                        {i + 1}.{k + 1}
                      </span>
                      <input
                        className="field"
                        placeholder="Section title, e.g. Introduction to Python"
                        value={section.title}
                        onChange={(e) => updateSection(i, k, { title: e.target.value })}
                        aria-label={`Section ${i + 1}.${k + 1} title`}
                      />
                      <RowTools
                        index={k}
                        total={lesson.sections.length}
                        onMove={(to) => updateLesson(i, { sections: move(lesson.sections, k, to) })}
                        onRemove={() => updateLesson(i, { sections: lesson.sections.filter((_, j) => j !== k) })}
                      />
                    </div>
                    <textarea
                      className="field mt-2"
                      rows={Math.max(3, section.points.length + 1)}
                      placeholder={"One point per line\nWhat exactly is Python?\nPython installation and IDE setup"}
                      value={section.points.join("\n")}
                      onChange={(e) => updateSection(i, k, { points: e.target.value.split("\n") })}
                      aria-label={`Section ${i + 1}.${k + 1} points`}
                    />
                  </div>
                ))}
                <AddButton onClick={() => updateLesson(i, { sections: [...lesson.sections, { title: "", points: [] }] })}>
                  Add section
                </AddButton>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setOpenLesson(i)}
                className="w-full border-t border-line bg-white px-4 py-2 text-left text-xs text-muted hover:text-navy"
              >
                {lesson.sections.length} sections · {lesson.sections.reduce((n, s) => n + s.points.filter((p) => p.trim()).length, 0)} points ·
                click to edit
              </button>
            )}
          </div>
        );
      })}
      <AddButton
        onClick={() => {
          setLessons([...lessons, { title: "", sections: [{ title: "", points: [] }] }]);
          setOpenLesson(lessons.length);
        }}
      >
        Add lesson
      </AddButton>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FAQs                                                                */
/* ------------------------------------------------------------------ */

export function FaqsField({ value, onChange }: { value: FaqItem[]; onChange: (v: FaqItem[]) => void }) {
  const update = (i: number, patch: Partial<FaqItem>) => onChange(value.map((f, j) => (j === i ? { ...f, ...patch } : f)));
  return (
    <div className="space-y-3">
      {value.map((f, i) => (
        <div key={i} className="rounded-xl border border-line bg-surface p-4">
          <div className="flex items-center gap-2">
            <input className="field font-semibold" placeholder="Question" value={f.question} onChange={(e) => update(i, { question: e.target.value })} aria-label={`Question ${i + 1}`} />
            <RowTools index={i} total={value.length} onMove={(to) => onChange(move(value, i, to))} onRemove={() => onChange(value.filter((_, j) => j !== i))} />
          </div>
          <textarea className="field mt-2" rows={3} placeholder="Answer" value={f.answer} onChange={(e) => update(i, { answer: e.target.value })} aria-label={`Answer ${i + 1}`} />
        </div>
      ))}
      <AddButton onClick={() => onChange([...value, { question: "", answer: "" }])}>Add question</AddButton>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Payment plan                                                        */
/* ------------------------------------------------------------------ */

export function InstallmentsField({
  value,
  onChange,
  fee,
}: {
  value: Installment[];
  onChange: (v: Installment[]) => void;
  fee: number;
}) {
  const total = value.reduce((n, i) => n + (Number(i.percent) || 0), 0);
  const update = (i: number, patch: Partial<Installment>) => onChange(value.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  return (
    <div className="space-y-3">
      {value.map((ins, i) => (
        <div key={i} className="grid gap-2 rounded-xl border border-line bg-surface p-3 sm:grid-cols-[1fr_110px_1.4fr_auto] sm:items-center">
          <input className="field" placeholder="Label" value={ins.label} onChange={(e) => update(i, { label: e.target.value })} aria-label="Installment label" />
          <div className="relative">
            <input
              className="field pr-8"
              type="number"
              min={0}
              max={100}
              value={ins.percent}
              onChange={(e) => update(i, { percent: Number(e.target.value) })}
              aria-label="Percent"
            />
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted">%</span>
          </div>
          <input className="field" placeholder="When is it paid?" value={ins.note} onChange={(e) => update(i, { note: e.target.value })} aria-label="Note" />
          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <span className="text-sm font-bold whitespace-nowrap text-navy">Rs. {Math.round(((Number(fee) || 0) * (Number(ins.percent) || 0)) / 100).toLocaleString("en-IN")}</span>
            <RowTools index={i} total={value.length} onMove={(to) => onChange(move(value, i, to))} onRemove={() => onChange(value.filter((_, j) => j !== i))} />
          </div>
        </div>
      ))}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AddButton onClick={() => onChange([...value, { label: "", percent: 0, note: "" }])}>Add installment</AddButton>
        {value.length > 0 && (
          <span className={cn("text-sm font-semibold", total === 100 ? "text-emerald-600" : "text-rose-600")}>Total: {total}%</span>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stats                                                               */
/* ------------------------------------------------------------------ */

export function StatsField({ value, onChange }: { value: Stat[]; onChange: (v: Stat[]) => void }) {
  const update = (i: number, patch: Partial<Stat>) => onChange(value.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  return (
    <div className="space-y-2">
      {value.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <input className="field w-28 font-bold" placeholder="12+" value={s.value} onChange={(e) => update(i, { value: e.target.value })} aria-label="Value" />
          <input className="field" placeholder="Label" value={s.label} onChange={(e) => update(i, { label: e.target.value })} aria-label="Label" />
          <RowTools index={i} total={value.length} onMove={(to) => onChange(move(value, i, to))} onRemove={() => onChange(value.filter((_, j) => j !== i))} />
        </div>
      ))}
      <AddButton onClick={() => onChange([...value, { value: "", label: "" }])}>Add stat</AddButton>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Checkbox groups                                                     */
/* ------------------------------------------------------------------ */

export function CheckboxGroup({ options, value, onChange }: { options: Option[]; value: string[]; onChange: (v: string[]) => void }) {
  if (!options.length) return <p className="text-sm text-muted">Nothing to choose from yet.</p>;
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((o) => {
        const checked = value.includes(o.value);
        return (
          <label
            key={o.value}
            className={cn(
              "flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition",
              checked ? "border-sky bg-sky/5 text-navy" : "border-line hover:border-navy/30",
            )}
          >
            <input
              type="checkbox"
              className="size-4 accent-navy"
              checked={checked}
              onChange={() => onChange(checked ? value.filter((v) => v !== o.value) : [...value, o.value])}
            />
            {o.label}
          </label>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Icon & colour                                                       */
/* ------------------------------------------------------------------ */

export function IconField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Object.entries(ICONS).map(([key, Icon]) => (
        <button
          key={key}
          type="button"
          title={key}
          aria-label={key}
          aria-pressed={value === key}
          onClick={() => onChange(key)}
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-lg border transition",
            value === key ? "border-navy bg-navy text-white" : "border-line text-slate-600 hover:border-sky hover:text-navy",
          )}
        >
          <Icon className="size-5" />
        </button>
      ))}
    </div>
  );
}

const SWATCHES = ["#072069", "#0F1729", "#0EA5E9", "#11A4D4", "#3B82F6", "#2563EB", "#4F46E5", "#7C3AED", "#DB2777", "#16A34A", "#0F766E", "#0891B2"];

export function ColorField({ value, onChange, id }: { value: string; onChange: (v: string) => void; id: string }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <input type="color" value={value || "#072069"} onChange={(e) => onChange(e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border border-line bg-white p-1" aria-label="Pick colour" />
        <input id={id} className="field font-mono" value={value} onChange={(e) => onChange(e.target.value)} placeholder="#072069" />
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {SWATCHES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={cn("size-6 rounded-md ring-offset-2", value?.toLowerCase() === c.toLowerCase() && "ring-2 ring-navy")}
            style={{ background: c }}
            aria-label={c}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Image upload (Supabase Storage "media" bucket)                      */
/* ------------------------------------------------------------------ */

export function ImageField({
  value,
  onChange,
  folder = "uploads",
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  folder?: string;
  id: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024) return setError("Images must be 5 MB or smaller.");
    setUploading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error: upError } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type,
      });
      if (upError) throw upError;
      const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div
          className="relative flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-line bg-surface sm:w-44"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) void upload(f);
          }}
        >
          {value ? (
            <>
              <img src={value} alt="" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute top-1.5 right-1.5 inline-flex size-7 items-center justify-center rounded-full bg-white/90 text-rose-600 shadow"
                aria-label="Remove image"
              >
                <X className="size-4" />
              </button>
            </>
          ) : uploading ? (
            <LoaderCircle className="size-6 animate-spin text-sky" aria-hidden />
          ) : (
            <ImagePlus className="size-7 text-muted" aria-hidden />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-tint px-3 py-2 text-sm font-semibold text-navy hover:bg-navy hover:text-white disabled:opacity-60"
          >
            {uploading ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <ImagePlus className="size-4" aria-hidden />}
            {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
              e.target.value = "";
            }}
          />
          <input id={id} className="field text-xs" placeholder="…or paste an image URL" value={value} onChange={(e) => onChange(e.target.value)} />
          <p className="text-xs text-muted">JPG, PNG or WebP up to 5 MB. You can also drag an image onto the box.</p>
          {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
