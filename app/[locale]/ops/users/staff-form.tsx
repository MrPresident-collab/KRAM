"use client";

import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

const copy = {
  fr:{create:"Ajouter un membre",name:"Nom complet",email:"E-mail professionnel",function:"Fonction",role:"Rôle KRAM",scope:"Portée",country:"Pays",branch:"Agence",save:"Envoyer l’invitation",saving:"Création...",cancel:"Annuler",global:"Global",countryScope:"Pays",branchScope:"Agence",select:"Sélectionner",success:"Invitation envoyée. Le membre recevra un e-mail d’activation.",error:"Impossible de créer ce compte."},
  en:{create:"Add staff member",name:"Full name",email:"Work email",function:"Function",role:"KRAM role",scope:"Scope",country:"Country",branch:"Branch",save:"Send invitation",saving:"Creating...",cancel:"Cancel",global:"Global",countryScope:"Country",branchScope:"Branch",select:"Select",success:"Invitation sent successfully. The staff member will receive an activation email.",error:"Unable to create this account."},
  pt:{create:"Adicionar membro",name:"Nome completo",email:"E-mail profissional",function:"Função",role:"Função KRAM",scope:"Âmbito",country:"País",branch:"Filial",save:"Enviar convite",saving:"A criar...",cancel:"Cancelar",global:"Global",countryScope:"País",branchScope:"Filial",select:"Selecionar",success:"Convite enviado. O membro receberá um e-mail de ativação.",error:"Não foi possível criar esta conta."}
} as const;

const roles = [
  ["admin","Administrator"],["regional_admin","Regional Admin"],["operations","Operations"],["finance","Finance"],["support","Support"],["viewer","Viewer"]
] as const;

export function StaffForm({ locale }: { locale: Locale }) {
  const t=copy[locale];
  const [open,setOpen]=useState(false); const [pending,setPending]=useState(false); const [error,setError]=useState(""); const [success,setSuccess]=useState("");
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [jobTitle,setJobTitle]=useState(""); const [role,setRole]=useState("operations"); const [scope,setScope]=useState("branch"); const [countryId,setCountryId]=useState(""); const [branchId,setBranchId]=useState("");
  const [countries,setCountries]=useState<{id:string;name:string;code:string}[]>([]);
  const [branches,setBranches]=useState<{id:string;name:string;city:string}[]>([]);
  const supabase=createClient();

  async function loadLocations() {
    const [{data:c},{data:b}] = await Promise.all([
      supabase.from("countries").select("id,name,code").order("name"),
      supabase.from("branches").select("id,name,city").order("name")
    ]);
    setCountries(c??[]); setBranches(b??[]);
  }
  function openForm(){setError("");setSuccess("");setOpen(true);setCountryId("");setBranchId("");void loadLocations();}
  async function submit(e:React.FormEvent){
    e.preventDefault(); setPending(true); setError(""); setSuccess("");
    try {
      const res=await fetch("/api/ops/staff",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fullName:name,email,jobTitle,role,scopeLevel:scope,countryId:scope==="country"?countryId:null,branchId:scope==="branch"?branchId:null})});
      const body=await res.json().catch(()=>({error:"The server returned an unexpected response (HTTP "+res.status+"). Check the development terminal for the underlying error."}));
      if(!res.ok){setError(body.error??t.error);setPending(false);return;}
      setSuccess(t.success);setPending(false);setName("");setEmail("");setJobTitle("");setRole("operations");setScope("branch");setCountryId("");setBranchId("");
    } catch (cause) {
      console.error("KRAM staff provisioning request failed", cause);
      setError("The staff request could not reach the server. Check your connection and the development terminal, then try again.");
      setPending(false);
    }
  }
  return <><button type="button" onClick={openForm} className="inline-flex items-center gap-2 rounded-xl bg-[var(--kram-orange)] px-4 py-2.5 text-sm font-bold text-white"><Plus size={16}/>{t.create}</button>
  {open&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"><div className="w-full max-w-xl rounded-2xl border border-[var(--kram-border)] bg-white shadow-2xl">
    <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">KRAM</p><h2 className="mt-1 text-lg font-bold">{t.create}</h2></div><button onClick={()=>setOpen(false)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100"><X size={18}/></button></div>
    <form onSubmit={submit} className="grid gap-4 p-6 sm:grid-cols-2">
      <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold">{t.name}</span><input value={name} onChange={e=>setName(e.target.value)} required className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm"/></label>
      <label><span className="mb-1.5 block text-xs font-semibold">{t.email}</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm"/></label>
      <label><span className="mb-1.5 block text-xs font-semibold">{t.function}</span><input value={jobTitle} onChange={e=>setJobTitle(e.target.value)} required placeholder="e.g. Finance Officer" className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm"/></label>
      <label><span className="mb-1.5 block text-xs font-semibold">{t.role}</span><select value={role} onChange={e=>setRole(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm">{roles.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
      <label><span className="mb-1.5 block text-xs font-semibold">{t.scope}</span><select value={scope} onChange={e=>setScope(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm"><option value="global">{t.global}</option><option value="country">{t.countryScope}</option><option value="branch">{t.branchScope}</option></select></label>
      {scope==="country"&&<label><span className="mb-1.5 block text-xs font-semibold">{t.country}</span><select id="staff-country" value={countryId} onChange={e=>setCountryId(e.target.value)} required className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm"><option value="">{t.select}</option>{countries.map(c=><option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}</select></label>}
      {scope==="branch"&&<label><span className="mb-1.5 block text-xs font-semibold">{t.branch}</span><select id="staff-branch" value={branchId} onChange={e=>setBranchId(e.target.value)} required className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm"><option value="">{t.select}</option>{branches.map(b=><option key={b.id} value={b.id}>{b.name} — {b.city}</option>)}</select></label>}
      {error&&<p className="sm:col-span-2 rounded-xl bg-red-50 px-3 py-3 text-xs font-medium text-red-700">{error}</p>}
      {success&&<p className="sm:col-span-2 rounded-xl bg-orange-50 px-3 py-3 text-xs font-medium text-[var(--kram-orange)]">{success}</p>}
      <div className="sm:col-span-2 flex justify-end gap-2 border-t border-zinc-100 pt-5"><button type="button" onClick={()=>setOpen(false)} className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold">{t.cancel}</button><button disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-[var(--kram-charcoal)] px-4 py-2.5 text-sm font-bold text-white">{pending&&<Loader2 size={15} className="animate-spin"/>}{pending?t.saving:t.save}</button></div>
    </form>
  </div></div>}
  </>;
}
