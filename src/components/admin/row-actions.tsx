"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Eye, EyeOff, LoaderCircle, Trash2 } from "lucide-react";
import { deleteResource, togglePublished } from "@/app/admin/actions";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function DeleteButton({
  resourceKey,
  id,
  label,
  redirectTo,
  compact = false,
}: {
  resourceKey: string;
  id: string;
  label: string;
  redirectTo?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function onClick() {
    if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) return;
    start(async () => {
      const res = await deleteResource(resourceKey, id);
      if (!res.ok) {
        window.alert(res.error);
        return;
      }
      if (redirectTo) router.push(redirectTo);
      else router.refresh();
    });
  }

  return compact ? (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-label={`Delete ${label}`}
      className="inline-flex size-8 items-center justify-center rounded-lg text-muted hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </button>
  ) : (
    <button type="button" onClick={onClick} disabled={pending} className={buttonClass("outline", "md", "text-rose-600 hover:border-rose-200 hover:bg-rose-50")}>
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />} Delete
    </button>
  );
}

export function PublishToggle({ resourceKey, id, value }: { resourceKey: string; id: string; value: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await togglePublished(resourceKey, id, !value);
          if (!res.ok) window.alert(res.error);
          router.refresh();
        })
      }
      title={value ? "Published: click to hide" : "Hidden: click to publish"}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 transition disabled:opacity-50",
        value ? "bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100" : "bg-slate-100 text-slate-600 ring-slate-200 hover:bg-slate-200",
      )}
    >
      {pending ? <LoaderCircle className="size-3 animate-spin" /> : value ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
      {value ? "Live" : "Hidden"}
    </button>
  );
}
