import { MessageSquare, Search, UserRound } from "lucide-react";
import { getOpsUi, isLocale, type Locale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { sendMessage } from "./actions";
export default async function CommunicationsPage({params}:{params:Promise<{locale:string}>}){ const {locale}=await params; if(!isLocale(locale)) return null; const ui=getOpsUi(locale as Locale);
 const supabase=await createClient();
 const {data:conversations}=await supabase.from("client_conversations").select("id,client_id,subject,channel,status,priority,last_message_at,clients(full_name,email)").order("last_message_at",{ascending:false,nullsFirst:false}).limit(50);
 const ids=(conversations??[]).map(c=>c.id);
 const {data:messages}=ids.length?await supabase.from("client_conversation_messages").select("id,conversation_id,body,visibility,sent_at,sender_user_id,sender_client_id").in("conversation_id",ids).order("sent_at",{ascending:false}).limit(100):{data:[]};
 const latest=new Map((messages??[]).map(m=>[m.conversation_id,m]));
 return <div className="space-y-6">
  <section><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--kram-orange)]">{ui.communications.eyebrow}</p><h1 className="mt-2 text-3xl font-bold tracking-[-.045em] text-zinc-950">{ui.communications.title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">{ui.communications.description}</p></section>
  <section className="grid min-h-[620px] overflow-hidden rounded-2xl border border-[var(--kram-border)] bg-white lg:grid-cols-[330px_1fr]">
   <aside className="border-b border-zinc-100 lg:border-b-0 lg:border-r"><div className="border-b p-4"><div className="flex items-center gap-2 rounded-lg border bg-zinc-50 px-3 py-2"><Search size={15} className="text-zinc-400"/><span className="text-sm text-zinc-400">{ui.communications.search}</span></div></div><div className="divide-y divide-zinc-100">{(conversations??[]).map(c=>{const m=latest.get(c.id);const client=Array.isArray(c.clients)?c.clients[0]:c.clients;return <div key={c.id} className="cursor-pointer px-4 py-4 hover:bg-zinc-50"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-bold text-zinc-900">{client?.full_name??"Client"}</p><p className="mt-0.5 truncate text-xs text-zinc-400">{c.subject||"General communication"}</p></div><span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-500">{c.status}</span></div>{m&&<p className="mt-2 truncate text-xs text-zinc-500">{m.body}</p>}</div>})}</div></aside>
   <main className="flex flex-col"><div className="flex flex-1 items-center justify-center p-10 text-center"><div className="max-w-sm"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100"><MessageSquare size={23} className="text-zinc-500"/></div><h2 className="mt-4 text-base font-bold text-zinc-950">{ui.communications.select}</h2><p className="mt-1 text-sm leading-6 text-zinc-500">{ui.communications.selectDesc}</p></div></div>
   <div className="border-t bg-zinc-50/60 p-4"><div className="flex items-center gap-2 text-xs font-semibold text-zinc-500"><UserRound size={14}/> Client communication is kept separate from internal audit activity.</div></div></main>
  </section>
 </div>;
}