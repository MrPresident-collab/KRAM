import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isLocale, type Locale, copy } from "@/lib/i18n";
import { ClientEditForm } from "../edit-form";

export default async function EditClientPage({params}:{params:Promise<{locale:string;id:string}>}){
 const {locale,id}=await params;if(!isLocale(locale))notFound();
 const s=await createClient();
 const {data:claims}=await s.auth.getClaims();const uid=claims?.claims?.sub;if(!uid)notFound();
 const {data:m}=await s.from("organization_members").select("organization_id,role,scope_level,branch_id").eq("user_id",uid).eq("status","active").limit(1).maybeSingle();
 if(!m||!["owner","admin","regional_admin","operations","support"].includes(m.role))notFound();
 const {data:client}=await s.from("clients").select("id,full_name,email,primary_phone,alternative_phone,residency_country,residency_city,residency_address,preferred_language,preferred_contact_method,notes,branch_id").eq("id",id).eq("organization_id",m.organization_id).maybeSingle();
 if(!client||(m.scope_level==="branch"&&client.branch_id!==m.branch_id))notFound();
 const t=copy[locale as Locale];
 return <div className="mx-auto max-w-4xl space-y-7"><Link href={"/"+locale+"/ops/clients/"+id} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900"><ArrowLeft size={15}/>{t.common.back}</Link><section><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">{t.nav.clients}</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-zinc-950">{locale==="fr"?"Modifier le client":locale==="pt"?"Editar cliente":"Edit client"}</h1><p className="mt-2 text-sm text-zinc-500">{client.full_name}</p></section><ClientEditForm locale={locale as Locale} client={client}/></div>;
}
