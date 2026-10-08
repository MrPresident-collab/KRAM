"use client";
import { useActionState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { updateProviderVerification, type ProviderActionState } from "../actions";

export function ProviderVerificationForm({providerId,status}:{providerId:string;status:string}) {
 const [state,action,pending]=useActionState<ProviderActionState,FormData>(updateProviderVerification,{success:false,message:""});
 return <form action={action} className="flex flex-col items-end gap-2">
  <input type="hidden" name="providerId" value={providerId}/>
  <div className="flex items-center gap-2">
   <ShieldCheck size={15} className={status==="active"?"text-emerald-600":"text-zinc-400"}/>
   <select name="verificationStatus" defaultValue={status} disabled={pending} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold">
    <option value="pending">Pending</option><option value="active">Active</option><option value="inactive">Inactive</option>
   </select>
   <button disabled={pending} className="rounded-xl bg-[var(--kram-charcoal)] px-3 py-2 text-xs font-bold text-white">{pending?<Loader2 size={13} className="animate-spin"/>:"Save"}</button>
  </div>
  {state.message&&<p className={`text-[11px] ${state.success?"text-emerald-700":"text-red-600"}`}>{state.message}</p>}
 </form>;
}