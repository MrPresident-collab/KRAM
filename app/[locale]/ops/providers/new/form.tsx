"use client";
import {useActionState} from "react";
import {Loader2,Save} from "lucide-react";
import {createProvider} from "../actions";
import type {Locale} from "@/lib/i18n";

type Branch={id:string;name:string;city:string}; type Service={id:string;code:string;name_en:string;name_fr:string;name_pt:string};
const labels={
 fr:{name:"Nom",phone:"Téléphone",email:"E-mail",specialty:"Spécialité",coverage:"Zone de couverture",branch:"Agence",select:"Sélectionner une agence",notes:"Notes",save:"Ajouter le prestataire",saving:"Ajout..."},
 en:{name:"Name",phone:"Phone",email:"Email",specialty:"Specialty",coverage:"Coverage",branch:"Branch",select:"Select a branch",notes:"Notes",save:"Add provider",saving:"Adding..."},
 pt:{name:"Nome",phone:"Telefone",email:"E-mail",specialty:"Especialidade",coverage:"Cobertura",branch:"Sucursal",select:"Selecionar uma sucursal",notes:"Notas",save:"Adicionar prestador",saving:"A adicionar..."}
} as const;
export function ProviderCreateForm({locale,branches,services}:{locale:Locale;branches:Branch[];services:Service[]}){
 const t=labels[locale];
 const[state,action,pending]=useActionState(createProvider,{success:false,message:""});
 return <form action={action} className="space-y-5 rounded-2xl border border-[var(--kram-border)] bg-white p-6 shadow-sm">
  {([["name",t.name,"text",true],["phone",t.phone,"tel",false],["email",t.email,"email",false],["specialty",t.specialty,"text",true],["coverage",t.coverage,"text",false]] as const).map(([name,label,type,required])=><label key={name} className={name==="coverage"?"block":"block"}><span className="mb-1.5 block text-xs font-semibold">{label}</span><input name={name} type={type} required={required} className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm"/></label>)}
  <label className="block"><span className="mb-1.5 block text-xs font-semibold">{t.branch}</span><select name="branchId" className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm"><option value="">{t.select}</option>{branches.map(b=><option key={b.id} value={b.id}>{b.name} — {b.city}</option>)}</select></label>
  <label className="block"><span className="mb-1.5 block text-xs font-semibold">{t.notes}</span><textarea name="notes" rows={4} className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm"/></label>
  {state.message&&<p className={state.success?"rounded-xl bg-emerald-50 px-3.5 py-3 text-xs font-medium text-emerald-700":"rounded-xl bg-red-50 px-3.5 py-3 text-xs font-medium text-red-700"}>{state.message}</p>}
  <div className="flex justify-end border-t border-zinc-100 pt-5"><button disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-[var(--kram-charcoal)] px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{pending?<Loader2 size={15} className="animate-spin"/>:<Save size={15}/>} {pending?t.saving:t.save}</button></div>
 </form>;
}