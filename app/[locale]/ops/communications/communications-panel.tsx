"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquare, Plus, Search, Send, X } from "lucide-react";
import { startConversation, sendMessage } from "./actions";
import type { Locale } from "@/lib/i18n";

type ClientRef = { id:string; full_name:string|null; email:string|null };
type Message = { id:string; body:string; sent_at:string };
type Conversation = { id:string; subject:string|null; status:string; priority:string|null; clients:ClientRef|ClientRef[]|null; messages:Message[] };

export function CommunicationsPanel({ locale, conversations, clients }:{locale:Locale;conversations:Conversation[];clients:ClientRef[]}) {
  const [q,setQ]=useState("");
  const [selected,setSelected]=useState<string|null>(conversations[0]?.id??null);
  const [open,setOpen]=useState(false);
  const [reply,setReply]=useState("");
  const [replyPending,setReplyPending]=useState(false);
  const [replyError,setReplyError]=useState("");
  const router=useRouter();

  const filtered=useMemo(()=>conversations.filter(c=>{
    const client=Array.isArray(c.clients)?c.clients[0]:c.clients;
    return !q||[client?.full_name,c.subject,...c.messages.map(m=>m.body)].filter(Boolean).join(" ").toLowerCase().includes(q.toLowerCase());
  }),[conversations,q]);

  const active=conversations.find(c=>c.id===selected);
  const client=active&&(Array.isArray(active.clients)?active.clients[0]:active.clients);
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
        {filtered.map(c=>{const x=Array.isArray(c.clients)?c.clients[0]:c.clients;const latest=c.messages[0];return <button type="button" key={c.id} onClick={()=>{setSelected(c.id);setReplyError("");}} className={`block w-full px-4 py-4 text-left hover:bg-zinc-50 ${selected===c.id?"bg-orange-50/60":""}`}>
          <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-bold text-zinc-900">{x?.full_name??"Client"}</p><p className="mt-0.5 truncate text-xs text-zinc-400">{c.subject||"General communication"}</p></div><span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-500">{c.status}</span></div>
          {latest&&<p className="mt-2 truncate text-xs text-zinc-500">{latest.body}</p>}
        </button>})}
        {!filtered.length&&<div className="p-8 text-center text-sm text-zinc-500">{q?labels.noMatch:labels.empty}</div>}
      </div>
    </aside>
    <main className="flex min-h-0 flex-col">
      {active ? <>
        <header className="border-b border-zinc-100 p-5"><p className="text-sm font-bold">{client?.full_name??"Client"}</p><p className="mt-1 text-xs text-zinc-400">{active.subject||"General communication"}</p></header>
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