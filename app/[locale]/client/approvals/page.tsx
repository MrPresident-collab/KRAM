import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isLocale, type Locale } from "@/lib/i18n";
import { KramLogo } from "@/components/brand/kram-logo";
import { ClientSignOut } from "@/components/client-portal-sign-out";
import { ClientApprovalsList, type ClientApproval } from "@/components/client-approvals-list";

const words={
 en:{eyebrow:"CLIENT APPROVALS",title:"Decisions that need you.",intro:"Review requests linked to your assets and record your decision directly with KRAM.",approve:"Approve request",decline:"Decline",pending:"Awaiting your decision",noRequests:"There are no pending client approval requests for your assets.",privacy:"Only requests linked to your own assets are shown. Your decision is recorded against the existing KRAM work order.",success:"Your decision has been recorded.",failed:"We couldn’t record your decision. The request may have changed; refresh and try again.",cost:"Estimated cost",requested:"Requested",asset:"Asset",back:"Your overview"},
 fr:{eyebrow:"APPROBATIONS CLIENT",title:"Les décisions qui vous attendent.",intro:"Consultez les demandes liées à vos actifs et enregistrez votre décision directement auprès de KRAM.",approve:"Approuver la demande",decline:"Refuser",pending:"En attente de votre décision",noRequests:"Aucune demande d’approbation client n’est en attente pour vos actifs.",privacy:"Seules les demandes liées à vos actifs sont affichées. Votre décision est enregistrée sur l’ordre de travail KRAM existant.",success:"Votre décision a été enregistrée.",failed:"Impossible d’enregistrer votre décision. La demande a peut-être changé ; actualisez la page.",cost:"Coût estimé",requested:"Demandé le",asset:"Actif",back:"Votre espace"},
 pt:{eyebrow:"APROVAÇÕES DO CLIENTE",title:"Decisões que precisam de si.",intro:"Consulte os pedidos relacionados com os seus ativos e registe a sua decisão diretamente com a KRAM.",approve:"Aprovar pedido",decline:"Recusar",pending:"A aguardar a sua decisão",noRequests:"Não existem pedidos de aprovação pendentes para os seus ativos.",privacy:"São apresentados apenas pedidos ligados aos seus ativos. A sua decisão fica registada na ordem de trabalho KRAM existente.",success:"A sua decisão foi registada.",failed:"Não foi possível registar a decisão. O pedido pode ter mudado; atualize a página e tente novamente.",cost:"Custo estimado",requested:"Solicitado em",asset:"Ativo",back:"A sua área"}
} as const;

export default async function ClientApprovalsPage({params}:{params:Promise<{locale:string}>}){
 const route=await params;const locale:Locale=isLocale(route.locale)?route.locale:"fr";const t=words[locale];
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/"+locale+"/client-login");
 const {data:clientId,error:clientError}=await supabase.rpc("current_kram_client_id");if(clientError||!clientId)redirect("/"+locale+"/client-login");
 const {data,error}=await supabase.rpc("get_client_approval_requests");
 const items=(error?[]:(data??[])) as ClientApproval[];
 return <main className="client-portal">
  <header className="client-portal-header"><Link href={"/"+locale} aria-label="KRAM home"><KramLogo className="client-portal-logo"/></Link><nav><Link href={"/"+locale+"/client"}>{t.back}</Link><ClientSignOut locale={locale} label={locale==="fr"?"Se déconnecter":locale==="pt"?"Terminar sessão":"Sign out"}/></nav></header>
  <div className="client-approval-page">
   <Link className="client-form-back" href={"/"+locale+"/client"}><ArrowLeft size={15}/>{t.back}</Link>
   <section className="client-form-heading"><p className="eyebrow"><span className="eyebrow-line"/>{t.eyebrow}</p><h1>{t.title}</h1><p>{t.intro}</p></section>
   <div className="client-approval-context"><ShieldCheck size={19}/><p>{t.privacy}</p></div>
   {error&&<p role="alert" className="client-access-error">{t.failed}</p>}
   <ClientApprovalsList initialItems={items} locale={locale} copy={t}/>
  </div>
 </main>;
}
