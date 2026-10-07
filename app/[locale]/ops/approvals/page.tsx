import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock3, ShieldCheck, XCircle } from "lucide-react";
import { isLocale, type Locale, getOpsUi } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

type ApprovalExpense = { id: string; description: string | null; amount: number | string | null; currency: string | null; expense_date: string | null; assets?: { name: string } | { name: string }[] | null; projects?: { name: string } | { name: string }[] | null; work_orders?: { title: string } | { title: string }[] | null };
function firstRelation<T>(value: T | T[] | null | undefined): T | undefined { return Array.isArray(value) ? value[0] : value ?? undefined; }

export default async function ApprovalsPage({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;if(!isLocale(locale))notFound(); const ui=getOpsUi(locale as Locale);
 const s=await createClient();
 const {data:rows}=await s.from("approvals").select("id,expense_id,status,requested_at,decided_at,decision_note,requested_by,decided_by,expenses(id,description,amount,currency,status,expense_date,branch_id,assets(id,name),projects(id,name),work_orders(id,title))").order("requested_at",{ascending:false}).limit(100);
 const pending=(rows??[]).filter(x=>["pending","requested","awaiting"].includes(String(x.status).toLowerCase()));
 const decided=(rows??[]).filter(x=>!["pending","requested","awaiting"].includes(String(x.status).toLowerCase()));
 return <div className="space-y-7">
  <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">{ui.approvals.eyebrow}</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-zinc-950">{ui.approvals.title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">{ui.approvals.description}</p></div>
  <div className="grid gap-4 sm:grid-cols-3"><Metric icon={Clock3} label={ui.approvals.pending} value={String(pending.length)}/><Metric icon={CheckCircle2} label={ui.approvals.decided} value={String(decided.filter(x=>["approved","accepted"].includes(String(x.status).toLowerCase())).length)}/><Metric icon={ShieldCheck} label={ui.approvals.total} value={String(rows?.length??0)}/></div>
  <section className="overflow-hidden rounded-2xl border border-[var(--kram-border)] bg-white"><div className="border-b border-zinc-100 px-5 py-4"><h2 className="text-base font-bold">{ui.approvals.pendingTitle}</h2><p className="mt-1 text-xs text-zinc-400">{ui.approvals.pendingDesc}</p></div>
   {pending.length?<div className="divide-y divide-zinc-100">{pending.map((row)=>{const e=firstRelation(row.expenses) as ApprovalExpense | undefined;const a=firstRelation(e?.assets);const p=firstRelation(e?.projects);const w=firstRelation(e?.work_orders);return <div key={row.id} className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between"><div className="min-w-0"><p className="text-sm font-bold text-zinc-900">{e?.description||"Approval request"}</p><p className="mt-1 text-xs text-zinc-500">{e?`${Number(e.amount).toLocaleString()} ${e.currency||""}`:""} · {a?.name||p?.name||w?.title||"Operational cost"} · {e?.expense_date?new Date(e.expense_date).toLocaleDateString(locale):"—"}</p><p className="mt-1 text-[11px] text-zinc-400">Requested {new Date(row.requested_at).toLocaleString(locale)}</p></div><Link href={e?.id?`/${locale}/ops/expenses/${e.id}`:`/${locale}/ops/approvals`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--kram-charcoal)] px-4 py-2.5 text-xs font-bold text-white">{ui.approvals.review} <ArrowRight size={13}/></Link></div>})}</div>:<Empty text="No approvals are waiting for review."/>}
  </section>
  <section className="overflow-hidden rounded-2xl border border-[var(--kram-border)] bg-white"><div className="border-b border-zinc-100 px-5 py-4"><h2 className="text-base font-bold">{ui.approvals.decisionHistory}</h2></div>
   {decided.length?<div className="divide-y divide-zinc-100">{decided.map((row)=>{const e=Array.isArray(row.expenses)?row.expenses[0]:row.expenses;const approved=["approved","accepted"].includes(String(row.status).toLowerCase());return <div key={row.id} className="flex items-center justify-between gap-4 px-5 py-4"><div><p className="text-sm font-semibold">{e?.description||"Approval request"}</p><p className="mt-1 text-xs text-zinc-400">{row.decided_at?new Date(row.decided_at).toLocaleString(locale):"No decision date"}</p></div><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${approved?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-700"}`}>{approved?<CheckCircle2 size={12}/>:<XCircle size={12}/>} {String(row.status).replaceAll("_"," ")}</span></div>})}</div>:<Empty text="No approval decisions recorded yet."/>}
  </section></div>;
}
function Metric({icon:Icon,label,value}:{icon:typeof Clock3;label:string;value:string}){return <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-5"><Icon size={17} className="text-[var(--kram-orange)]"/><p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>}
function Empty({text}:{text:string}){return <div className="p-10 text-center text-sm text-zinc-400">{text}</div>}
