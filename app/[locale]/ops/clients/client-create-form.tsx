"use client";
import {useActionState,useEffect,useState} from "react";
import {Loader2,Save} from "lucide-react";
import {createClientRecord} from "./actions";
import {createClient as createSupabaseClient} from "@/lib/supabase/client";
import type {Locale} from "@/lib/i18n";

const labels={fr:{name:"Nom complet",email:"Adresse e-mail",phone:"Téléphone",notes:"Notes",branch:"Agence / ville",select:"Sélectionner une agence",save:"Créer le client",saving:"Création..."},en:{name:"Full name",email:"Email address",phone:"Phone",notes:"Notes",branch:"Branch / city",select:"Select a branch",save:"Create client",saving:"Creating..."},pt:{name:"Nome completo",email:"Endereço de e-mail",phone:"Telefone",notes:"Notas",branch:"Sucursal / cidade",select:"Selecionar uma sucursal",save:"Criar cliente",saving:"A criar..."}} as const;
type Branch={id:string;name:string;city:string};
export function ClientCreateForm({locale}:{locale:Locale}){
 const t=labels[locale], [state,action,pending]=useActionState(createClientRecord,{success:false,message:""});
 const [branches,setBranches]=useState<Branch[]>([]), [loading,setLoading]=useState(true);
 useEffect(()=>{const supabase=createSupabaseClient();void (async()=>{const {data}=await supabase.from("branches").select("id,name,city").order("name");setBranches(data??[]);setLoading(false)})()},[]);
 return <form action={action} className="rounded-2xl border border-[var(--kram-border)] bg-white p-6 shadow-sm space-y-5">
  <label className="block"><span className="mb-1.5 block text-xs font-semibold">{t.name}</span><input name="fullName" required className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm focus:border-[var(--kram-orange)] outline-none"/></label>
  <label className="block"><span className="mb-1.5 block text-xs font-semibold">{t.branch}</span><select name="branchId" required disabled={loading||branches.length===0} className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm"><option value="">{loading?"Loading...":t.select}</option>{branches.map(b=><option key={b.id} value={b.id}>{b.name} — {b.city}</option>)}</select></label>
  <div className="grid gap-5 md:grid-cols-2"><label><span className="mb-1.5 block text-xs font-semibold">{t.email}</span><input name="email" type="email" className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm"/></label><label><span className="mb-1.5 block text-xs font-semibold">{t.phone}</span><input name="phone" className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm"/></label></div>
  <label className="block"><span className="mb-1.5 block text-xs font-semibold">{t.notes}</span><textarea name="notes" rows={5} className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm outline-none focus:border-[var(--kram-orange)]"/></label>
  {state.message&&<p className={state.success?"rounded-xl bg-emerald-50 px-3.5 py-3 text-xs font-medium text-emerald-700":"rounded-xl bg-red-50 px-3.5 py-3 text-xs font-medium text-red-700"}>{state.message}</p>}
  <div className="flex justify-end border-t border-zinc-100 pt-5"><button disabled={pending||loading||branches.length===0} className="inline-flex items-center gap-2 rounded-xl bg-[var(--kram-charcoal)] px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{pending?<Loader2 size={15} className="animate-spin"/>:<Save size={15}/>} {pending?t.saving:t.save}</button></div>
 </form>
}