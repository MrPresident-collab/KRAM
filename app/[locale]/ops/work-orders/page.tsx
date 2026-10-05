import Link from "next/link";
import { notFound } from "next/navigation";
import { ClipboardList, Plus, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isLocale, type Locale } from "@/lib/i18n";
import { opsLabels, labelFromMap } from "@/lib/ops-labels";
import { copy } from "@/lib/i18n";

const statusLabels={draft:"Draft",pending_approval:"Pending approval",approved:"Approved",assigned:"Assigned",in_progress:"In progress",awaiting_evidence:"Awaiting evidence",completed:"Completed",verified:"Verified",closed:"Closed"} as const;
const priorityLabels={low:"Low",normal:"Normal",high:"High",urgent:"Urgent"} as const;

export default async function WorkOrdersPage({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound(); const ui=copy[locale as Locale]; const page=ui.workOrdersPage ?? copy.en.workOrdersPage; const t=ui; const labels = opsLabels(locale as Locale);const supabase=await createClient();
 const {data:orders}=await supabase.from("work_orders").select("id,title,category,priority,status,estimated_cost,created_at,assets(id,name,reference_code)").order("created_at",{ascending:false});
 const all=orders??[];
 const open=all.filter(o=>!["closed","verified"].includes(o.status)).length;
 const pending=all.filter(o=>["draft","pending_approval"].includes(o.status)).length;
 const active=all.filter(o=>["assigned","in_progress","awaiting_evidence"].includes(o.status)).length;
 return <div className="space-y-7">
  <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">{t.nav.workOrders}</p><div className="mt-2 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--kram-charcoal)] text-white"><ClipboardList size={19}/></div><h1 className="text-3xl font-bold tracking-[-0.045em] text-zinc-950">{page.title}</h1></div><p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">{page.description}</p></div><Link href={`/${locale}/ops/work-orders/new`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--kram-orange)] px-4 py-2.5 text-sm font-bold text-white"><Plus size={16}/> {page.new}</Link></section>
  <section className="grid gap-4 sm:grid-cols-3">{[[page.open,open,page.activeRequests],[page.pending,pending,page.awaitingAction],[page.inProgress,active,page.activeInterventions]].map(([label,value,hint])=><div key={label as string} className="rounded-2xl border border-[var(--kram-border)] bg-white p-5"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">{label}</p><p className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">{value}</p><p className="mt-1 text-xs text-zinc-400">{hint}</p></div>)}</section>
  <section className="overflow-hidden rounded-2xl border border-[var(--kram-border)] bg-white"><div className="border-b border-zinc-100 px-5 py-4"><h2 className="text-base font-bold text-zinc-950">{page.queue}</h2><p className="mt-1 text-xs text-zinc-400">{page.queueDesc}</p></div>
  {all.length?<div className="divide-y divide-zinc-100">{all.map(o=>{const a=Array.isArray(o.assets)?o.assets[0]:o.assets;return <Link key={o.id} href={`/${locale}/ops/work-orders/${o.id}`} className="group flex items-center justify-between gap-5 px-5 py-4 hover:bg-zinc-50/70"><div className="min-w-0"><div className="flex items-center gap-2"><p className="truncate text-sm font-bold text-zinc-900 group-hover:text-[var(--kram-orange)]">{o.title}</p><span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-500">{priorityLabels[o.priority as keyof typeof priorityLabels]}</span></div><p className="mt-1 text-xs text-zinc-400">{a?.name??"—"} · {a?.reference_code??"—"} · {o.category}</p></div><div className="flex shrink-0 items-center gap-3"><span className="hidden rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] font-semibold text-zinc-600 sm:inline-flex">{statusLabels[o.status as keyof typeof statusLabels]}</span><ArrowRight size={16} className="text-zinc-300 group-hover:text-[var(--kram-orange)]"/></div></Link>})}</div>:<div className="flex min-h-72 flex-col items-center justify-center px-6 text-center"><ClipboardList size={22} className="text-zinc-300"/><h3 className="mt-4 text-sm font-bold text-zinc-800">{page.empty}</h3><p className="mt-1 max-w-md text-sm leading-6 text-zinc-500">{page.emptyDesc}</p><Link href={`/${locale}/ops/work-orders/new`} className="mt-4 text-xs font-bold text-[var(--kram-orange)]">{page.create}</Link></div>}</section>
 </div>;
}
