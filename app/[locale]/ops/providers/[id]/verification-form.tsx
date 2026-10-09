"use client";
import {useActionState,useEffect} from "react";
import {useRouter} from "next/navigation";
import {Loader2,ShieldCheck} from "lucide-react";
import {updateProviderVerification,type ProviderActionState} from "../actions";
import type {Locale} from "@/lib/i18n";
const labels={fr:{pending:"En attente",active:"Actif",inactive:"Inactif",save:"Enregistrer",saving:"Enregistrement..."},en:{pending:"Pending",active:"Active",inactive:"Inactive",save:"Save",saving:"Saving..."},pt:{pending:"Pendente",active:"Ativo",inactive:"Inativo",save:"Guardar",saving:"A guardar..."}} as const;
export function ProviderVerificationForm({providerId,status,locale}:{providerId:string;status:string;locale:Locale}){
 const[state,action,pending]=useActionState<ProviderActionState,FormData>(updateProviderVerification,{success:false,message:""});const router=useRouter();const t=labels[locale];
 useEffect(()=>{if(state.success)router.refresh();},[state,router]);
 return <form action={action} className="flex flex-col items-end gap-2"><input type="hidden" name="providerId" value={providerId}/><div className="flex items-center gap-2"><ShieldCheck size={15} className={status==="active"?"text-emerald-600":"text-zinc-400"}/><select key={status} name="verificationStatus" defaultValue={status} disabled={pending} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold"><option value="pending">{t.pending}</option><option value="active">{t.active}</option><option value="inactive">{t.inactive}</option></select><button disabled={pending} className="rounded-xl bg-[var(--kram-charcoal)] px-3 py-2 text-xs font-bold text-white">{pending?<Loader2 size={13} className="animate-spin"/>:t.save}</button></div>{state.message&&<p className={`text-[11px] ${state.success?"text-emerald-700":"text-red-600"}`}>{state.message}</p>}</form>;
}
