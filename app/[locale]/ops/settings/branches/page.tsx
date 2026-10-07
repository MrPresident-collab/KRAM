import Link from "next/link";
import { notFound } from "next/navigation";
import { GitBranch } from "lucide-react";
import { updateBranch, deleteBranch } from "./actions";
import { isLocale, type Locale, copy } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { BranchForm } from "./branch-form";

export default async function BranchesPage({ params }: { params: Promise<{ locale:string }> }) {
  const {locale}=await params;
  if(!isLocale(locale)) notFound();
  const t=copy[locale as Locale];
  const supabase=await createClient();

  const {data:countries,error:countriesError}=await supabase.from("countries").select("id,name,code").order("name");
  const {data:branches,error}=await supabase.from("branches").select("id,name,code,city,region,is_active,country_id,countries(name,code)").order("name");

  return <div className="space-y-7"><Link href={`/${locale}/ops/settings`} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900">← {locale === "fr" ? "Paramètres" : locale === "pt" ? "Definições" : "Settings"}</Link>
    <div className="flex items-start justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">{t.settings.branches}</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-zinc-950">{t.settings.branches}</h1><p className="mt-2 text-sm text-zinc-500">{t.settings.branchesDesc}</p></div>
      <BranchForm locale={locale as Locale} countries={countries??[]}/>
    </div>

    {countriesError ? <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{countriesError.message}</div> :
    <div className="overflow-hidden rounded-2xl border border-[var(--kram-border)] bg-white">
      {error ? <div className="p-6 text-sm text-red-600">{error.message}</div> :
      branches?.length ? <div className="divide-y divide-zinc-100">
        {branches.map((b)=> {
          const country = Array.isArray(b.countries) ? b.countries[0] : b.countries;
          return <form key={b.id} action={updateBranch} className="grid gap-3 px-5 py-4 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto] md:items-center">
            <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-[var(--kram-orange)]"><GitBranch size={17}/></div><div><input type="hidden" name="id" value={b.id}/><input name="name" defaultValue={b.name} className="w-full rounded-lg border border-zinc-200 px-2 py-1 text-sm font-semibold"/><input name="code" defaultValue={b.code} className="mt-1 w-full rounded-lg border border-zinc-200 px-2 py-1 text-xs font-semibold uppercase"/></div></div>
            <div><input name="city" defaultValue={b.city} className="w-full rounded-lg border border-zinc-200 px-2 py-1 text-sm"/><input name="region" defaultValue={b.region ?? ""} className="mt-1 w-full rounded-lg border border-zinc-200 px-2 py-1 text-xs"/></div>
            <select name="countryId" defaultValue={b.country_id} className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm">{(countries??[]).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
            <div className="flex gap-2"><button className="rounded-lg bg-[var(--kram-charcoal)] px-3 py-2 text-xs font-bold text-white">Save</button><button formAction={deleteBranch} name="id" value={b.id} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">Remove</button></div>
          </div>;
        })}
      </div> :
      <div className="p-10 text-center text-sm text-zinc-500">{t.settings.comingSoon}</div>}
    </div>}
  </div>;
}
