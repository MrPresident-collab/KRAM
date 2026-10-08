"use client";
import { useActionState } from "react";
import { RotateCcw, Loader2 } from "lucide-react";
import { restoreBinItem, type BinActionState } from "./bin-actions-server";
export function RestoreBinItem({id,type}:{id:string;type:string}) {
 const [state,action,pending]=useActionState<BinActionState,FormData>(restoreBinItem,{success:false,message:""});
 return <form action={action}><input type="hidden" name="id" value={id}/><input type="hidden" name="type" value={type}/><button disabled={pending} aria-label="Restore record" title="Restore record" className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{pending?<Loader2 size={14} className="animate-spin"/>:<RotateCcw size={14}/>}Restore</button>{state.message&&<p className={state.success?"mt-1 text-[10px] text-emerald-700":"mt-1 text-[10px] text-red-600"}>{state.message}</p>}</form>;
}