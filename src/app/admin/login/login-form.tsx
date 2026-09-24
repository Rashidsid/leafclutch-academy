"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle, LogIn, TriangleAlert } from "lucide-react";
import { signIn, type ActionResult } from "@/app/admin/actions";
import { buttonClass } from "@/components/ui/button";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClass("primary", "lg", "w-full")}>
      {pending ? <LoaderCircle className="size-5 animate-spin" aria-hidden /> : <LogIn className="size-4" aria-hidden />}
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useActionState<ActionResult, FormData>(signIn, { ok: false });

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <p role="alert" className="flex gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-800 ring-1 ring-rose-200">
          <TriangleAlert className="size-5 shrink-0" aria-hidden /> {state.error}
        </p>
      )}
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required className="field" />
      </div>
      <div>
        <label htmlFor="password" className="label">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      </div>
      <Submit />
    </form>
  );
}
