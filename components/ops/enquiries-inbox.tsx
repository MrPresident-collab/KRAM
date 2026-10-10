"use client";

import { useState } from "react";
import { Check, Mail, MapPin, Phone, UserRound, UserCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export type Enquiry = {
 id:string; full_name:string; email:string; phone:string|null; residence:string;
 asset_location:string; asset_type:string; help_needed:string[]; details:string|null;
 preferred_contact:string; preferred_language:string; status:string; assigned_to:string|null; created_at:string;
};

const statusOptions = [
 {value:"new",en:"New",fr:"Nouvelle",pt:"Nova"},
 {value:"reviewing",en:"Reviewing",fr:"En cours d’examen",pt:"Em análise"},
 {value:"contacted",en:"Contacted",fr:"Contacté",pt:"Contactado"},
 {value:"qualified",en:"Qualified",fr:"Qualifiée",pt:"Qualificado"},
 {value:"declined",en:"Declined",fr:"Refusée",pt:"Recusado"},
 {value:"converted",en:"Converted to client",fr:"Convertie en client",pt:"Convertido em cliente"}
] as const;

export function EnquiriesInbox({initialItems,assignees,locale,labels}:{initialItems:Enquiry[];assignees:{id:string;name:string;role:string}[];locale:"en"|"fr"|"pt";labels:{empty:string;asset:string;resident:string;help:string;preferred:string;details:string;save:string;saved:string;error:string;received:string;contact:string;assigned:string;unassigned:string;assignedSaved:string;assignedError:string}}){
 const [items,setItems]=useState(initialItems);
 const [pending,setPending]=useState<string|null>(null);
 const [notice,setNotice]=useState("");
 const [error,setError]=useState("");
 const [assigning,setAssigning]=useState<string|null>(null);
 async function updateStatus(id:string,status:string){
  if(pending)return;
  setPending(id);setNotice("");setError("");
  const supabase=createClient();
  const {data:{user}}=await supabase.auth.getUser();
  const {error:dbError}=await supabase.from("client_enquiries").update({status,reviewed_by:user?.id??null,reviewed_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq("id",id);
  if(dbError){setError(labels.error);setPending(null);return;}
  setItems(old=>old.map(item=>item.id===id?{...item,status}:item));
  setNotice(labels.saved);setPending(null);
 }
 async function assignSupport(id:string,assignedTo:string){
  if(assigning)return;
  setAssigning(id);setNotice("");setError("");
  const supabase=createClient();
  const {error:dbError}=await supabase.from("client_enquiries").update({assigned_to:assignedTo||null,updated_at:new Date().toISOString()}).eq("id",id);
  if(dbError){setError(labels.assignedError);setAssigning(null);return;}
  setItems(old=>old.map(item=>item.id===id?{...item,assigned_to:assignedTo||null}:item));
  setNotice(labels.assignedSaved);setAssigning(null);
 }
 if(!items.length)return <div className="rounded-xl border border-[var(--kram-border)] bg-white p-8 text-sm text-[var(--kram-metal)]">{labels.empty}</div>;
 return <div className="space-y-4">
  {notice&&<p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}
  {error&&<p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
  {items.map(item=><article key={item.id} className="rounded-xl border border-[var(--kram-border)] bg-white p-5 md:p-6">
   <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--kram-border)] pb-4">
    <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[var(--kram-soft-metal)]">{labels.received} · {new Intl.DateTimeFormat(locale,{dateStyle:"medium",timeStyle:"short"}).format(new Date(item.created_at))}</p><h2 className="mt-2 text-xl font-semibold text-[var(--kram-ink)]">{item.full_name}</h2><p className="mt-1 text-sm text-[var(--kram-metal)]">{item.email}</p></div>
    <label className="flex items-center gap-2 text-xs font-semibold text-[var(--kram-metal)]"><span className="sr-only">Enquiry status</span><select value={item.status} disabled={pending!==null} onChange={e=>updateStatus(item.id,e.target.value)} className="max-w-[190px] rounded-lg border border-[var(--kram-border)] bg-[var(--kram-surface)] px-3 py-2.5 text-xs">{statusOptions.map(s=><option key={s.value} value={s.value}>{s[locale]}</option>)}</select>{pending===item.id?<span className="animate-pulse">…</span>:<Check size={14}/>}</label>
   </div>
   <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg bg-[var(--kram-bg)] px-3 py-3"><UserCheck size={16} className="text-[var(--kram-orange)]"/><label className="flex flex-1 flex-wrap items-center gap-3 text-xs font-semibold text-[var(--kram-metal)]"><span>{labels.assigned}</span><select value={item.assigned_to??""} disabled={assigning!==null} onChange={e=>assignSupport(item.id,e.target.value)} className="min-w-[190px] flex-1 rounded-lg border border-[var(--kram-border)] bg-white px-3 py-2.5"><option value="">{labels.unassigned}</option>{assignees.map(person=><option key={person.id} value={person.id}>{person.name} · {person.role}</option>)}</select>{assigning===item.id&&<span className="animate-pulse">…</span>}</label></div>
   <div className="grid gap-4 py-4 sm:grid-cols-2">
    <div className="flex gap-2 text-sm text-[var(--kram-metal)]"><MapPin size={16} className="mt-0.5 shrink-0 text-[var(--kram-orange)]"/><div><p className="text-xs text-[var(--kram-soft-metal)]">{labels.asset}</p><p className="mt-1 font-medium text-[var(--kram-ink)]">{item.asset_type} · {item.asset_location}</p></div></div>
    <div className="flex gap-2 text-sm text-[var(--kram-metal)]"><UserRound size={16} className="mt-0.5 shrink-0 text-[var(--kram-orange)]"/><div><p className="text-xs text-[var(--kram-soft-metal)]">{labels.resident}</p><p className="mt-1 font-medium text-[var(--kram-ink)]">{item.residence}</p></div></div>
    <div className="flex gap-2 text-sm text-[var(--kram-metal)]"><Phone size={16} className="mt-0.5 shrink-0 text-[var(--kram-orange)]"/><div><p className="text-xs text-[var(--kram-soft-metal)]">{labels.contact}</p><p className="mt-1 font-medium text-[var(--kram-ink)]">{item.phone||"—"} · {item.preferred_contact}</p></div></div>
    <div className="flex gap-2 text-sm text-[var(--kram-metal)]"><Mail size={16} className="mt-0.5 shrink-0 text-[var(--kram-orange)]"/><div><p className="text-xs text-[var(--kram-soft-metal)]">{labels.help}</p><p className="mt-1 font-medium text-[var(--kram-ink)]">{item.help_needed.join(", ")}</p></div></div>
   </div>
   {item.details&&<div className="border-t border-[var(--kram-border)] pt-4"><p className="text-xs font-semibold text-[var(--kram-soft-metal)]">{labels.details}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--kram-metal)]">{item.details}</p></div>}
  </article>)}
 </div>;
}
