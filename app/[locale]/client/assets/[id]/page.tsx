import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Building2, FileText, MapPin, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isLocale, type Locale } from "@/lib/i18n";
import { KramLogo } from "@/components/brand/kram-logo";
import { ClientSignOut } from "@/components/client-portal-sign-out";

const words={
 en:{eyebrow:"YOUR ASSET",back:"Your overview",reports:"Published reports",documents:"Shared documents",status:"Status",location:"Location",reference:"Reference",description:"Asset details",private:"Private to your account",privateDesc:"This page shows information KRAM has made available to your client account. Internal notes and operational records are not shown.",noReports:"No published reports are available for this asset yet.",noDocs:"No documents have been explicitly shared with you for this asset."},
 fr:{eyebrow:"VOTRE ACTIF",back:"Votre espace",reports:"Rapports publiés",documents:"Documents partagés",status:"Statut",location:"Emplacement",reference:"Référence",description:"Détails de l’actif",private:"Réservé à votre compte",privateDesc:"Cette page présente les informations mises à disposition de votre compte client. Les notes internes et les dossiers opérationnels ne sont pas affichés.",noReports:"Aucun rapport publié n’est encore disponible pour cet actif.",noDocs:"Aucun document n’a encore été explicitement partagé pour cet actif."},
 pt:{eyebrow:"O SEU ATIVO",back:"A sua área",reports:"Relatórios publicados",documents:"Documentos partilhados",status:"Estado",location:"Localização",reference:"Referência",description:"Detalhes do ativo",private:"Privado na sua conta",privateDesc:"Esta página apresenta informações disponibilizadas à sua conta de cliente. As notas internas e os registos operacionais não são apresentados.",noReports:"Ainda não existem relatórios publicados disponíveis para este ativo.",noDocs:"Ainda não foram partilhados documentos para este ativo."}
} as const;

export default async function ClientAssetPage({params}:{params:Promise<{locale:string;id:string}>}){
 const route=await params;
 const locale:Locale=isLocale(route.locale)?route.locale:"fr";
 const t=words[locale];
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect("/"+locale+"/client-login");
 const {data:clientId,error:clientError}=await supabase.rpc("current_kram_client_id");
 if(clientError||!clientId)redirect("/"+locale+"/client-login");
 const {data:asset,error}=await supabase.from("assets").select("id,name,reference_code,type,status,country_code,region,city,address,description,updated_at").eq("id",route.id).eq("client_id",clientId).maybeSingle();
 if(error||!asset)notFound();
 const [reportsResult,documentsResult]=await Promise.all([
  supabase.from("reports").select("id,title,summary,published_at").eq("asset_id",asset.id).eq("status","published").is("deleted_at",null).order("published_at",{ascending:false}),
  supabase.from("documents").select("id,file_name,description,document_type,created_at").eq("asset_id",asset.id).eq("client_id",clientId).order("created_at",{ascending:false})
 ]);
 const date=(value:string|null)=>value?new Intl.DateTimeFormat(locale,{dateStyle:"medium"}).format(new Date(value)):"—";
 const pretty=(value:string)=>value.replaceAll("_"," ").replace(/\b\w/g,c=>c.toUpperCase());
 return <main className="client-portal">
  <header className="client-portal-header"><Link href={"/"+locale} aria-label="KRAM home"><KramLogo className="client-portal-logo"/></Link><nav><Link href={"/"+locale+"/client"}>{t.back}</Link><ClientSignOut locale={locale} label={locale==="fr"?"Se déconnecter":locale==="pt"?"Terminar sessão":"Sign out"}/></nav></header>
  <div className="client-asset-layout">
   <Link className="client-form-back" href={"/"+locale+"/client"}><ArrowLeft size={15}/>{t.back}</Link>
   <section className="client-asset-hero"><div className="client-asset-icon"><Building2 size={29}/></div><p className="eyebrow"><span className="eyebrow-line"/>{t.eyebrow}</p><h1>{asset.name}</h1><p>{[asset.city,asset.region,asset.country_code].filter(Boolean).join(", ")||"—"}</p><span className="client-portal-status">{pretty(asset.status)}</span></section>
   <section className="client-asset-details"><div><span>{t.status}</span><strong>{pretty(asset.status)}</strong></div><div><span>{t.reference}</span><strong>{asset.reference_code||"—"}</strong></div><div><span>{t.location}</span><strong>{[asset.address,asset.city,asset.region,asset.country_code].filter(Boolean).join(", ")||"—"}</strong></div></section>
   {asset.description&&<section className="client-asset-description"><p className="eyebrow">{t.description}</p><p>{asset.description}</p></section>}
   <section className="client-portal-panel"><div className="client-portal-panel-heading"><div><p className="eyebrow">01 / REPORTS</p><h2>{t.reports}</h2></div><FileText size={20}/></div>{reportsResult.data?.length?<div className="client-portal-list">{reportsResult.data.map(report=><article className="client-portal-list-row" key={report.id}><span className="client-portal-row-icon"><FileText size={17}/></span><span className="client-portal-row-main"><strong>{report.title}</strong><small>{report.summary||date(report.published_at)}</small></span><span className="client-portal-status">{date(report.published_at)}</span></article>)}</div>:<p className="client-portal-empty">{t.noReports}</p>}</section>
   <section className="client-portal-panel"><div className="client-portal-panel-heading"><div><p className="eyebrow">02 / DOCUMENTS</p><h2>{t.documents}</h2></div><FileText size={20}/></div>{documentsResult.data?.length?<div className="client-portal-list">{documentsResult.data.map(doc=><article className="client-portal-list-row" key={doc.id}><span className="client-portal-row-icon"><FileText size={17}/></span><span className="client-portal-row-main"><strong>{doc.file_name}</strong><small>{doc.description||pretty(doc.document_type)}</small></span><span className="client-portal-status">{date(doc.created_at)}</span></article>)}</div>:<p className="client-portal-empty">{t.noDocs}</p>}</section>
   <aside className="client-portal-privacy"><ShieldCheck size={19}/><div><strong>{t.private}</strong><p>{t.privateDesc}</p></div></aside>
  </div>
 </main>;
}
