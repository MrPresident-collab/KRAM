"use client";
import { useActionState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { createExpense, type ExpenseActionState } from "../actions"; import type {Locale} from "@/lib/i18n";

export function ExpenseCreateForm({assets,workOrders,projects,providers,defaultCurrency,locale}:{assets:{id:string;name:string;reference_code:string}[];workOrders:{id:string;title:string}[];projects:{id:string;name:string}[];providers:{id:string;name:string}[];defaultCurrency:string;locale:Locale}){
 const[state,action,pending]=useActionState<ExpenseActionState,FormData>(createExpense,{success:false,message:""}); const router=useRouter(); useEffect(()=>{if(state.success) router.push(`/${locale}/ops/expenses`);},[state.success,locale,router]);
 return <form action={action} className="space-y-5 rounded-2xl border border-[var(--kram-border)] bg-white p-6">
  <div className="grid gap-5 md:grid-cols-2">
   <Field label="Description" name="description" required placeholder="Plumbing materials"/>
   <Select label="Category" name="category" options={[{value:"maintenance",label:"Maintenance"},{value:"materials",label:"Materials"},{value:"utilities",label:"Utilities"},{value:"transport",label:"Transport"},{value:"labour",label:"Labour"},{value:"cleaning",label:"Cleaning"},{value:"security",label:"Security"},{value:"professional_services",label:"Professional services"},{value:"insurance",label:"Insurance"},{value:"taxes_fees",label:"Taxes & fees"},{value:"office_admin",label:"Office & administration"},{value:"other",label:"Other"}]}/>
   <Field label="Amount" name="amount" required type="number" step="0.01" min="0"/>
   <div className="rounded-xl border border-[var(--kram-border)] bg-[var(--kram-bg)] px-3.5 py-3"><p className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--kram-metal)]">Organization currency</p><p className="mt-1 text-sm font-bold text-[var(--kram-deep)]">{defaultCurrency}</p><p className="mt-1 text-[11px] text-[var(--kram-metal)]">All new expenses are recorded in the organization default currency.</p><input type="hidden" name="currency" value={defaultCurrency}/></div>
   <Field label="Paid to" name="paidTo" placeholder="Supplier or technician"/><Select label="Payment method" name="paymentMethod" options={["cash","bank_transfer","card","mobile_money","other"].map(x=>({value:x,label:x.replace("_"," ")}))}/>
   <Field label="Expense date" name="expenseDate" required type="date" defaultValue={new Date().toISOString().slice(0,10)}/>
   <Select label="Asset" name="assetId" options={assets.map(x=>({value:x.id,label:x.name+" · "+x.reference_code}))}/>
   <Select label="Work order" name="workOrderId" options={workOrders.map(x=>({value:x.id,label:x.title}))}/><Select label="Project" name="projectId" options={projects.map(x=>({value:x.id,label:x.name}))}/>
   <Select label="Provider" name="providerId" options={providers.map(x=>({value:x.id,label:x.name}))}/>
  </div>
  <label><span className="mb-1.5 block text-xs font-semibold">Notes</span><textarea name="notes" rows={4} className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm"/></label>
  {state.message&&<p className={`rounded-xl px-3 py-2 text-xs font-medium ${state.success?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-700"}`}>{state.message}</p>}
  <div className="flex justify-end border-t border-zinc-100 pt-5"><button disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-[var(--kram-charcoal)] px-5 py-3 text-sm font-bold text-white">{pending?<Loader2 size={15} className="animate-spin"/>:<Save size={15}/>} {pending?"Saving...":"Record expense"}</button></div>
 </form>;
}
function Field({label,name,required,type="text",placeholder,defaultValue,step,min}:{label:string;name:string;required?:boolean;type?:string;placeholder?:string;defaultValue?:string;step?:string;min?:string}){return <label><span className="mb-1.5 block text-xs font-semibold">{label}</span><input name={name} required={required} type={type} step={step} min={min} placeholder={placeholder} defaultValue={defaultValue} className="w-full rounded-xl border border-zinc-200 px-3.5 py-3 text-sm"/></label>}
function Select({label,name,options}:{label:string;name:string;options:{value:string;label:string}[]}){return <label><span className="mb-1.5 block text-xs font-semibold">{label}</span><select name={name} defaultValue="" className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm"><option value="">None</option>{options.map(x=><option key={x.value} value={x.value}>{x.label}</option>)}</select></label>}
