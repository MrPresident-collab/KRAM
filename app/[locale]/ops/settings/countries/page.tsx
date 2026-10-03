import { notFound } from "next/navigation";
import { Plus, Globe2 } from "lucide-react";
import { isLocale, type Locale, copy } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

export default async function CountriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];
  const supabase = await createClient();
  const { data: countries, error } = await supabase.from("countries").select("id,name,code,created_at").order("name");

  return <div className="space-y-7">
    <div className="flex items-start justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">{t.settings.countries}</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-zinc-950">{t.settings.countries}</h1><p className="mt-2 text-sm text-zinc-500">{t.settings.countriesDesc}</p></div>
      <button className="inline-flex items-center gap-2 rounded-xl bg-[var(--kram-black)] px-4 py-2.5 text-sm font-semibold text-white"><Plus size={16}/> {t.common.create}</button>
    </div>
    <div className="overflow-hidden rounded-2xl border border-[var(--kram-border)] bg-white">
      {error ? <div className="p-6 text-sm text-red-600">{error.message}</div> : countries?.length ? <div className="divide-y divide-zinc-100">{countries.map(c=><div key={c.id} className="flex items-center justify-between px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100"><Globe2 size={17}/></div><div><p className="font-semibold text-zinc-900">{c.name}</p><p className="text-xs text-zinc-500">{c.code}</p></div></div><span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-600">{new Date(c.created_at).toLocaleDateString(locale)}</span></div>)}</div> : <div className="p-10 text-center text-sm text-zinc-500">{t.settings.comingSoon}</div>}
    </div>
  </div>;
}