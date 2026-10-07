import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { copy, isLocale, type Locale } from "@/lib/i18n";
import { ExpenseCreateForm } from "./form";

export default async function NewExpense({params}:{params:Promise<{locale:string}>}){
 const{locale}=await params;if(!isLocale(locale))notFound();const t=copy[locale as Locale];const s=await createClient();
 const[{data:assets},{data:workOrders},{data:projects},{data:providers}]=await Promise.all([
  s.from("assets").select("id,name,reference_code").order("name"),
  s.from("work_orders").select("id,title").order("created_at",{ascending:false}).limit(100),
  s.from("projects").select("id,name").order("updated_at",{ascending:false}).limit(100),
  s.from("service_providers").select("id,name").eq("verification_status","verified").order("name")
 ]);
 return <div className="mx-auto max-w-4xl space-y-7"><Link href={"/"+locale+"/ops/expenses"} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500"><ArrowLeft size={15}/>{t.common.back}</Link><section><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">{t.nav.finance}</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-zinc-950">New expense</h1><p className="mt-2 text-sm text-zinc-500">Record an operational cost and connect it to the work it belongs to.</p></section><ExpenseCreateForm assets={assets??[]} workOrders={workOrders??[]} projects={projects??[]} providers={providers??[]}/></div>;
}