import { redirect } from "next/navigation";
import { ClipboardList, Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isLocale } from "@/lib/i18n";
import { EnquiriesInbox, type Enquiry } from "@/components/ops/enquiries-inbox";

const copy={
 en:{title:"Client enquiries",desc:"Review new requests, follow up with prospective clients, and track the intake stage. Enquiries are not active client accounts.",empty:"No enquiries have been submitted yet.",asset:"Asset",assets:"Assets",resident:"Client residence",help:"Requested help",preferred:"Preferred contact",details:"Additional details",save:"Save",saved:"Enquiry status updated.",error:"Could not update this enquiry. Check your access and try again.",received:"Received",contact:"Contact",assigned:"Assign to support",unassigned:"Unassigned",assignedSaved:"Assignment updated.",assignedError:"Could not assign this enquiry. Check permissions."},
 fr:{title:"Demandes de clients",desc:"Examinez les nouvelles demandes, contactez les clients potentiels et suivez chaque étape. Une demande ne constitue pas un compte client actif.",empty:"Aucune demande n’a encore été reçue.",asset:"Actif",assets:"Actifs",resident:"Résidence du client",help:"Aide demandée",preferred:"Contact préféré",details:"Précisions",save:"Enregistrer",saved:"Le statut de la demande a été mis à jour.",error:"Impossible de modifier cette demande. Vérifiez vos accès et réessayez.",received:"Reçue",contact:"Contact",assigned:"Attribuer au support",unassigned:"Non attribuée",assignedSaved:"Attribution mise à jour.",assignedError:"Impossible d’attribuer cette demande. Vérifiez les autorisations."},
 pt:{title:"Pedidos de clientes",desc:"Analise novos pedidos, acompanhe potenciais clientes e monitorize cada etapa. Um pedido não constitui uma conta de cliente ativa.",empty:"Ainda não foram recebidos pedidos.",asset:"Ativo",assets:"Ativos",resident:"Residência do cliente",help:"Ajuda solicitada",preferred:"Contacto preferido",details:"Detalhes adicionais",save:"Guardar",saved:"O estado do pedido foi atualizado.",error:"Não foi possível atualizar este pedido. Verifique o acesso e tente novamente.",received:"Recebido",contact:"Contacto",assigned:"Atribuir ao suporte",unassigned:"Não atribuído",assignedSaved:"Atribuição atualizada.",assignedError:"Não foi possível atribuir este pedido. Verifique as permissões."}
} as const;

export default async function OpsEnquiriesPage({params}:{params:Promise<{locale:string}>}){
 const route=await params;
 if(!isLocale(route.locale))redirect("/fr/ops");
 const locale=route.locale;
 const t=copy[locale];
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect("/"+locale+"/login");
 const {data:membership}=await supabase.from("organization_members").select("organization_id,role").eq("user_id",user.id).eq("status","active").limit(1).maybeSingle();
 if(!membership||!["owner","admin","regional_admin","support","operations"].includes(membership.role))redirect("/"+locale+"/ops");
 const [{data,error},{data:staff}] = await Promise.all([
  supabase.from("client_enquiries").select("id,full_name,email,phone,residence,asset_location,asset_type,help_needed,assets,details,preferred_contact,preferred_language,status,assigned_to,created_at").order("created_at",{ascending:false}).limit(100),
  supabase.from("staff_directory").select("auth_user_id,role,full_name,work_email").eq("organization_id",membership.organization_id).eq("status","active").in("role",["owner","admin","regional_admin","support"]).order("created_at",{ascending:true})
 ]);
 const items=(data??[]) as Enquiry[];
 const assignees=(staff??[]).filter((s:any)=>s.auth_user_id).map((s:any)=>({id:s.auth_user_id,name:s.full_name||s.work_email||"Support team member",role:s.role}));
 return <div className="mx-auto max-w-6xl space-y-6 p-5 md:p-8">
  <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[var(--kram-orange)]"><Inbox size={14}/> KRAM / INTAKE</p><h1 className="text-3xl font-semibold tracking-tight text-[var(--kram-ink)]">{t.title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--kram-metal)]">{t.desc}</p></div><div className="flex items-center gap-3 rounded-xl border border-[var(--kram-border)] bg-white px-4 py-3"><ClipboardList size={19} className="text-[var(--kram-orange)]"/><div><strong className="block text-lg text-[var(--kram-ink)]">{items.length}</strong><span className="text-[10px] text-[var(--kram-metal)]">Recent enquiries</span></div></div></div>
  {error?<p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{t.error}</p>:<EnquiriesInbox initialItems={items} assignees={assignees} locale={locale} labels={t}/>}
 </div>;
}
