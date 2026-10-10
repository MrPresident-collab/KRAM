import { redirect } from "next/navigation";
import { ClipboardList, Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isLocale } from "@/lib/i18n";
import { EnquiriesInbox, type Enquiry } from "@/components/ops/enquiries-inbox";

const copy={
 en:{title:"Client enquiries",desc:"Review new requests, follow up with prospective clients, and track the intake stage. Enquiries are not active client accounts.",empty:"No enquiries have been submitted yet.",asset:"Asset",resident:"Client residence",help:"Requested help",preferred:"Preferred contact",details:"Additional details",save:"Save",saved:"Enquiry status updated.",error:"Could not update this enquiry. Check your access and try again.",received:"Received",contact:"Contact"},
 fr:{title:"Demandes de clients",desc:"Examinez les nouvelles demandes, contactez les clients potentiels et suivez chaque étape. Une demande ne constitue pas un compte client actif.",empty:"Aucune demande n’a encore été reçue.",asset:"Actif",resident:"Résidence du client",help:"Aide demandée",preferred:"Contact préféré",details:"Précisions",save:"Enregistrer",saved:"Le statut de la demande a été mis à jour.",error:"Impossible de modifier cette demande. Vérifiez vos accès et réessayez.",received:"Reçue",contact:"Contact"},
 pt:{title:"Pedidos de clientes",desc:"Analise novos pedidos, acompanhe potenciais clientes e monitorize cada etapa. Um pedido não constitui uma conta de cliente ativa.",empty:"Ainda não foram recebidos pedidos.",asset:"Ativo",resident:"Residência do cliente",help:"Ajuda solicitada",preferred:"Contacto preferido",details:"Detalhes adicionais",save:"Guardar",saved:"O estado do pedido foi atualizado.",error:"Não foi possível atualizar este pedido. Verifique o acesso e tente novamente.",received:"Recebido",contact:"Contacto"}
} as const;

export default async function OpsEnquiriesPage({params}:{params:Promise<{locale:string}>}){
 const route=await params;
 if(!isLocale(route.locale))redirect("/fr/ops");
 const locale=route.locale;
 const t=copy[locale];
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect("/"+locale+"/login");
 const {data:membership}=await supabase.from("organization_members").select("role").eq("user_id",user.id).eq("status","active").limit(1).maybeSingle();
 if(!membership||!["owner","admin","regional_admin","support","operations"].includes(membership.role))redirect("/"+locale+"/ops");
 const {data,error}=await supabase.from("client_enquiries").select("id,full_name,email,phone,residence,asset_location,asset_type,help_needed,details,preferred_contact,preferred_language,status,created_at").order("created_at",{ascending:false}).limit(100);
 const items=(data??[]) as Enquiry[];
 return <div className="mx-auto max-w-6xl space-y-6 p-5 md:p-8">
  <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[var(--kram-orange)]"><Inbox size={14}/> KRAM / INTAKE</p><h1 className="text-3xl font-semibold tracking-tight text-[var(--kram-ink)]">{t.title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--kram-metal)]">{t.desc}</p></div><div className="flex items-center gap-3 rounded-xl border border-[var(--kram-border)] bg-white px-4 py-3"><ClipboardList size={19} className="text-[var(--kram-orange)]"/><div><strong className="block text-lg text-[var(--kram-ink)]">{items.length}</strong><span className="text-[10px] text-[var(--kram-metal)]">Recent enquiries</span></div></div></div>
  {error?<p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{t.error}</p>:<EnquiriesInbox initialItems={items} assignees={assignees} locale={locale} labels={t}/>}
 </div>;
}
