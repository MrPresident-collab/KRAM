"use client";
import {useState,useEffect} from "react";
import {useRouter} from "next/navigation";
import type {Locale} from "@/lib/i18n";
import{useActionState}from"react";import{Loader2,Save,Upload}from"lucide-react";import{createReport,type ReportActionState}from"../actions";
type Option={id:string;name?:string;reference_code?:string;inspection_type?:string;title?:string};
export function ReportCreateForm({assets,inspections,projects,workOrders,locale}:{assets:Option[];inspections:Option[];projects:Option[];workOrders:Option[];locale:Locale}){
 const [sourceType,setSourceType]=useState("none");
 const[state,action,pending]=useActionState<ReportActionState,FormData>(createReport,{success:false,message:""});
 const router=useRouter();
 useEffect(()=>{if(state.success)router.push("/"+locale+"/ops/reports");},[state.success,locale,router]);
 return <form action={action} className="space-y-5 rounded-2xl border border-[var(--kram-border)] bg-white p-6">
 <div className="grid gap-5 md:grid-cols-2">
 <Field label="Report title" name="title" required placeholder="Property inspection report"/>
 <label><span className="mb-1.5 block text-xs font-semibold">Report type</span><select name="reportType" defaultValue="operational" className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm"><option value="inspection">Inspection</option><option value="project">Project</option><option value="work_order">Work Order</option><option value="asset">Asset</option><option value="operational">Operational</option><option value="other">Other</option></select></label>
 <label><span className="mb-1.5 block text-xs font-semibold">Source type</span><select name="sourceType" value={sourceType} onChange={e=>setSourceType(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm"><option value="none">No source record</option><option value="asset">Asset</option><option value="inspection">Inspection</option><option value="project">Project</option><option value="work_order">Work Order</option></select></label>
 <label><span className="mb-1.5 block text-xs font-semibold">Source record</span><select name="sourceId" defaultValue="" required={sourceType!=="none"} disabled={sourceType==="none"} className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm"><option value="">{sourceType==="none"?"No source required":"Select a record"}</option>{sourceType==="asset"&&assets.map(x=><option key={x.id} value={x.id}>{x.name} · {x.reference_code}</option>)}{sourceType==="inspection"&&inspections.map(x=><option key={x.id} value={x.id}>{x.inspection_type} · {x.id.slice(0,8)}</option>)}{sourceType==="project"&&projects.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}{sourceType==="work_order"&&workOrders.map(x=><option key={x.id} value={x.id}>{x.title}</option>)}</select></label>
 </div>
 <label><span className="mb-1.5 block text-xs font-semibold">Summary</span><textarea name="summary" rows={5} placeholder="Key findings, observations and recommendations..." className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm"/></label>
 <label className="block rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/60 p-5"><span className="flex items-center gap-2 text-sm font-bold"><Upload size={16}/> Attach report document</span><span className="mt-1 block text-xs text-zinc-500">PDF, JPG, PNG, WEBP or MP4 · maximum 20 MB</span><input name="file" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.mp4" className="mt-4 block w-full text-sm"/></label>
 {state.message&&<p className={`rounded-xl px-3 py-2 text-xs font-medium ${state.success?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-700"}`}>{state.message}</p>}
 <div className="flex justify-end border-t border-zinc-100 pt-5"><button disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-[var(--kram-charcoal)] px-5 py-3 text-sm font-bold text-white">{pending?<Loader2 size={15} className="animate-spin"/>:<Save size={15}/>} {pending?"Saving...":"Create report"}</button></div>
 </form>;
}
function Field({label,name,required,placeholder}:{label:string;name:string;required?:boolean;placeholder?:string}){return <label><span className="mb-1.5 block text-xs font-semibold">{label}</span><input name={name} required={required} placeholder={placeholder} className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm"/></label>}
