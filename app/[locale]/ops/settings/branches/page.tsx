import { notFound } from "next/navigation";
import { GitBranch } from "lucide-react";
import { isLocale, type Locale, copy } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { BranchForm } from "./branch-form";

export default async function BranchesPage({ params }: { params: Promise<{ locale:string }> }) {
  const {locale}=await params;
  if(!isLocale(locale)) notFound();
  const t=copy[locale as Locale];
  const supabase=await createClient();

  const {data:countries,error:countriesError}=await supabase.from("countries").select("id,name,code").order("name");
  const {data:branches,error}=await supabase.from("branches").select("id,name,code,city,region,is_active,countries(name,code)").order("name");

  return <div className="space-y-7">
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
          return <div key={b.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1.5fr_1fr_1fr_auto] md:items-center">
            <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-[var(--kram-orange)]"><GitBranch size={17}/></div><div><p className="font-semibold text-zinc-900">{b.name}</p><p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{b.code}</p></div></div>
            <span className="text-sm text-zinc-600">{b.city}{b.region ? ", " + b.region : ""}</span>
            <span className="text-sm font-medium text-zinc-700">{country?.name ?? "—"}</span>
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-600">{b.is_active ? "Active" : "Inactive"}</span>
          </div>;
        })}
      </div> :
      <div className="p-10 text-center text-sm text-zinc-500">{t.settings.comingSoon}</div>}
    </div>}
  </div>;
}
