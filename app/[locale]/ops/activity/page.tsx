import { notFound } from "next/navigation";
import { Activity, ArrowRight, ClipboardCheck, FileText, FolderKanban, Receipt, Wrench } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

const icons:Record<string,typeof Activity>={work_order:Wrench,inspection:ClipboardCheck,project:FolderKanban,expense:Receipt,document:FileText};

export default async function ActivityPage({params}:{params:Promise<{locale:string}>}){
 const{locale}=await params;if(!isLocale(locale))notFound();
 const s=await createClient();
 const{data:rawLogs}=await s.from("audit_logs").select("id,action,entity_type,entity_id,summary,metadata,created_at,actor_id").order("created_at",{ascending:false}).limit(100);
 const actorIds=[...new Set((rawLogs??[]).map(x=>x.actor_id).filter(Boolean))] as string[];
 const{data:profiles}=actorIds.length?await s.from("profiles").select("id,full_name,work_email").in("id",actorIds):{data:[]};
 const profileMap=new Map((profiles??[]).map(p=>[p.id,p]));
 const logs=(rawLogs??[]).map(row=>({...row,profiles:row.actor_id?profileMap.get(row.actor_id):null}));
 const groups=(logs??[]).reduce<Record<string,typeof logs>>((acc,row)=>{const key=new Date(row.created_at).toLocaleDateString(locale,{year:"numeric",month:"long",day:"numeric"});(acc[key]??=[]).push(row);return acc}, {});
 return <div className="space-y-7">
  <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">System</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-zinc-950">Activity</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">A chronological audit trail of operational changes across KRAM.</p></div>
  <div className="grid gap-4 sm:grid-cols-3"><Metric label="Events" value={String(logs?.length??0)}/><Metric label="Today" value={String((logs??[]).filter(x=>new Date(x.created_at).toDateString()===new Date().toDateString()).length)}/><Metric label="Event types" value={String(new Set((logs??[]).map(x=>x.action)).size)}/></div>
  <section className="overflow-hidden rounded-2xl border border-[var(--kram-border)] bg-white">
   {logs?.length?Object.entries(groups).map(([day,items])=><div key={day}><div className="border-b border-zinc-100 bg-zinc-50/60 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">{day}</div><div className="divide-y divide-zinc-100">{items.map(row=>{const Icon=icons[row.entity_type]??Activity;const actor=Array.isArray(row.profiles)?row.profiles[0]:row.profiles;return <div key={row.id} className="flex gap-4 px-5 py-4"><div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--kram-orange-soft)] text-[var(--kram-orange)]"><Icon size={16}/></div><div className="min-w-0 flex-1"><div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm font-semibold text-zinc-900">{row.summary}</p><time className="shrink-0 text-[11px] text-zinc-400">{new Date(row.created_at).toLocaleTimeString(locale,{hour:"2-digit",minute:"2-digit"})}</time></div><p className="mt-1 text-xs text-zinc-400">{actor?.full_name||actor?.work_email||"KRAM user"} · {row.action.replaceAll("_"," ")}</p>{row.metadata&&Object.keys(row.metadata).length>0&&<p className="mt-2 truncate text-[11px] text-zinc-400">{Object.entries(row.metadata as Record<string,unknown>).map(([k,v])=>k+"="+String(v)).join(" · ")}</p>}</div><ArrowRight size={14} className="mt-2 hidden text-zinc-300 sm:block"/></div>})}</div></div>):<div className="p-14 text-center"><Activity size={22} className="mx-auto text-zinc-300"/><p className="mt-4 text-sm font-semibold text-zinc-700">No activity recorded yet.</p><p className="mt-1 text-xs text-zinc-400">New operational actions will appear here automatically.</p></div>}
  </section>
 </div>;
}
function Metric({label,value}:{label:string;value:string}){return <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-5"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">{label}</p><p className="mt-2 text-2xl font-bold text-zinc-950">{value}</p></div>}
