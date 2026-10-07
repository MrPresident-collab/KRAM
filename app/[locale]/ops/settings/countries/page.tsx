import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe2 } from "lucide-react";
import { updateCountry, deleteCountry } from "./actions";
import { isLocale, type Locale, copy } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { CountryForm } from "./country-form";

export default async function CountriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];
  const supabase = await createClient();
  const { data: countries, error } = await supabase.from("countries").select("id,name,code,created_at").order("name");

  return <div className="space-y-7"><Link href={`/${locale}/ops/settings`} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900">← {locale === "fr" ? "Paramètres" : locale === "pt" ? "Definições" : "Settings"}</Link>
    <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--kram-orange)]">{t.settings.countries}</p><h1 className="mt-2 text-3xl font-bold tracking-[-.045em] text-zinc-950">{t.settings.countries}</h1><p className="mt-2 text-sm text-zinc-500">{t.settings.countriesDesc}</p></div><CountryForm locale={locale as Locale}/></div>
    <div className="overflow-hidden rounded-xl border border-[var(--kram-border)] bg-white">
      {error?<div className="p-6 text-sm text-red-600">{error.message}</div>:countries?.length?<div className="divide-y divide-zinc-100">{countries.map(country=><form key={country.id} action={updateCountry} className="flex items-center justify-between gap-4 px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-[var(--kram-orange)]"><Globe2 size={17}/></div><div><input type="hidden" name="id" value={country.id}/><input name="name" defaultValue={country.name} className="rounded-lg border border-zinc-200 px-2 py-1 text-sm font-semibold"/><input name="code" defaultValue={country.code} maxLength={3} className="mt-1 w-24 rounded-lg border border-zinc-200 px-2 py-1 text-xs font-semibold lowercase"/></div></div><div className="flex items-center gap-2"><span className="text-xs text-zinc-400">{new Date(country.created_at).toLocaleDateString(locale)}</span><button className="rounded-lg bg-[var(--kram-charcoal)] px-3 py-2 text-xs font-bold text-white">Save</button><button formAction={deleteCountry} name="id" value={country.id} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">Remove</button></div></form>)}</div>:<div className="p-10 text-center text-sm text-zinc-500">{t.settings.comingSoon}</div>}
    </div>
  </div>;
}
