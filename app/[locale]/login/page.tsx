"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { copy, isLocale, type Locale } from "@/lib/i18n";
import { KramBrand } from "@/components/brand/kram-brand";

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
    router.replace("/" + locale + "/ops");
    router.refresh();
  }

  return <main className="min-h-screen bg-[#f1f1ee] text-zinc-950">
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_.9fr]">
      <section className="relative hidden overflow-hidden bg-[var(--kram-charcoal)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 opacity-30" style={{backgroundImage:"linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)",backgroundSize:"48px 48px"}} />
        <div className="relative"><KramBrand href={"/" + locale + "/login"} /><div className="mt-24 max-w-xl"><p className="text-[10px] font-bold uppercase tracking-[.25em] text-[var(--kram-orange)]">KRAM OPERATIONS</p><h2 className="mt-5 text-5xl font-black tracking-[-.055em]">Asset control,<br/>from anywhere.</h2><p className="mt-6 max-w-md text-sm leading-7 text-zinc-300">The operational control center for assets, inspections, projects, work orders and field activity.</p></div></div>
        <div className="relative flex items-center gap-3 text-xs text-zinc-400"><ShieldCheck size={15}/><span>Authorized personnel only</span></div>
      </section>
      <section className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-14">
        <div className="w-full max-w-[430px]">
          <div className="mb-10 lg:hidden"><KramBrand locale={locale} /></div>
          <div className="mb-8"><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[var(--kram-orange)]">KRAM / OPERATIONS</p><h1 className="mt-3 text-3xl font-black tracking-[-.045em]">Sign in</h1><p className="mt-2 text-sm leading-6 text-zinc-500">Access the KRAM operations control center.</p></div>
          <form onSubmit={submit} className="space-y-5">
            <label className="block"><span className="mb-2 block text-xs font-bold text-zinc-800">{t.auth.email}</span><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your work email" autoComplete="email" className="h-12 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[var(--kram-charcoal)] focus:ring-2 focus:ring-zinc-200"/></label>
            <label className="block"><span className="mb-2 block text-xs font-bold text-zinc-800">{t.auth.password}</span><input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" className="h-12 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[var(--kram-charcoal)] focus:ring-2 focus:ring-zinc-200"/></label>
            {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-medium text-red-700">{error}</p>}
            <button disabled={pending} className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--kram-charcoal)] px-4 text-sm font-bold text-white transition hover:bg-zinc-800 disabled:opacity-60">{pending ? t.auth.signingIn : t.auth.signInAction}<ArrowRight size={16}/></button>
          </form>
          <div className="mt-8 flex items-center gap-2 border-t border-zinc-200 pt-5 text-[11px] text-zinc-400"><LockKeyhole size={13}/><span>Secure KRAM operations access</span></div>
        </div>
      </section>
    </div>
  </main>;
}
