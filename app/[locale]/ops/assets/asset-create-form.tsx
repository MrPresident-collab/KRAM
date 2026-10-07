"use client";

import { useActionState, useMemo, useState } from "react";
import { Loader2, Save, MapPin, UserRound, Building2, Globe2 } from "lucide-react";
import { createAssetRecord } from "./actions";
import type { Locale } from "@/lib/i18n";

type Country = { id: string; name: string; code: string };
type Branch = { id: string; country_id: string; name: string; city: string | null };

const labels = {
  fr: { name:"Nom de l’actif", reference:"Généré automatiquement", type:"Type d’actif", country:"Pays", city:"Ville", branch:"Agence", address:"Adresse", description:"Description", client:"Client", select:"Sélectionner", noCountries:"Aucun pays configuré", noBranches:"Aucune agence dans ce pays", save:"Créer l’actif", saving:"Création..." },
  en: { name:"Asset name", reference:"Generated automatically", type:"Asset type", country:"Country", city:"City", branch:"Branch", address:"Address", description:"Description", client:"Client", select:"Select", noCountries:"No countries configured", noBranches:"No branches in this country", save:"Create asset", saving:"Creating..." },
  pt: { name:"Nome do ativo", reference:"Gerado automaticamente", type:"Tipo de ativo", country:"País", city:"Cidade", branch:"Filial", address:"Morada", description:"Descrição", client:"Cliente", select:"Selecionar", noCountries:"Nenhum país configurado", noBranches:"Nenhuma filial neste país", save:"Criar ativo", saving:"A criar..." }
} as const;

const types = [
  ["residential","Residential"],["commercial","Commercial"],["construction","Construction"],["retail","Retail"],
  ["warehouse","Warehouse"],["land","Land"],["hospitality","Hospitality"],["other","Other"]
] as const;

export function AssetCreateForm({ locale, clients, countries, branches }: { locale: Locale; clients: { id:string; full_name:string }[]; countries: Country[]; branches: Branch[] }) {
  const t = labels[locale];
  const [state, action, pending] = useActionState(createAssetRecord, { success:false, message:"" });
  const [countryId, setCountryId] = useState("");
  const availableBranches = useMemo(() => branches.filter((branch) => branch.country_id === countryId), [branches, countryId]);

  return (
    <form action={action} className="overflow-hidden rounded-2xl border border-[var(--kram-border)] bg-white">
      <div className="border-b border-[var(--kram-border)] bg-[var(--kram-bg)]/55 px-6 py-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[var(--kram-orange)]"><Building2 size={14}/> KRAM asset record</div>
        <p className="mt-1 text-xs text-[var(--kram-metal)]">{t.reference}: KRAM will assign the internal reference from the selected country.</p>
      </div>

      <div className="space-y-7 p-6 md:p-7">
        <section>
          <div className="mb-4 flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--kram-orange-soft)] text-[var(--kram-orange)] text-xs font-black">01</span><h2 className="text-sm font-black text-[var(--kram-deep)]">Identity</h2></div>
          <div className="grid gap-5 md:grid-cols-2">
            <label><span className="mb-1.5 block text-xs font-bold">{t.name}</span><input name="name" required placeholder={locale==="fr"?"Résidence Ngaliema":locale==="pt"?"Residência Ngaliema":"Ngaliema Residence"} className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[var(--kram-orange)] focus:ring-2 focus:ring-[var(--kram-orange-soft)]"/></label>
            <div className="rounded-xl border border-dashed border-[var(--kram-border)] bg-[var(--kram-bg)] px-4 py-3"><span className="block text-[10px] font-bold uppercase tracking-[.13em] text-[var(--kram-metal)]">{t.reference}</span><span className="mt-1 block text-sm font-semibold text-[var(--kram-metal)]">Assigned after creation</span></div>
            <label><span className="mb-1.5 block text-xs font-bold">{t.type}</span><select name="type" defaultValue="residential" className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-[var(--kram-orange)]">{types.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
            <label><span className="mb-1.5 block text-xs font-bold">{t.client}</span><div className="relative"><UserRound size={15} className="absolute left-3 top-3.5 text-zinc-400"/><select name="clientId" defaultValue="" className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-9 pr-3.5 text-sm outline-none focus:border-[var(--kram-orange)]"><option value="">{t.select}</option>{clients.map(c=><option key={c.id} value={c.id}>{c.full_name}</option>)}</select></div></label>
          </div>
        </section>

        <section className="border-t border-zinc-100 pt-7">
          <div className="mb-4 flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--kram-bg)] text-[var(--kram-metal)] text-xs font-black">02</span><h2 className="text-sm font-black text-[var(--kram-deep)]">Location</h2></div>
          <div className="grid gap-5 md:grid-cols-3">
            <label><span className="mb-1.5 block text-xs font-bold">{t.country}</span><div className="relative"><Globe2 size={15} className="absolute left-3 top-3.5 text-zinc-400"/><select name="countryId" value={countryId} onChange={(event) => setCountryId(event.target.value)} required className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-9 pr-3.5 text-sm outline-none focus:border-[var(--kram-orange)]"><option value="">{countries.length ? t.select : t.noCountries}</option>{countries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}</select></div></label>
            <label><span className="mb-1.5 block text-xs font-bold">{t.city}</span><input name="city" required className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-[var(--kram-orange)]"/></label>
            <label><span className="mb-1.5 block text-xs font-bold">{t.branch}</span><select name="branchId" disabled={!countryId} defaultValue="" className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-[var(--kram-orange)]"><option value="">{countryId ? (availableBranches.length ? t.select : t.noBranches) : t.select}</option>{availableBranches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}{branch.city ? ` — ${branch.city}` : ""}</option>)}</select></label>
            <label className="md:col-span-3"><span className="mb-1.5 block text-xs font-bold">{t.address}</span><div className="relative"><MapPin size={15} className="absolute left-3 top-3.5 text-zinc-400"/><input name="address" className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-9 pr-3.5 text-sm outline-none focus:border-[var(--kram-orange)]"/></div></label>
          </div>
        </section>

        <section className="border-t border-zinc-100 pt-7">
          <div className="mb-4 flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--kram-bg)] text-[var(--kram-metal)] text-xs font-black">03</span><h2 className="text-sm font-black text-[var(--kram-deep)]">Notes</h2></div>
          <textarea name="description" rows={4} placeholder="Anything the KRAM operations team should know about this asset." className="w-full resize-y rounded-xl border border-zinc-200 px-3.5 py-3 text-sm outline-none focus:border-[var(--kram-orange)] focus:ring-2 focus:ring-[var(--kram-orange-soft)]"/>
        </section>

        {state.message && <p className={`rounded-xl px-3.5 py-3 text-xs font-semibold ${state.success ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{state.message}</p>}
        <div className="flex items-center justify-between gap-5 border-t border-zinc-100 pt-5">
          <p className="text-[11px] text-[var(--kram-metal)]">KRAM controls the reference and country code automatically.</p>
          <button disabled={pending || !countries.length} className="inline-flex items-center gap-2 rounded-xl bg-[var(--kram-deep)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--kram-charcoal)] disabled:opacity-60">{pending?<Loader2 size={15} className="animate-spin"/>:<Save size={15}/>} {pending?t.saving:t.save}</button>
        </div>
      </div>
    </form>
  );
}
