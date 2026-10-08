"use client";
import {useActionState,useEffect} from "react";
import {useRouter} from "next/navigation";
import {Loader2,Save} from "lucide-react";
import {createProvider} from "../actions";
import type {Locale} from "@/lib/i18n";

type Branch={id:string;name:string;city:string}; type Service={id:string;code:string;name_en:string;name_fr:string;name_pt:string};
const labels={
 fr:{name:"Nom",phone:"Téléphone",email:"E-mail",specialties:"Spécialités",coverage:"Zone de couverture",branch:"Agence",select:"Sélectionner une agence",notes:"Notes",save:"Ajouter le prestataire",saving:"Ajout...",phoneHint:"Format international, par ex. +244 9XX XXX XXX"},
 en:{name:"Name",phone:"Phone",email:"Email",specialties:"Specialties",coverage:"Coverage",branch:"Branch",select:"Select a branch",notes:"Notes",save:"Add provider",saving:"Adding...",phoneHint:"International format, e.g. +244 9XX XXX XXX"},
 pt:{name:"Nome",phone:"Telefone",email:"E-mail",specialties:"Especialidades",coverage:"Cobertura",branch:"Sucursal",select:"Selecionar uma sucursal",notes:"Notas",save:"Adicionar prestador",saving:"A adicionar...",phoneHint:"Formato internacional, por ex. +244 9XX XXX XXX"}
} as const;
export function ProviderCreateForm({locale,branches,services}:{locale:Locale;branches:Branch[];services:Service[]}){
 const t=labels[locale];
 const[state,action,pending]=useActionState(createProvider,{success:false,message:""});const router=useRouter();useEffect(()=>{if(state.success)router.push(`/${locale}/ops/providers`);},[state.success,locale,router]);
 return <form action={action} className="space-y-5 rounded-2xl border border-[var(--kram-border)] bg-white p-6 shadow-sm">
  {([["name",t.name,"text",true],["phone",t.phone,"tel",false],["email",t.email,"email",false],["coverage",t.coverage,"text",false]] as const).map(([name,label,type,required])=><label key={name}><span className="mb-1.5 block text-xs font-semibold">{label}</span><input name={name} type={type} required={required} placeholder={name==="phone"?"+244 9XX XXX XXX":undefined} className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm"/>{name==="phone"&&<span className="mt-1.5 block text-[11px] text-zinc-400">{t.phoneHint}</span>}</label>)}
  <fieldset><legend className="mb-2 block text-xs font-semibold">{t.specialties}</legend><p className="mb-3 text-[11px] text-zinc-400">Select all services this provider can perform.</p><div className="grid gap-2 sm:grid-cols-2">{services.map(s=><label key={s.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 px-3.5 py-3 text-sm hover:bg-zinc-50"><input type="checkbox" name="specialties" value={s.code} className="h-4 w-4"/><span>{locale==="fr"?s.name_fr:locale==="pt"?s.name_pt:s.name_en}</span></label>)}</div></fieldset>
  <label className="block"><span className="mb-1.5 block text-xs font-semibold">{t.branch}</span><select name="branchId" className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm"><option value="">{t.select}</option>{branches.map(b=><option key={b.id} value={b.id}>{b.name} — {b.city}</option>)}</select></label>
  <label className="block"><span className="mb-1.5 block text-xs font-semibold">{t.notes}</span><textarea name="notes" rows={4} className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm"/></label>
  {state.message&&<p className={state.success?"rounded-xl bg-emerald-50 px-3.5 py-3 text-xs font-medium text-emerald-700":"rounded-xl bg-red-50 px-3.5 py-3 text-xs font-medium text-red-700"}>{state.message}</p>}
  <div className="flex justify-end border-t border-zinc-100 pt-5"><button disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-[var(--kram-charcoal)] px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{pending?<Loader2 size={15} className="animate-spin"/>:<Save size={15}/>} {pending?t.saving:t.save}</button></div>
 </form>;
}