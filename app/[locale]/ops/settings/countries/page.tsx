import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe2 } from "lucide-react";
import { isLocale, type Locale, copy } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { CountryForm } from "./country-form";
import { CountryRow } from "./country-row";

export default async function CountriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];
  const supabase = await createClient();
  const { data: countries, error } = await supabase.from("countries").select("id,name,code,created_at").order("name");

  return <div className="space-y-7"><Link href={`/${locale}/ops/settings`} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900">← {locale === "fr" ? "Paramètres" : locale === "pt" ? "Definições" : "Settings"}</Link>
    <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--kram-orange)]">{t.settings.countries}</p><h1 className="mt-2 text-3xl font-bold tracking-[-.045em] text-zinc-950">{t.settings.countries}</h1><p className="mt-2 text-sm text-zinc-500">{t.settings.countriesDesc}</p></div><CountryForm locale={locale as Locale}/></div>
    <div className="overflow-hidden rounded-xl border border-[var(--kram-border)] bg-white">
      {error?<div className="p-6 text-sm text-red-600">{error.message}</div>:countries?.length?<div className="divide-y divide-zinc-100">{countries.map(country=><CountryRow key={country.id} country={country} locale={locale}/>)}</div>:<div className="p-10 text-center text-sm text-zinc-500">{t.settings.comingSoon}</div>}
    </div>
  </div>;
}
