import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { copy, isLocale, type Locale } from "@/lib/i18n";
import { AssetEditForm } from "../edit-form";

export default async function EditAssetPage({params}:{params:Promise<{locale:string;id:string}>}){
 const{locale,id}=await params;if(!isLocale(locale))notFound();const t=copy[locale as Locale];const s=await createClient();
 const{data:claims}=await s.auth.getClaims();const uid=claims?.claims?.sub;if(!uid)notFound();
 const{data:m}=await s.from("organization_members").select("organization_id,role,scope_level,country_id,branch_id").eq("user_id",uid).eq("status","active").order("created_at",{ascending:true}).limit(1).maybeSingle();
 if(!m||!["owner","admin","regional_admin","operations"].includes(m.role))notFound();
 const[{data:asset},{data:countries},{data:branches},{data:clients}]=await Promise.all([
  s.from("assets").select("id,name,type,status,country_code,branch_id,city,address,description,client_id").eq("id",id).eq("organization_id",m.organization_id).maybeSingle(),
  s.from("countries").select("id,name,code").eq("organization_id",m.organization_id).order("name"),
  s.from("branches").select("id,country_id,name,city").eq("organization_id",m.organization_id).eq("is_active",true).order("name"),
  s.from("clients").select("id,full_name").eq("organization_id",m.organization_id).order("full_name"),
 ]);
 if(!asset||(m.scope_level==="branch"&&asset.branch_id!==m.branch_id))notFound();
 const country=(countries??[]).find(x=>x.code.toUpperCase()===String(asset.country_code||"").toUpperCase());
 const editAsset={...asset,countryId:country?.id??(m.scope_level==="country"?m.country_id??"":""),city:asset.city??""};
 return <div className="mx-auto max-w-4xl space-y-7"><Link href={"/"+locale+"/ops/assets/"+id} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900"><ArrowLeft size={15}/>{t.common.back}</Link><section><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">{t.nav.assets}</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-zinc-950">{locale==="fr"?"Modifier l’actif":locale==="pt"?"Editar ativo":"Edit asset"}</h1><p className="mt-2 text-sm text-zinc-500">{asset.name}</p></section><AssetEditForm locale={locale as Locale} asset={editAsset} countries={countries??[]} branches={branches??[]} clients={clients??[]}/></div>;
}
