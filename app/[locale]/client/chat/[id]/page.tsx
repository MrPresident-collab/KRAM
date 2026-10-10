"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isLocale, type Locale } from "@/lib/i18n";
import { KramLogo } from "@/components/brand/kram-logo";
import { ClientSignOut } from "@/components/client-portal-sign-out";

type ChatMessage={id:string;body:string;sender_client_id:string|null;sender_user_id:string|null;sent_at:string|null;created_at:string;visibility:string};
type Chat={id:string;subject:string;status:string;created_at:string;last_message_at:string|null};
const copy={
 en:{eyebrow:"CLIENT SUPPORT",back:"Your overview",title:"Conversation",intro:"A direct line to the KRAM team about the help you need.",reply:"Write a message to KRAM…",send:"Send message",sending:"Sending…",empty:"Your conversation will appear here.",privacy:"This is a private client-to-KRAM conversation. Internal notes and operational conversations are not shown here.",failed:"We couldn’t send that message. Please try again.",missing:"This conversation could not be found for your account.",closed:"This conversation is marked as closed. Contact KRAM to continue the matter.",you:"You",team:"KRAM team"},
 fr:{eyebrow:"ASSISTANCE CLIENT",back:"Votre espace",title:"Conversation",intro:"Un échange direct avec l’équipe KRAM concernant votre besoin.",reply:"Écrire un message à KRAM…",send:"Envoyer",sending:"Envoi…",empty:"Votre conversation apparaîtra ici.",privacy:"Cet échange est privé entre le client et KRAM. Les notes internes et conversations opérationnelles ne sont pas affichées.",failed:"Impossible d’envoyer ce message. Veuillez réessayer.",missing:"Cette conversation est introuvable pour votre compte.",closed:"Cette conversation est clôturée. Contactez KRAM pour poursuivre.",you:"Vous",team:"Équipe KRAM"},
 pt:{eyebrow:"APOIO AO CLIENTE",back:"A sua área",title:"Conversa",intro:"Um contacto direto com a equipa KRAM sobre a ajuda de que precisa.",reply:"Escreva uma mensagem à KRAM…",send:"Enviar mensagem",sending:"A enviar…",empty:"A sua conversa aparecerá aqui.",privacy:"Esta conversa é privada entre o cliente e a KRAM. As notas internas e conversas operacionais não são apresentadas.",failed:"Não foi possível enviar a mensagem. Tente novamente.",missing:"Esta conversa não foi encontrada na sua conta.",closed:"Esta conversa está encerrada. Contacte a KRAM para continuar.",you:"Você",team:"Equipa KRAM"}
} as const;

export default function ClientConversationPage(){
 const params=useParams<{locale:string;id:string}>();
 const locale:Locale=isLocale(params.locale)?params.locale:"fr";
 const t=copy[locale];
 const id=params.id;
 const router=useRouter();
 const supabase=useMemo(()=>createClient(),[]);
 const [chat,setChat]=useState<Chat|null>(null);
 const [messages,setMessages]=useState<ChatMessage[]>([]);
 const [body,setBody]=useState("");
 const [loading,setLoading]=useState(true);
 const [pending,setPending]=useState(false);
 const [error,setError]=useState("");

 const load=useCallback(async()=>{
   const {data:{user}}=await supabase.auth.getUser();
   if(!user){router.replace("/"+locale+"/client-login");return;}
   const {data:clientId}=await supabase.rpc("current_kram_client_id");
   if(!clientId){router.replace("/"+locale+"/client-login");return;}
   const {data:conversation,error:chatError}=await supabase.from("client_conversations").select("id,subject,status,created_at,last_message_at").eq("id",id).eq("client_id",clientId).maybeSingle();
   if(chatError||!conversation){setError(t.missing);setLoading(false);return;}
   const {data:rows,error:messageError}=await supabase.from("client_conversation_messages").select("id,body,sender_client_id,sender_user_id,sent_at,created_at,visibility").eq("conversation_id",id).eq("visibility","client").order("sent_at",{ascending:true});
   if(messageError){setError(t.missing);setLoading(false);return;}
   setChat(conversation);setMessages(rows??[]);setLoading(false);
 },[id,locale,router,supabase,t.missing]);

 useEffect(()=>{void load();},[load]);

 async function submit(event:FormEvent<HTMLFormElement>){
   event.preventDefault();if(!body.trim()||pending)return;
   setPending(true);setError("");
   const {error:sendError}=await supabase.rpc("send_client_support_message",{p_conversation_id:id,p_body:body.trim()});
   if(sendError){setError(t.failed);setPending(false);return;}
   setBody("");await load();setPending(false);
 }

 return <main className="client-portal">
  <header className="client-portal-header"><Link href={"/"+locale} aria-label="KRAM home"><KramLogo className="client-portal-logo"/></Link><nav><Link href={"/"+locale+"/client"}>{t.back}</Link><ClientSignOut locale={locale} label={locale==="fr"?"Se déconnecter":locale==="pt"?"Terminar sessão":"Sign out"}/></nav></header>
  <div className="client-chat-layout">
   <Link className="client-form-back" href={"/"+locale+"/client"}><ArrowLeft size={15}/>{t.back}</Link>
   {loading?<div className="client-chat-loading">{t.title}…</div>:chat?<>
    <section className="client-chat-heading"><p className="eyebrow"><span className="eyebrow-line"/>{t.eyebrow}</p><h1>{chat.subject}</h1><p>{t.intro}</p><span className="client-portal-status">{chat.status.replaceAll("_"," ")}</span></section>
    <section className="client-chat-panel">
     <div className="client-chat-message-list">
      {messages.length?messages.map(message=><article className={"client-chat-message "+(message.sender_client_id?"client-chat-message-own":"client-chat-message-team")} key={message.id}><div className="client-chat-message-meta"><strong>{message.sender_client_id?t.you:t.team}</strong><time>{new Intl.DateTimeFormat(locale,{dateStyle:"medium",timeStyle:"short"}).format(new Date(message.sent_at??message.created_at))}</time></div><p>{message.body}</p></article>):<p className="client-portal-empty">{t.empty}</p>}
     </div>
     {["closed","resolved"].includes(chat.status)?<p className="client-chat-closed">{t.closed}</p>:<form className="client-chat-reply" onSubmit={submit}><textarea rows={3} maxLength={5000} required value={body} onChange={e=>setBody(e.target.value)} placeholder={t.reply}/>{error&&<p role="alert" className="client-access-error">{error}</p>}<div><span><ShieldCheck size={15}/>{t.privacy}</span><button type="submit" className="button button-orange" disabled={pending||!body.trim()}>{pending?t.sending:t.send}<ArrowRight size={15}/></button></div></form>}
    </section>
   </>:<section className="client-chat-not-found"><MessageCircle size={24}/><p>{error||t.missing}</p><Link className="button button-orange" href={"/"+locale+"/client"}>{t.back}</Link></section>}
  </div>
 </main>;
}
