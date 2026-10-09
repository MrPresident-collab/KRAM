import { notFound } from "next/navigation";
import { getOpsUi, isLocale, type Locale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { CommunicationsPanel } from "./communications-panel";

export default async function CommunicationsPage({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;if(!isLocale(locale))notFound();
 const ui=getOpsUi(locale as Locale);const s=await createClient();
 const {data:claims}=await s.auth.getClaims();const uid=claims?.claims?.sub;if(!uid)notFound();
 const {data:membership}=await s.from("organization_members").select("organization_id,role").eq("user_id",uid).eq("status","active").limit(1).maybeSingle();if(!membership)notFound();
 const [{data:conversations},{data:clients},{data:staff}]=await Promise.all([
  s.from("client_conversations").select("id,subject,status,case_status,priority,assigned_to,escalation_reason,resolution_summary,created_at,updated_at,clients(id,full_name,email)").eq("organization_id",membership.organization_id).order("updated_at",{ascending:false}).limit(50),
  s.from("clients").select("id,full_name,email").eq("organization_id",membership.organization_id).eq("status","active").order("full_name").limit(500),
  s.from("organization_members").select("user_id,role,profiles(full_name,work_email)").eq("organization_id",membership.organization_id).eq("status","active").order("created_at")
 ]);
 const ids=(conversations??[]).map(c=>c.id);
 const [{data:messages},{data:events}]=ids.length?await Promise.all([
  s.from("client_conversation_messages").select("id,conversation_id,body,sent_at,visibility,sender_user_id").eq("organization_id",membership.organization_id).in("conversation_id",ids).order("sent_at",{ascending:false}).limit(300),
  s.from("client_conversation_events").select("id,conversation_id,event_type,from_status,to_status,details,created_at,actor_id,assigned_to").eq("organization_id",membership.organization_id).in("conversation_id",ids).order("created_at",{ascending:false}).limit(300)
 ]):[{data:[]},{data:[]}];
 const grouped=(conversations??[]).map(c=>({...c,messages:(messages??[]).filter(m=>m.conversation_id===c.id),events:(events??[]).filter(e=>e.conversation_id===c.id)}));
 return <div className="space-y-6"><section><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--kram-orange)]">{ui.communications.eyebrow}</p><h1 className="mt-2 text-3xl font-bold tracking-[-.045em] text-zinc-950">{ui.communications.title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">{ui.communications.description}</p></section><CommunicationsPanel locale={locale as Locale} conversations={grouped} clients={clients??[]} staff={(staff??[]).map(m=>{const p=Array.isArray(m.profiles)?m.profiles[0]:m.profiles;return {user_id:m.user_id,role:m.role,name:p?.full_name??p?.work_email??"Staff member"}})} currentRole={membership.role}/></div>;
}
