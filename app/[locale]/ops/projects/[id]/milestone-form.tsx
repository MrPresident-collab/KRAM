"use client";
import{useActionState}from"react";import{Loader2,Plus,Save}from"lucide-react";import type{Locale}from"@/lib/i18n";import{createProjectMilestone,updateProjectMilestone,type ProjectActionState}from"../actions";import{opsLabels}from"@/lib/ops-labels";

const labels={
 fr:{name:"Nom du jalon",due:"Date cible",status:"État",progress:"Progression",notes:"Notes",add:"Ajouter le jalon",save:"Enregistrer",saving:"Enregistrement..."}, 
 en:{name:"Milestone name",due:"Due date",status:"Status",progress:"Progress",notes:"Notes",add:"Add milestone",save:"Save",saving:"Saving..."},
 pt:{name:"Nome do marco",due:"Data prevista",status:"Estado",progress:"Progresso",notes:"Notas",add:"Adicionar marco",save:"Guardar",saving:"A guardar..."}
} as const;


export function MilestoneCreateForm({locale,projectId}:{locale:Locale;projectId:string}){
 const[state,action,pending]=useActionState<ProjectActionState,FormData>(createProjectMilestone,{success:false,message:""});const t=labels[locale];const statuses=opsLabels(locale).milestoneStatuses;
 return <form action={action} className="space-y-4 rounded-2xl border border-zinc-100 bg-zinc-50/60 p-4">
  <input type="hidden" name="locale" value={locale}/><input type="hidden" name="projectId" value={projectId}/>
  <label className="block"><span className="mb-1.5 block text-xs font-semibold">{t.name}</span><input name="name" required className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm"/></label>
  <div className="grid gap-3 sm:grid-cols-3">
   <label><span className="mb-1.5 block text-xs font-semibold">{t.due}</span><input name="dueDate" type="date" className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm"/></label>
   <label><span className="mb-1.5 block text-xs font-semibold">{t.status}</span><select name="status" defaultValue="pending" className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm">{Object.entries(statuses).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
   <label><span className="mb-1.5 block text-xs font-semibold">{t.progress}</span><input name="progress" type="number" min="0" max="100" defaultValue="0" className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm"/></label>
  </div>
  <label className="block"><span className="mb-1.5 block text-xs font-semibold">{t.notes}</span><textarea name="notes" rows={2} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm"/></label>
  {state.message&&<p className={`text-xs ${state.success?"text-emerald-700":"text-red-600"}`}>{state.message}</p>}
  <button disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-[var(--kram-charcoal)] px-4 py-2.5 text-xs font-bold text-white">{pending?<Loader2 size={13} className="animate-spin"/>:<Plus size={13}/>} {pending?t.saving:t.add}</button>
 </form>
}

export function MilestoneEditor({locale,projectId,milestone}:{locale:Locale;projectId:string;milestone:{id:string;status:string;progress_percent:number;notes:string|null}}){
 const[state,action,pending]=useActionState<ProjectActionState,FormData>(updateProjectMilestone,{success:false,message:""});const t=labels[locale];const statuses=opsLabels(locale).milestoneStatuses;
 return <form action={action} className="border-t border-zinc-100 px-5 py-4">
  <input type="hidden" name="locale" value={locale}/><input type="hidden" name="projectId" value={projectId}/><input type="hidden" name="milestoneId" value={milestone.id}/>
  <div className="grid gap-3 sm:grid-cols-[1fr_140px_140px_auto] sm:items-end">
   <label><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400">{t.status}</span><select name="status" defaultValue={milestone.status} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs">{Object.entries(statuses).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
   <label><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400">{t.progress}</span><input name="progress" type="number" min="0" max="100" defaultValue={milestone.progress_percent} className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs"/></label>
   <label><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400">{t.notes}</span><input name="notes" defaultValue={milestone.notes??""} className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs"/></label>
   <button disabled={pending} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-700">{pending?<Loader2 size={13} className="animate-spin"/>:<Save size={13}/>} {pending?t.saving:t.save}</button>
  </div>
  {state.message&&<p className={`mt-2 text-[11px] ${state.success?"text-emerald-700":"text-red-600"}`}>{state.message}</p>}
 </form>
}