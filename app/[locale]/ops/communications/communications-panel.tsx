"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquare, Plus, Search, Send, X } from "lucide-react";
import { startConversation, sendMessage, updateCase } from "./actions";
import type { Locale } from "@/lib/i18n";

type ClientRef = { id:string; full_name:string|null; email:string|null };
type Message = { id:string; body:string; sent_at:string; visibility?:string; sender_user_id?:string|null }; type Event = {id:string;event_type:string;from_status:string|null;to_status:string|null;details:string|null;created_at:string;actor_id:string|null;assigned_to:string|null}; type Staff = {user_id:string;role:string;name:string};
type Conversation = { id:string; subject:string|null; status:string; case_status?:string|null; priority:string|null; assigned_to?:string|null; escalation_reason?:string|null; resolution_summary?:string|null; clients:ClientRef|ClientRef[]|null; messages:Message[]; events:Event[] };

export function CommunicationsPanel({ locale, conversations, clients, staff, currentRole }:{locale:Locale;conversations:Conversation[];clients:ClientRef[];staff:Staff[];currentRole:string}) {
  const [q,setQ]=useState("");
  const [selected,setSelected]=useState<string|null>(conversations[0]?.id??null);
  const [open,setOpen]=useState(false);
  const [reply,setReply]=useState("");
  const [replyPending,setReplyPending]=useState(false);
  const [replyError,setReplyError]=useState("");
  const [caseStatus,setCaseStatus]=useState("open");
  const [caseAssignee,setCaseAssignee]=useState("");
  const [caseNote,setCaseNote]=useState("");
  const [casePending,setCasePending]=useState(false);
  const [caseMessage,setCaseMessage]=useState("");
  const router=useRouter();

  const filtered=useMemo(()=>conversations.filter(c=>{
    const client=Array.isArray(c.clients)?c.clients[0]:c.clients;
    return !q||[client?.full_name,c.subject,...c.messages.map(m=>m.body)].filter(Boolean).join(" ").toLowerCase().includes(q.toLowerCase());
  }),[conversations,q]);

  const active=conversations.find(c=>c.id===selected);
  const client=active&&(Array.isArray(active.clients)?active.clients[0]:active.clients);
  const statusOptions=locale==="fr"?{open:"Ouvert",assigned:"Attribué",in_progress:"En cours",escalated:"Escaladé",resolved:"Résolu",closed:"Fermé"}:locale==="pt"?{open:"Aberto",assigned:"Atribuído",in_progress:"Em curso",escalated:"Escalado",resolved:"Resolvido",closed:"Fechado"}:{open:"Open",assigned:"Assigned",in_progress:"In progress",escalated:"Escalated",resolved:"Resolved",closed:"Closed"};
  async function saveCase(e:React.FormEvent){e.preventDefault();if(!active)return;setCasePending(true);setCaseMessage("");const result=await updateCase({conversationId:active.id,status:caseStatus,assignedTo:caseAssignee||active.assigned_to||null,details:caseNote});setCasePending(false);setCaseMessage(result.message);if(result.success){setCaseNote("");router.refresh();}}

  const labels=locale==="fr"
    ? {start:"Démarrer une conversation",client:"Client",subject:"Sujet",priority:"Priorité",message:"Message initial",cancel:"Annuler",send:"Démarrer",reply:"Répondre au client",replyPlaceholder:"Écrivez votre réponse…",sendReply:"Envoyer",sending:"Envoi…",search:"Rechercher des conversations…",empty:"Aucune conversation. Démarrez une conversation avec un client.",noMatch:"Aucune conversation ne correspond à votre recherche.",select:"Sélectionnez une conversation."}
    : locale==="pt"
      ? {start:"Iniciar conversa",client:"Cliente",subject:"Assunto",priority:"Prioridade",message:"Mensagem inicial",cancel:"Cancelar",send:"Iniciar",reply:"Responder ao cliente",replyPlaceholder:"Escreva a sua resposta…",sendReply:"Enviar",sending:"A enviar…",search:"Pesquisar conversas…",empty:"Ainda não há conversas. Inicie uma conversa com um cliente.",noMatch:"Nenhuma conversa corresponde à pesquisa.",select:"Selecione uma conversa."}
      : {start:"Start conversation",client:"Client",subject:"Subject",priority:"Priority",message:"Opening message",cancel:"Cancel",send:"Start conversation",reply:"Reply to client",replyPlaceholder:"Write your reply…",sendReply:"Send",sending:"Sending…",search:"Search conversations…",empty:"No conversations yet. Start a conversation with a client.",noMatch:"No conversations match your search.",select:"Select a conversation."};

  async function submitReply(e:React.FormEvent) {
    e.preventDefault();
    if(!active||!reply.trim()) return;
    setReplyPending(true); setReplyError("");
    const result=await sendMessage({conversationId:active.id,body:reply,visibility:"client"});
    if(!result?.success){setReplyError(result?.message||"The message could not be sent.");setReplyPending(false);return;}
    setReply(""); setReplyPending(false); router.refresh();
  }

  return <section className="relative grid min-h-[620px] overflow-hidden rounded-2xl border border-[var(--kram-border)] bg-white lg:grid-cols-[330px_1fr]">
    <aside className="border-b border-zinc-100 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-2 border-b p-4">
        <div className="flex flex-1 items-center gap-2 rounded-lg border bg-zinc-50 px-3 py-2"><Search size={15} className="text-zinc-400"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder={labels.search} className="w-full bg-transparent text-sm outline-none"/></div>
        <button type="button" onClick={()=>setOpen(true)} title={labels.start} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--kram-charcoal)] text-white hover:opacity-90"><Plus size={17}/></button>
      </div>
      <div className="divide-y divide-zinc-100">
        {filtered.map(c=>{const x=Array.isArray(c.clients)?c.clients[0]:c.clients;const latest=c.messages[0];return <button type="button" key={c.id} onClick={()=>{setSelected(c.id);setReplyError("");setCaseStatus(c.case_status||c.status||"open");setCaseAssignee(c.assigned_to||"");setCaseMessage("");}} className={`block w-full px-4 py-4 text-left hover:bg-zinc-50 ${selected===c.id?"bg-orange-50/60":""}`}>
          <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-bold text-zinc-900">{x?.full_name??"Client"}</p><p className="mt-0.5 truncate text-xs text-zinc-400">{c.subject||"General communication"}</p></div><span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-500">{statusOptions[(c.case_status||c.status) as keyof typeof statusOptions]||c.case_status||c.status}</span></div>
          {latest&&<p className="mt-2 truncate text-xs text-zinc-500">{latest.body}</p>}
        </button>})}
        {!filtered.length&&<div className="p-8 text-center text-sm text-zinc-500">{q?labels.noMatch:labels.empty}</div>}
      </div>
    </aside>
    <main className="flex min-h-0 flex-col">
      {active ? <>
        <header className="border-b border-zinc-100 p-5"><p className="text-sm font-bold">{client?.full_name??"Client"}</p><p className="mt-1 text-xs text-zinc-400">{active.subject||"General communication"} · {active.priority||"normal"}</p></header>
        <section className="border-b border-zinc-100 bg-zinc-50/60 p-4"><form onSubmit={saveCase} className="grid gap-3 md:grid-cols-2">
<label className="block"><span className="mb-1 block text-xs font-semibold">Case status</span><select value={caseStatus} onChange={e=>setCaseStatus(e.target.value)} className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm">{Object.entries(statusOptions).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
<label className="block"><span className="mb-1 block text-xs font-semibold">Assigned to</span><select value={caseAssignee||active.assigned_to||""} onChange={e=>setCaseAssignee(e.target.value)} className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"><option value="">Unassigned</option>{staff.map(s=><option key={s.user_id} value={s.user_id}>{s.name} · {s.role}</option>)}</select></label>
<label className="block md:col-span-2"><span className="mb-1 block text-xs font-semibold">Action taken / escalation reason / resolution note</span><textarea value={caseNote} onChange={e=>setCaseNote(e.target.value)} rows={2} maxLength={4000} placeholder="Record actions taken, next steps, or the reason for escalation…" className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm"/></label>
<div className="flex flex-wrap items-center justify-between gap-2 md:col-span-2"><p className="text-[11px] text-zinc-500">Closing requires an administrator and a resolved case.</p><button disabled={casePending} className="rounded-lg bg-[var(--kram-charcoal)] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">{casePending?"Saving…":"Save case update"}</button></div>{caseMessage&&<p role="status" className="text-xs text-zinc-600 md:col-span-2">{caseMessage}</p>}</form>
{active.events?.length>0&&<div className="mt-4 border-t border-zinc-200 pt-3"><p className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-500">Case history</p><div className="space-y-2">{active.events.slice(0,8).map(ev=><div key={ev.id} className="flex gap-3 text-xs"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--kram-orange)]"/><div><p className="font-semibold text-zinc-700">{ev.event_type.replaceAll("_"," ")}{ev.to_status?" · "+(statusOptions[ev.to_status as keyof typeof statusOptions]||ev.to_status):""}</p>{ev.details&&<p className="mt-0.5 text-zinc-500">{ev.details}</p>}<p className="mt-0.5 text-[10px] text-zinc-400">{staff.find(s=>s.user_id===ev.actor_id)?.name||"Staff"} · {new Date(ev.created_at).toLocaleString(locale)}</p></div></div>)}</div></div>}</section>
        <div className="flex-1 space-y-4 overflow-y-auto p-6">{[...active.messages].reverse().map(m=><div key={m.id} className="max-w-2xl rounded-2xl bg-zinc-50 p-4"><p className="text-sm leading-6 text-zinc-700">{m.body}</p><p className="mt-2 text-[10px] text-zinc-400">{new Date(m.sent_at).toLocaleString(locale)}</p></div>)}</div>
        <form onSubmit={submitReply} className="border-t bg-zinc-50/60 p-4">
          <label className="mb-2 block text-xs font-bold text-zinc-600">{labels.reply}</label>
          <div className="flex items-end gap-2"><textarea value={reply} onChange={e=>setReply(e.target.value)} rows={3} maxLength={10000} placeholder={labels.replyPlaceholder} className="min-h-[76px] flex-1 resize-y rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-[var(--kram-orange)]"/><button disabled={replyPending||!reply.trim()} className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[var(--kram-charcoal)] px-4 text-xs font-bold text-white disabled:opacity-50">{replyPending&&<Loader2 size={14} className="animate-spin"/>}{replyPending?labels.sending:<><Send size={14}/>{labels.sendReply}</>}</button></div>
          {replyError&&<p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{replyError}</p>}
        </form>
      </> : <div className="flex flex-1 items-center justify-center p-10 text-center"><div><MessageSquare size={23} className="mx-auto text-zinc-400"/><h2 className="mt-4 text-base font-bold">Select a conversation</h2><p className="mt-1 text-sm text-zinc-500">{labels.select}</p></div></div>}
    </main>
    {open&&<div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 p-4"><div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
      <div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-bold text-zinc-900">{labels.start}</h2><p className="mt-1 text-xs text-zinc-500">Create the conversation and its opening message.</p></div><button type="button" onClick={()=>setOpen(false)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100"><X size={18}/></button></div>
      <form action={async fd=>{const result=await startConversation(fd);if(result?.success){setOpen(false);router.refresh();}else{setReplyError(result?.message||"The conversation could not be started.");}}} className="space-y-4">
        <label className="block"><span className="mb-1.5 block text-xs font-semibold">{labels.client}</span><select name="clientId" required className="w-full rounded-xl border px-3.5 py-3 text-sm"><option value="">Select a client</option>{clients.map(c=><option key={c.id} value={c.id}>{c.full_name||"Client"}{c.email?" — "+c.email:""}</option>)}</select></label>
        <label className="block"><span className="mb-1.5 block text-xs font-semibold">{labels.subject}</span><input name="subject" required maxLength={200} placeholder="e.g. Maintenance request" className="w-full rounded-xl border px-3.5 py-3 text-sm"/></label>
        <label className="block"><span className="mb-1.5 block text-xs font-semibold">{labels.priority}</span><select name="priority" className="w-full rounded-xl border px-3.5 py-3 text-sm"><option value="normal">Normal</option><option value="low">Low</option><option value="high">High</option><option value="urgent">Urgent</option></select></label>
        <label className="block"><span className="mb-1.5 block text-xs font-semibold">{labels.message}</span><textarea name="body" required maxLength={10000} rows={5} placeholder="Write the first message..." className="w-full rounded-xl border px-3.5 py-3 text-sm"/></label>
        {replyError&&<p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{replyError}</p>}
        <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={()=>{setOpen(false);setReplyError("");}} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">{labels.cancel}</button><button className="rounded-xl bg-[var(--kram-charcoal)] px-4 py-2.5 text-sm font-bold text-white">{labels.send}</button></div>
      </form>
    </div></div>}
  </section>;
}