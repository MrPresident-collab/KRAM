"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { createCountry } from "./actions";

const labels = {
  fr: ["Ajouter un pays","Nom du pays","Code pays","République démocratique du Congo","drc","Annuler","Créer le pays","Création...","2–3 lettres minuscules. Exemples : drc, rsa."],
  en: ["Add country","Country name","Country code","Democratic Republic of the Congo","drc","Cancel","Create country","Creating...","2–3 lowercase letters. Examples: drc, rsa."],
  pt: ["Adicionar país","Nome do país","Código do país","República Democrática do Congo","drc","Cancelar","Criar país","A criar...","2–3 letras minúsculas. Exemplos: drc, rsa."]
} as const;

export function CountryForm({ locale }: { locale: "fr" | "en" | "pt" }) {
  const t = labels[locale];
  const [state, action, pending] = useActionState(createCountry, { success: false, message: "" });
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (state.success) ref.current?.close(); }, [state.success]);
  return <>
    <button type="button" onClick={() => ref.current?.showModal()} className="inline-flex items-center gap-2 rounded-lg bg-[var(--kram-charcoal)] px-4 py-2.5 text-sm font-bold text-white"><Plus size={16}/>{t[0]}</button>
    <dialog ref={ref} className="w-[min(92vw,480px)] rounded-2xl border border-[var(--kram-border)] bg-white p-0 shadow-2xl backdrop:bg-black/30">
      <div className="flex items-center justify-between border-b border-[var(--kram-border)] px-6 py-5"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[var(--kram-orange)]">KRAM / Settings</p><h2 className="mt-1 text-lg font-bold text-zinc-950">{t[0]}</h2></div><button type="button" onClick={() => ref.current?.close()} className="rounded-lg p-2 text-zinc-400"><X size={18}/></button></div>
      <form action={action} className="space-y-5 p-6">
        <label className="block"><span className="mb-1.5 block text-xs font-semibold text-zinc-700">{t[1]}</span><input name="name" required maxLength={100} placeholder={t[3]} className="w-full rounded-lg border border-zinc-200 px-3.5 py-3 text-sm outline-none focus:border-[var(--kram-orange)]"/></label>
        <label className="block"><span className="mb-1.5 block text-xs font-semibold text-zinc-700">{t[2]}</span><input name="code" required maxLength={3} minLength={2} placeholder={t[4]} className="w-full rounded-lg border border-zinc-200 px-3.5 py-3 text-sm lowercase outline-none focus:border-[var(--kram-orange)]"/><span className="mt-1.5 block text-[11px] text-zinc-400">{t[8]}</span></label>
        {state.message && <p className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-xs text-red-700">{state.message}</p>}
        <div className="flex justify-end gap-2 border-t border-zinc-100 pt-5"><button type="button" onClick={() => ref.current?.close()} className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-semibold">{t[5]}</button><button disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-[var(--kram-orange)] px-4 py-2.5 text-sm font-bold text-white">{pending&&<Loader2 size={15} className="animate-spin"/>}{pending?t[7]:t[6]}</button></div>
      </form>
    </dialog>
  </>;
}
