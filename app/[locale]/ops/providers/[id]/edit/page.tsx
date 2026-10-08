import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isLocale } from "@/lib/i18n";
import { ProviderEditForm } from "./provider-edit-form";
export default async function EditProviderPage({params}:{params:Promise<{locale:string;id:string}>}) {
 const {locale,id}=await params; if(!isLocale(locale))notFound();
 const s=await createClient();
 const [{data:provider},{data:services},{data:catalog},{data:branches}]=await Promise.all([
  s.from("service_providers").select("id,name,phone,email,coverage,notes,branch_id").eq("id",id).maybeSingle(),
  s.from("provider_services").select("service").eq("provider_id",id),
  s.from("service_catalog").select("code").eq("active",true).order("code"),
  s.from("branches").select("id,name,city").order("name")
 ]);
 if(!provider)notFound();
 return <div className="mx-auto max-w-3xl space-y-6"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">Provider</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.04em]">Edit provider</h1><p className="mt-2 text-sm text-zinc-500">Update contact details, coverage and field specialties.</p></div><section className="rounded-2xl border border-[var(--kram-border)] bg-white p-6"><ProviderEditForm provider={provider} services={(services??[]).map(x=>x.service)} serviceCatalog={(catalog??[]).map(x=>x.code)} branches={branches??[]} locale={locale}/></section></div>;
}