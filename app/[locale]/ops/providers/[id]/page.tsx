import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone, Mail, MapPin, BriefcaseBusiness, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { copy, isLocale, type Locale } from "@/lib/i18n";
import { ProviderVerificationForm } from "./verification-form";

export default async function ProviderDetail({params}:{params:Promise<{locale:string;id:string}>}) {
 const {locale,id}=await params;
 if(!isLocale(locale))notFound();
 const t=copy[locale as Locale];
 const s=await createClient();
 const [{data:p},{data:jobs}]=await Promise.all([
  s.from("service_providers").select("id,name,phone,email,status,verification_status,coverage,notes,created_at,branches(id,name,city),provider_services(id,service)").eq("id",id).maybeSingle(),
  s.from("provider_jobs").select("id,status,rating,notes,completed_at,created_at,work_orders(id,title,status,category,priority)").eq("provider_id",id).order("created_at",{ascending:false}).limit(20)
 ]);
 if(!p)notFound();
 const branch=Array.isArray(p.branches)?p.branches[0]:p.branches;
 const services=p.provider_services??[];
 return <div className="space-y-7">
  <Link href={"/"+locale+"/ops/providers"} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500"><ArrowLeft size={15}/>{t.common.back}</Link>
  <section className="rounded-2xl border border-[var(--kram-border)] bg-white">
   <div className="flex flex-col gap-5 border-b border-zinc-100 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
    <div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--kram-charcoal)] text-white"><BriefcaseBusiness size={22}/></div><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">Field Network</p><h1 className="mt-1 text-2xl font-bold tracking-[-0.04em] text-zinc-950">{p.name}</h1><p className="mt-1 text-xs text-zinc-400">{services.map(x=>x.service).join(" · ")||"No specialty recorded"}</p></div></div>
    <div className="flex flex-wrap items-center justify-end gap-2"><Link href={"/"+locale+"/ops/providers/"+p.id+"/edit"} className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50"><Pencil size={14}/> Edit provider</Link><ProviderVerificationForm providerId={p.id} status={p.status==="prospect"?"pending":p.status==="suspended"||p.status==="archived"?"inactive":p.status} /></div>
   </div>
   <div className="grid md:grid-cols-3">
    <div className="border-b border-zinc-100 p-6 md:border-b-0 md:border-r"><Phone size={17} className="text-[var(--kram-orange)]"/><p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Phone</p><p className="mt-1 text-sm font-semibold text-zinc-800">{p.phone||"Not recorded"}</p></div>
    <div className="border-b border-zinc-100 p-6 md:border-b-0 md:border-r"><Mail size={17} className="text-[var(--kram-orange)]"/><p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Email</p><p className="mt-1 text-sm font-semibold text-zinc-800">{p.email||"Not recorded"}</p></div>
    <div className="p-6"><MapPin size={17} className="text-[var(--kram-orange)]"/><p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Coverage</p><p className="mt-1 text-sm font-semibold text-zinc-800">{p.coverage||branch?.city||"Not recorded"}</p></div>
   </div>
  </section>
  <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
   <div className="space-y-5">
    <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-6"><h2 className="text-base font-bold">Provider profile</h2><p className="mt-4 text-sm leading-7 text-zinc-600">{p.notes||"No notes recorded for this provider."}</p></div>
    <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-6"><h2 className="text-base font-bold">Specialties</h2><div className="mt-4 flex flex-wrap gap-2">{services.length?services.map(x=><span key={x.id} className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-800">{x.service}</span>):<span className="text-sm text-zinc-400">No specialties recorded.</span>}</div></div>
   </div>
   <div className="rounded-2xl border border-[var(--kram-border)] bg-white"><div className="border-b border-zinc-100 px-5 py-4"><h2 className="text-base font-bold">Job history</h2></div>{jobs?.length?<div className="divide-y divide-zinc-100">{jobs.map(j=>{const wo=Array.isArray(j.work_orders)?j.work_orders[0]:j.work_orders;return <div key={j.id} className="px-5 py-4"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold text-zinc-900">{wo?.title||"Work order"}</p><p className="mt-1 text-xs text-zinc-400">{wo?.category||"—"} · {wo?.priority||"—"}</p></div><span className="rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] font-semibold text-zinc-600">{j.status}</span></div>{j.rating&&<p className="mt-3 text-xs font-semibold text-zinc-600">Rating: {j.rating}/5</p>}{j.notes&&<p className="mt-2 text-sm text-zinc-500">{j.notes}</p>}</div>})}</div>:<div className="flex min-h-56 items-center justify-center px-6 text-center text-sm text-zinc-400">No provider jobs recorded yet.</div>}</div>
  </section>
 </div>;
}