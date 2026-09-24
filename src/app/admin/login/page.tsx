import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { getAdminSession } from "@/lib/admin/auth";
import { SetupNotice } from "@/components/admin/setup-notice";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };

export default async function LoginPage() {
  const session = await getAdminSession();
  if (session.status === "ok") redirect("/admin");

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-navy-900 px-4 py-12">
      <div className="bg-grid absolute inset-0" />
      <div className="absolute -top-40 -right-40 size-[30rem] rounded-full bg-sky/25 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 size-[26rem] rounded-full bg-mint/15 blur-3xl" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center text-white">
          <Image src="/brand/logo-footer.png" alt="" width={64} height={64} className="size-16" />
          <h1 className="mt-4 text-2xl font-extrabold">Leafclutch Academy Admin</h1>
          <p className="mt-1 text-sm text-white/60">Sign in to manage courses, content and enrollments.</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
          {session.status === "unconfigured" ? <SetupNotice compact /> : <LoginForm />}
        </div>
      </div>
    </main>
  );
}
