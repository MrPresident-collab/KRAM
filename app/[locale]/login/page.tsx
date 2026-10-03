"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { copy, isLocale, type Locale } from "@/lib/i18n";

export default function LoginPage() {
  const params = useParams<{ locale: string }>();
  const locale = isLocale(params.locale) ? params.locale : "fr";
  const t = copy[locale as Locale];
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(t.auth.invalid);
      setPending(false);
      return;
    }
    router.replace(`/${locale}/ops`);
    router.refresh();
  }

  return <main className="min-h-screen bg-[var(--kram-background)] px-5 py-10">
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
      <div className="w-full">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--kram-black)] text-sm font-black text-white">K</div>
          <p className="mt-4 text-2xl font-black tracking-[-0.06em] text-zinc-950">KRAM</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">Remote Asset Management</p>
        </div>
        <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-7 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-[var(--kram-orange)]"><LockKeyhole size={18} /></div>
          <h1 className="mt-5 text-xl font-bold tracking-[-0.03em] text-zinc-950">{t.auth.signIn}</h1>
          <p className="mt-1 text-sm leading-6 text-zinc-500">{t.auth.subtitle}</p>
          <form onSubmit={submit} className="mt-7 space-y-4">
            <label className="block"><span className="mb-1.5 block text-xs font-semibold text-zinc-700">{t.auth.email}</span><input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.75 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100" /></label>
            <label className="block"><span className="mb-1.5 block text-xs font-semibold text-zinc-700">{t.auth.password}</span><input required type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.75 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100" /></label>
            {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700">{error}</p>}
            <button disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--kram-black)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60">
              {pending ? t.auth.signingIn : t.auth.signInAction}<ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  </main>;
}
