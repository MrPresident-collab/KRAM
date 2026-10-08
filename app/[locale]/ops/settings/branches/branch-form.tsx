"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";
import { createBranch } from "./actions";

const labels = {
  fr: { create:"Créer une agence",name:"Nom",code:"Code",city:"Ville",region:"Région",country:"Pays",save:"Créer l’agence",saving:"Création...",cancel:"Annuler",select:"Sélectionner un pays" },
  en: { create:"Create branch",name:"Name",code:"Code",city:"City",region:"Region",country:"Country",save:"Create branch",saving:"Creating...",cancel:"Cancel",select:"Select a country" },
  pt: { create:"Criar filial",name:"Nome",code:"Código",city:"Cidade",region:"Região",country:"País",save:"Criar filial",saving:"A criar...",cancel:"Cancelar",select:"Selecionar um país" },
} as const;

type Country = { id:string; name:string; code:string };

export function BranchForm({ locale, countries }: { locale:"fr"|"en"|"pt"; countries:Country[] }) {
  const t=labels[locale];
  const [state,action,pending]=useActionState(createBranch,{success:false,message:""});
  const ref=useRef<HTMLDialogElement>(null);
  const router=useRouter();

  useEffect(()=>{ if(state.success) { ref.current?.close(); router.refresh(); } },[state.success,router]);

  return <>
    <button type="button" onClick={()=>ref.current?.showModal()} disabled={!countries.length} className="inline-flex items-center gap-2 rounded-xl bg-[var(--kram-orange)] px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">
      <Plus size={16}/>{t.create}
    </button>
    <dialog ref={ref} className="fixed inset-0 m-auto max-h-[90dvh] w-[min(92vw,520px)] overflow-y-auto rounded-2xl border border-[var(--kram-border)] bg-white p-0 shadow-2xl backdrop:bg-black/30">
      <div className="flex items-center justify-between border-b border-[var(--kram-border)] px-6 py-5">
        <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">KRAM</p><h2 className="mt-1 text-lg font-bold text-zinc-950">{t.create}</h2></div>
        <button type="button" onClick={()=>ref.current?.close()} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100"><X size={18}/></button>
      </div>
      <form action={action} className="grid gap-4 p-6 sm:grid-cols-2">
        <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold text-zinc-700">{t.name}</span><input name="name" required className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm outline-none focus:border-[var(--kram-orange)]"/></label>
        <label><span className="mb-1.5 block text-xs font-semibold text-zinc-700">{t.code}</span><input name="code" required maxLength={12} className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm uppercase outline-none focus:border-[var(--kram-orange)]"/></label>
        <label><span className="mb-1.5 block text-xs font-semibold text-zinc-700">{t.city}</span><input name="city" required className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm outline-none focus:border-[var(--kram-orange)]"/></label>
        <label><span className="mb-1.5 block text-xs font-semibold text-zinc-700">{t.region}</span><input name="region" className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm outline-none focus:border-[var(--kram-orange)]"/></label>
        <label><span className="mb-1.5 block text-xs font-semibold text-zinc-700">{t.country}</span><select name="countryId" required className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-[var(--kram-orange)]"><option value="">{t.select}</option>{countries.map(c=><option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}</select></label>
        {state.message && <p className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs font-medium text-red-700">{state.message}</p>}
        <div className="sm:col-span-2 flex justify-end gap-2 border-t border-zinc-100 pt-5">
          <button type="button" onClick={()=>ref.current?.close()} className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold">{t.cancel}</button>
          <button disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-[var(--kram-charcoal)] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">{pending&&<Loader2 size={15} className="animate-spin"/>}{pending?t.saving:t.save}</button>
        </div>
      </form>
    </dialog>
  </>;
}
