import Link from"next/link";
import{ArrowLeft}from"lucide-react";
import{notFound}from"next/navigation";
import{createClient}from"@/lib/supabase/server";
import{copy,isLocale,type Locale}from"@/lib/i18n";
import{ReportCreateForm}from"./form";

export default async function NewReport({params}:{params:Promise<{locale:string}>}){
 const{locale}=await params;if(!isLocale(locale))notFound();const t=copy[locale as Locale];const s=await createClient();
 const[{data:assets},{data:inspections},{data:projects},{data:workOrders}]=await Promise.all([
  s.from("assets").select("id,name,reference_code").order("name"),
  s.from("inspections").select("id,inspection_type").order("created_at",{ascending:false}).limit(100),
  s.from("projects").select("id,name").order("name"),
  s.from("work_orders").select("id,title").order("created_at",{ascending:false}).limit(100),
 ]);
 return <div className="mx-auto max-w-4xl space-y-7"><Link href={"/"+locale+"/ops/reports"} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500"><ArrowLeft size={15}/>{t.common.back}</Link><section><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">Documents</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-zinc-950">New report</h1><p className="mt-2 text-sm text-zinc-500">Create a report and optionally attach its first document.</p></section><ReportCreateForm assets={assets??[]} inspections={inspections??[]} projects={projects??[]} workOrders={workOrders??[]}/></div>;
}
