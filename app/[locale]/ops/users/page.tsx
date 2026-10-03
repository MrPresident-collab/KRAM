import { notFound } from "next/navigation";
import { Users, ShieldCheck, Globe2 } from "lucide-react";
import { isLocale, type Locale, copy } from "@/lib/i18n";

export default async function UsersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];
  return <div className="space-y-7">
    <section><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">{t.nav.system}</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-zinc-950">{t.users.title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">{t.users.description}</p></section>
    <section className="grid gap-5 lg:grid-cols-3">
      <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-6"><Users className="text-[var(--kram-orange)]" size={20}/><h2 className="mt-5 font-bold">{t.users.staff}</h2><p className="mt-2 text-sm text-zinc-500">{t.users.staffDesc}</p></div>
      <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-6"><ShieldCheck className="text-[var(--kram-orange)]" size={20}/><h2 className="mt-5 font-bold">{t.users.roles}</h2><p className="mt-2 text-sm text-zinc-500">{t.users.rolesDesc}</p></div>
      <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-6"><Globe2 className="text-[var(--kram-orange)]" size={20}/><h2 className="mt-5 font-bold">{t.users.scope}</h2><p className="mt-2 text-sm text-zinc-500">{t.users.scopeDesc}</p></div>
    </section>
  </div>;
}