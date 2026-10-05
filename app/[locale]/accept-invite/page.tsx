"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { KramBrand } from "@/components/brand/kram-brand";
import { copy, isLocale, type Locale } from "@/lib/i18n";

export default function AcceptInvitePage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState<Locale>("fr");
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    void params.then(({ locale: value }) => setLocale(isLocale(value) ? value : "fr"));
  }, [params]);

  const t = copy[locale].auth;

  useEffect(() => {
    void supabase.auth.getClaims().then(({ data }) => {
      setReady(Boolean(data?.claims?.sub));
    });
  }, [supabase]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password.length < 12) { setError("Password must be at least 12 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setPending(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) { setError(updateError.message); setPending(false); return; }

    const { data: claims } = await supabase.auth.getClaims();
    const userId = claims?.claims?.sub;
    if (userId) {
      await supabase.from("organization_members").update({ status: "active" }).eq("user_id", userId).eq("status", "invited");
    }
    router.replace("/" + locale + "/ops");
    router.refresh();
  }

  return <main className="min-h-screen bg-[#f1f1ee] text-zinc-950">
    <div className="mx-auto flex min-h-screen max-w-xl items-center px-6 py-12">
      <div className="w-full rounded-3xl border border-[var(--kram-border)] bg-white p-7 shadow-sm md:p-10">
        <KramBrand locale={locale} />
        <div className="mt-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--kram-orange-soft)] text-[var(--kram-orange)]"><ShieldCheck size={23}/></div>
          <p className="mt-6 text-[10px] font-bold uppercase tracking-[.2em] text-[var(--kram-orange)]">KRAM / ACCESS SETUP</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-.045em]">{ready ? "Set your password" : "Invitation required"}</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">{ready ? "Create your private password to activate your KRAM account." : "Open this page from the invitation email sent to your work address."}</p>
        </div>
        {ready ? <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block"><span className="mb-2 block text-xs font-bold">{t.password}</span><input required type="password" minLength={12} value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password" className="h-12 w-full rounded-xl border border-zinc-300 px-3.5 text-sm outline-none focus:border-[var(--kram-charcoal)]"/></label>
          <label className="block"><span className="mb-2 block text-xs font-bold">Confirm password</span><input required type="password" minLength={12} value={confirm} onChange={e=>setConfirm(e.target.value)} autoComplete="new-password" className="h-12 w-full rounded-xl border border-zinc-300 px-3.5 text-sm outline-none focus:border-[var(--kram-charcoal)]"/></label>
          {error&&<p className="rounded-xl bg-red-50 px-3.5 py-3 text-xs font-medium text-red-700">{error}</p>}
          <button disabled={pending} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--kram-charcoal)] text-sm font-bold text-white disabled:opacity-60">{pending&&<Loader2 size={15} className="animate-spin"/>}{pending?"Activating...":"Activate KRAM access"}{!pending&&<CheckCircle2 size={16}/>}</button>
        </form> : <div className="mt-8 flex items-center gap-2 border-t border-zinc-100 pt-5 text-xs text-zinc-400"><LockKeyhole size={14}/> KRAM access is invitation-only.</div>}
      </div>
    </div>
  </main>;
}
