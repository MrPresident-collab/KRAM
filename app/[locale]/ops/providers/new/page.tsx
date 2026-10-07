import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { copy, isLocale, type Locale } from "@/lib/i18n";
import { ProviderCreateForm } from "./form";

export default async function NewProviderPage({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;
 if(!isLocale(locale)) notFound();
 const t=copy[locale as Locale];
 const s=await createClient();
 const [{data:branches},{data:services}]=await Promise.all([s.from("branches").select("id,name,city").eq("is_active",true).order("name"),s.from("service_catalog").select("id,code,name_en,name_fr,name_pt").eq("active",true).order("sort_order")]);
 return <div className="mx-auto max-w-3xl space-y-7">
  <Link href={`/${locale}/ops/providers`} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900"><ArrowLeft size={15}/>{t.common.back}</Link>
  <section><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">{t.nav.providers}</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-zinc-950">{locale==="fr"?"Ajouter un prestataire":locale==="pt"?"Adicionar prestador":"Add service provider"}</h1><p className="mt-2 text-sm text-zinc-500">{locale==="fr"?"Enregistrez un professionnel du réseau terrain KRAM.":locale==="pt"?"Registe um profissional da rede de terreno KRAM.":"Register a professional in KRAM's field network."}</p></section>
  <ProviderCreateForm locale={locale as Locale} branches={branches??[]} services={services??[]}/>
 </div>;
}