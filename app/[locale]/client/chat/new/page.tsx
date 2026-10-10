"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isLocale, type Locale } from "@/lib/i18n";
import { KramLogo } from "@/components/brand/kram-logo";
import { ClientSignOut } from "@/components/client-portal-sign-out";

const copy = {
  en:{eyebrow:"CLIENT SUPPORT",title:"How can we help?",intro:"Tell KRAM what you need help with. This conversation is between you and the KRAM team—not an internal operations chat.",subject:"What do you need help with?",subjectHint:"A short subject",asset:"Related asset (optional)",none:"Not linked to a specific asset",message:"Tell us a little more",messageHint:"Describe what you need, what you have noticed, or what you would like us to help arrange.",submit:"Send to KRAM",sending:"Sending…",privacy:"Only you and authorised KRAM team members can see this client conversation.",back:"Back to your overview",required:"Please add a subject and message.",failed:"We couldn’t send your message. Please try again.",assetError:"Your asset list could not be loaded. You can still contact KRAM without selecting an asset."},
  fr:{eyebrow:"ASSISTANCE CLIENT",title:"Comment pouvons-nous vous aider ?",intro:"Expliquez à KRAM ce dont vous avez besoin. Cet échange est réservé à vous et à l’équipe KRAM, séparément des conversations internes des opérations.",subject:"De quelle aide avez-vous besoin ?",subjectHint:"Objet en quelques mots",asset:"Actif concerné (facultatif)",none:"Aucun actif précis",message:"Dites-nous en un peu plus",messageHint:"Décrivez votre besoin, ce que vous avez constaté ou ce que vous souhaitez que nous organisions.",submit:"Envoyer à KRAM",sending:"Envoi…",privacy:"Seuls vous et les membres autorisés de l’équipe KRAM peuvent voir cet échange client.",back:"Retour à votre espace",required:"Veuillez renseigner l’objet et le message.",failed:"Votre message n’a pas pu être envoyé. Veuillez réessayer.",assetError:"Impossible de charger vos actifs. Vous pouvez contacter KRAM sans en sélectionner un."},
  pt:{eyebrow:"APOIO AO CLIENTE",title:"Como podemos ajudar?",intro:"Explique à KRAM de que ajuda precisa. Esta conversa é entre si e a equipa KRAM, separada das conversas internas de operações.",subject:"De que ajuda precisa?",subjectHint:"Assunto breve",asset:"Ativo relacionado (opcional)",none:"Não está ligado a um ativo específico",message:"Conte-nos um pouco mais",messageHint:"Descreva o que precisa, o que observou ou o que gostaria que ajudássemos a organizar.",submit:"Enviar à KRAM",sending:"A enviar…",privacy:"Só você e os membros autorizados da equipa KRAM podem ver esta conversa de cliente.",back:"Voltar à sua área",required:"Indique o assunto e a mensagem.",failed:"Não foi possível enviar a mensagem. Tente novamente.",assetError:"Não foi possível carregar os seus ativos. Pode contactar a KRAM sem selecionar um ativo."}
} as const;

export default function NewClientConversationPage(){
  const params=useParams<{locale:string}>();
  const locale:Locale=isLocale(params.locale)?params.locale:"fr";
  const t=copy[locale];
  const router=useRouter();
  const supabase=useMemo(()=>createClient(),[]);
  const [assets,setAssets]=useState<{id:string;name:string;reference_code:string|null}[]>([]);
  const [assetError,setAssetError]=useState(false);
  const [subject,setSubject]=useState("");
  const [body,setBody]=useState("");
  const [assetId,setAssetId]=useState("");
  const [pending,setPending]=useState(false);
  const [error,setError]=useState("");

  useEffect(()=>{
    let live=true;
    async function load(){
      const {data:{user}}=await supabase.auth.getUser();
      if(!user){router.replace("/"+locale+"/client-login");return;}
      const {data:clientId}=await supabase.rpc("current_kram_client_id");
      if(!clientId){router.replace("/"+locale+"/client-login");return;}
      const {data,error:loadError}=await supabase.from("assets").select("id,name,reference_code").eq("client_id",clientId).order("name");
      if(!live)return;
      if(loadError)setAssetError(true);
      setAssets(data??[]);
    }
    void load();
    return()=>{live=false;};
  },[locale,router,supabase]);

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setError("");
    if(!subject.trim()||!body.trim()){setError(t.required);return;}
    setPending(true);
    const {data,error:rpcError}=await supabase.rpc("start_client_support_conversation",{
      p_subject:subject.trim(),p_body:body.trim(),p_asset_id:assetId||null
    });
    if(rpcError||!data){setError(t.failed);setPending(false);return;}
    router.replace("/"+locale+"/client/chat/"+data);
    router.refresh();
  }

  return <main className="client-portal">
    <header className="client-portal-header"><Link href={"/"+locale} aria-label="KRAM home"><KramLogo className="client-portal-logo"/></Link><nav><Link href={"/"+locale+"/client"}>{t.back}</Link><ClientSignOut locale={locale} label={locale==="fr"?"Se déconnecter":locale==="pt"?"Terminar sessão":"Sign out"}/></nav></header>
    <div className="client-form-layout">
      <Link className="client-form-back" href={"/"+locale+"/client"}><ArrowLeft size={15}/>{t.back}</Link>
      <section className="client-form-heading"><p className="eyebrow"><span className="eyebrow-line"/>{t.eyebrow}</p><h1>{t.title}</h1><p>{t.intro}</p></section>
      <form className="client-form-panel" onSubmit={submit}>
        <label>{t.subject}<input required maxLength={180} value={subject} onChange={e=>setSubject(e.target.value)} placeholder={t.subjectHint}/></label>
        <label>{t.asset}<select value={assetId} onChange={e=>setAssetId(e.target.value)}><option value="">{t.none}</option>{assets.map(asset=><option key={asset.id} value={asset.id}>{asset.name}{asset.reference_code?" — "+asset.reference_code:""}</option>)}</select></label>
        {assetError&&<p className="client-form-muted">{t.assetError}</p>}
        <label>{t.message}<textarea required maxLength={5000} rows={7} value={body} onChange={e=>setBody(e.target.value)} placeholder={t.messageHint}/></label>
        {error&&<p role="alert" className="client-access-error">{error}</p>}
        <div className="client-form-submit-row"><p><ShieldCheck size={16}/>{t.privacy}</p><button className="button button-orange" type="submit" disabled={pending}>{pending?t.sending:t.submit}<ArrowRight size={16}/></button></div>
      </form>
      <aside className="client-form-note"><MessageCircle size={18}/><p>{t.privacy}</p></aside>
    </div>
  </main>;
}
