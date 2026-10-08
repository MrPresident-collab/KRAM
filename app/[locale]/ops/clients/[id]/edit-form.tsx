"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { updateClientRecord, type ClientActionState } from "../actions";
import type { Locale } from "@/lib/i18n";

type Client = { id:string; full_name:string; email:string|null; primary_phone:string|null; alternative_phone:string|null; residency_country:string|null; residency_city:string|null; residency_address:string|null; preferred_language:string; preferred_contact_method:string; notes:string|null };
const labels = {
 fr:{title:"Modifier le client",name:"Nom complet",email:"E-mail",phone:"Téléphone principal",alt:"Téléphone alternatif",country:"Pays de résidence",city:"Ville",address:"Adresse",language:"Langue préférée",method:"Mode de contact",notes:"Notes",save:"Enregistrer",saving:"Enregistrement...",back:"Annuler",success:"Client mis à jour."},
 en:{title:"Edit client",name:"Full name",email:"Email",phone:"Primary phone",alt:"Alternative phone",country:"Country of residence",city:"City",address:"Address",language:"Preferred language",method:"Preferred contact method",notes:"Notes",save:"Save changes",saving:"Saving...",back:"Cancel",success:"Client details updated."},
 pt:{title:"Editar cliente",name:"Nome completo",email:"E-mail",phone:"Telefone principal",alt:"Telefone alternativo",country:"País de residência",city:"Cidade",address:"Morada",language:"Idioma preferido",method:"Contacto preferido",notes:"Notas",save:"Guardar alterações",saving:"A guardar...",back:"Cancelar",success:"Dados do cliente atualizados."}
} as const;
export function ClientEditForm({locale,client}:{locale:Locale;client:Client}){
 const t=labels[locale];const [state,action,pending]=useActionState<ClientActionState,FormData>(updateClientRecord,{success:false,message:""});const router=useRouter();
 useEffect(()=>{if(state.success)router.push("/"+locale+"/ops/clients/"+client.id);},[state.success,locale,client.id,router]);
 return <form action={action} className="space-y-5 rounded-2xl border border-[var(--kram-border)] bg-white p-6">
  <input type="hidden" name="clientId" value={client.id}/>
  <div className="grid gap-5 md:grid-cols-2">
   <Field label={t.name} name="fullName" defaultValue={client.full_name} required/>
   <Field label={t.email} name="email" type="email" defaultValue={client.email||""}/>
   <Field label={t.phone} name="primaryPhone" defaultValue={client.primary_phone||""}/>
   <Field label={t.alt} name="alternativePhone" defaultValue={client.alternative_phone||""}/>
   <Field label={t.country} name="residencyCountry" defaultValue={client.residency_country||""}/>
   <Field label={t.city} name="residencyCity" defaultValue={client.residency_city||""}/>
   <Field label={t.address} name="residencyAddress" defaultValue={client.residency_address||""}/>
   <label><span className="mb-1.5 block text-xs font-semibold">{t.language}</span><select name="preferredLanguage" defaultValue={client.preferred_language||"fr"} className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm"><option value="fr">Français</option><option value="en">English</option><option value="pt">Português</option></select></label>
   <label><span className="mb-1.5 block text-xs font-semibold">{t.method}</span><select name="preferredContactMethod" defaultValue={client.preferred_contact_method||"whatsapp"} className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm"><option value="whatsapp">WhatsApp</option><option value="email">Email</option><option value="phone">Phone</option></select></label>
  </div>
  <label className="block"><span className="mb-1.5 block text-xs font-semibold">{t.notes}</span><textarea name="notes" defaultValue={client.notes||""} rows={4} className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm"/></label>
  {state.message&&<p className={`rounded-xl px-3 py-2 text-xs font-medium ${state.success?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-700"}`}>{state.message}</p>}
  <div className="flex justify-end gap-3 border-t border-zinc-100 pt-5"><button type="button" onClick={()=>router.push("/"+locale+"/ops/clients/"+client.id)} className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold">{t.back}</button><button disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-[var(--kram-charcoal)] px-4 py-2.5 text-sm font-bold text-white">{pending?<Loader2 size={15} className="animate-spin"/>:<Save size={15}/>} {pending?t.saving:t.save}</button></div>
 </form>;
}
function Field({label,name,defaultValue,required=false,type="text"}:{label:string;name:string;defaultValue:string;required?:boolean;type?:string}){return <label><span className="mb-1.5 block text-xs font-semibold">{label}</span><input name={name} defaultValue={defaultValue} required={required} type={type} className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm"/></label>}
