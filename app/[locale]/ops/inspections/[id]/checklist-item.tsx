"use client";
import {useActionState} from"react";import{Loader2,Save}from"lucide-react";import{updateInspectionItem,type InspectionActionState}from"./actions";
import type{Locale}from"@/lib/i18n";
const labels={fr:{status:"État",notes:"Constat / note",save:"Enregistrer",saving:"Enregistrement...",pending:"En attente",pass:"Conforme",attention:"Attention",fail:"Non conforme",na:"N/A"},en:{status:"Status",notes:"Finding / note",save:"Save",saving:"Saving...",pending:"Pending",pass:"Pass",attention:"Attention",fail:"Fail",na:"N/A"},pt:{status:"Estado",notes:"Constatação / nota",save:"Guardar",saving:"A guardar...",pending:"Pendente",pass:"Conforme",attention:"Atenção",fail:"Não conforme",na:"N/A"}} as const;
const initial:InspectionActionState={success:false,message:""};
export function ChecklistItemEditor({locale,item}:{locale:Locale;item:{id:string;category:string;item:string;status:string;notes:string|null}}){
 const t=labels[locale];const[state,action,pending]=useActionState(updateInspectionItem,initial);
 return <form action={action} className="border-b border-zinc-100 px-5 py-5 last:border-0">
  <input type="hidden" name="itemId" value={item.id}/>
  <div className="grid gap-4 lg:grid-cols-[1.15fr_180px_1.25fr_auto] lg:items-start">
   <div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400">{item.category}</p><p className="mt-1 text-sm font-semibold leading-5 text-zinc-800">{item.item}</p></div>
   <label><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400">{t.status}</span><select name="status" defaultValue={item.status} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-xs font-semibold outline-none focus:border-[var(--kram-orange)]"><option value="pending">{t.pending}</option><option value="pass">{t.pass}</option><option value="attention">{t.attention}</option><option value="fail">{t.fail}</option><option value="not_applicable">{t.na}</option></select></label>
   <label><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400">{t.notes}</span><textarea name="notes" defaultValue={item.notes??""} rows={2} className="w-full resize-y rounded-xl border border-zinc-200 px-3 py-2.5 text-xs outline-none focus:border-[var(--kram-orange)]"/></label>
   <div className="flex items-end"><button disabled={pending} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--kram-charcoal)] px-3.5 py-2.5 text-xs font-bold text-white disabled:opacity-50 lg:w-auto">{pending?<Loader2 size={13} className="animate-spin"/>:<Save size={13}/>} {pending?t.saving:t.save}</button></div>
  </div>
  {state.message&&<p className={`mt-3 text-[11px] font-medium ${state.success?"text-emerald-700":"text-red-600"}`}>{state.message}</p>}
 </form>;
}
