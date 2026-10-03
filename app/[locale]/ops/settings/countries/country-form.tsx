"use client";

import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2, Loader2, Plus, X } from "lucide-react";
import { createCountry, type CountryActionState } from "./actions";

const initialState: CountryActionState = { success: false, message: "" };

const labels = {
  fr: {
    create: "Ajouter un pays", name: "Nom du pays", code: "Code pays",
    namePlaceholder: "République démocratique du Congo", codePlaceholder: "CD",
    cancel: "Annuler", save: "Créer le pays", saving: "Création...",
    hint: "Utilisez le code ISO 3166-1 alpha-2 du pays.", success: "Pays créé avec succès."
  },
  en: {
    create: "Add country", name: "Country name", code: "Country code",
    namePlaceholder: "Democratic Republic of the Congo", codePlaceholder: "CD",
    cancel: "Cancel", save: "Create country", saving: "Creating...",
    hint: "Use the country's ISO 3166-1 alpha-2 code.", success: "Country created successfully."
  },
  pt: {
    create: "Adicionar país", name: "Nome do país", code: "Código do país",
    namePlaceholder: "República Democrática do Congo", codePlaceholder: "CD",
    cancel: "Cancelar", save: "Criar país", saving: "A criar...",
    hint: "Use o código ISO 3166-1 alpha-2 do país.", success: "País criado com sucesso."
  },
} as const;

export function CountryForm({ locale }: { locale: "fr" | "en" | "pt" }) {
  const t = labels[locale];
  const [state, action, pending] = useActionState(createCountry, initialState);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (state.success) {
      dialogRef.current?.close();
    }
  }, [state.success]);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex items-center gap-2 rounded-xl bg-[var(--kram-orange)] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-95"
      >
        <Plus size={16} /> {t.create}
      </button>

      <dialog
        ref={dialogRef}
        className="w-[min(92vw,480px)] rounded-2xl border border-[var(--kram-border)] bg-white p-0 shadow-2xl backdrop:bg-black/30"
      >
        <div className="border-b border-[var(--kram-border)] px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">KRAM</p>
              <h2 className="mt-1 text-lg font-bold text-zinc-950">{t.create}</h2>
            </div>
            <button type="button" onClick={() => dialogRef.current?.close()} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900">
              <X size={18} />
            </button>
          </div>
        </div>

        <form action={action} className="space-y-5 p-6">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-zinc-700">{t.name}</span>
            <input name="name" required maxLength={100} placeholder={t.namePlaceholder} className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm outline-none focus:border-[var(--kram-orange)] focus:ring-2 focus:ring-orange-100" />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-zinc-700">{t.code}</span>
            <input name="code" required maxLength={2} minLength={2} placeholder={t.codePlaceholder} className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm uppercase outline-none focus:border-[var(--kram-orange)] focus:ring-2 focus:ring-orange-100" />
            <span className="mt-1.5 block text-[11px] text-zinc-400">{t.hint}</span>
          </label>

          {state.message && !state.success && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-medium text-red-700">{state.message}</p>
          )}

          {state.success && (
            <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-xs font-medium text-emerald-700">
              <CheckCircle2 size={15} /> {t.success}
            </p>
          )}

          <div className="flex justify-end gap-2 border-t border-zinc-100 pt-5">
            <button type="button" onClick={() => dialogRef.current?.close()} className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">
              {t.cancel}
            </button>
            <button disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-[var(--kram-charcoal)] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
              {pending && <Loader2 size={15} className="animate-spin" />}
              {pending ? t.saving : t.save}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
