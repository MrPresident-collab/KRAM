import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale, copy } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { BranchForm } from "./branch-form";
import { BranchRow } from "./branch-row";

export default async function BranchesPage({ params }: { params: Promise<{ locale:string }> }) {
  const {locale}=await params; if(!isLocale(locale)) notFound(); const t=copy[locale as Locale]; const supabase=await createClient();
  const {data:countries,error:countriesError}=await supabase.from("countries").select("id,name,code").order("name");
  const {data:branches,error}=await supabase.from("branches").select("id,name,code,city,region,is_active,country_id,countries(name,code)").order("name");
  return <div className="space-y-7"><Link href={`/${locale}/ops/settings`} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900">← {locale==="fr"?"Paramètres":locale==="pt"?"Definições":"Settings"}</Link>
    <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">{t.settings.branches}</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-zinc-950">{t.settings.branches}</h1><p className="mt-2 text-sm text-zinc-500">{t.settings.branchesDesc}</p></div><BranchForm locale={locale as Locale} countries={countries??[]}/></div>
    {countriesError?<div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{countriesError.message}</div>:<div className="overflow-hidden rounded-2xl border border-[var(--kram-border)] bg-white">{error?<div className="p-6 text-sm text-red-600">{error.message}</div>:branches?.length?<div className="divide-y divide-zinc-100">{branches.map((b)=><BranchRow key={b.id} branch={{id:b.id,name:b.name,code:b.code,city:b.city,region:b.region??null,country_id:b.country_id}} countries={countries??[]}/>)}</div>:<div className="p-10 text-center text-sm text-zinc-500">{t.settings.comingSoon}</div>}</div>}
  </div>;
}