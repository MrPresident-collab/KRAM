"use server";

import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { FileCheck2, History, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isLocale } from "@/lib/i18n";

const labels = {
 en: { title:"Client financial reports", intro:"Prepare, review and publish service-delivery financial reports with a traceable audit history.", back:"Operations", draft:"Draft reports", published:"Published reports", prepare:"Record preparation", preparation:"Preparation outcome and notes", submit:"Submit for review", approve:"Approve review", reject:"Reject review", review:"Review outcome and notes", publish:"Publish to verified client", history:"Audit history", noReports:"No reports are available in your authorized scope.", noHistory:"No audit events recorded yet.", status:"Status", report:"Report", asset:"Asset", client:"Client", amount:"Reported spend", actionError:"The requested action could not be completed. Check the required workflow stage and permissions.", stages:{draft:"Draft",published:"Published",withdrawn:"Withdrawn"} },
 fr: { title:"Rapports financiers clients", intro:"Préparez, révisez et publiez les rapports financiers des prestations avec un historique vérifiable.", back:"Opérations", draft:"Rapports en brouillon", published:"Rapports publiés", prepare:"Enregistrer la préparation", preparation:"Résultat et notes de préparation", submit:"Soumettre à la révision", approve:"Approuver la révision", reject:"Rejeter la révision", review:"Résultat et notes de révision", publish:"Publier au client vérifié", history:"Historique d’audit", noReports:"Aucun rapport dans votre périmètre autorisé.", noHistory:"Aucun événement d’audit enregistré.", status:"Statut", report:"Rapport", asset:"Bien", client:"Client", amount:"Dépenses déclarées", actionError:"Action impossible. Vérifiez l’étape du workflow et vos autorisations.", stages:{draft:"Brouillon",published:"Publié",withdrawn:"Retiré"} },
 pt: { title:"Relatórios financeiros dos clientes", intro:"Prepare, reveja e publique relatórios financeiros dos serviços com histórico de auditoria rastreável.", back:"Operações", draft:"Relatórios em rascunho", published:"Relatórios publicados", prepare:"Registar preparação", preparation:"Resultado e notas da preparação", submit:"Enviar para revisão", approve:"Aprovar revisão", reject:"Rejeitar revisão", review:"Resultado e notas da revisão", publish:"Publicar para cliente verificado", history:"Histórico de auditoria", noReports:"Não existem relatórios no seu âmbito autorizado.", noHistory:"Ainda não existem eventos de auditoria.", status:"Estado", report:"Relatório", asset:"Ativo", client:"Cliente", amount:"Despesas reportadas", actionError:"Não foi possível concluir a ação. Verifique a etapa do fluxo e as permissões.", stages:{draft:"Rascunho",published:"Publicado",withdrawn:"Retirado"} }
} as const;

export default async function FinancialReportsOpsPage({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<{error?:string}>}) {
 const {locale:raw}=await params; const query=await searchParams;
 if(!isLocale(raw)) redirect("/fr/ops");
 const locale=raw as keyof typeof labels; const t=labels[locale];
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user) redirect("/"+locale+"/login");
 const {data:reports}=await supabase.from("client_financial_reports").select("id,report_number,title,currency,budget_amount,total_spent,additional_funding_amount,status,prepared_by,prepared_at,preparation_outcome,reviewed_by,reviewed_at,review_outcome,published_by,published_at,recipient_name_snapshot,recipient_email_snapshot,assets(name,reference_code),clients(full_name,email)").order("updated_at",{ascending:false}).limit(100);
 const rows=reports??[];
 const ids=rows.map(r=>r.id);
 const actorIds=[...new Set(rows.flatMap((r:any)=>[r.prepared_by,r.reviewed_by,r.published_by]).filter(Boolean))];
 const {data:staffProfiles}=actorIds.length?await supabase.from("profiles").select("id,full_name,job_title,work_email").in("id",actorIds):{data:[]};
 const staffById=new Map((staffProfiles??[]).map((p:any)=>[p.id,[p.full_name,p.job_title].filter(Boolean).join(" · ")||p.work_email||p.id]));
 const staffLabel=(id:string|null)=>id?(staffById.get(id)??id):"—";
 const {data:audit}=ids.length?await supabase.from("client_financial_report_audit").select("id,report_id,actor_id,event_type,outcome,event_at,recipient_name_snapshot,recipient_email_snapshot").in("report_id",ids).order("event_at",{ascending:false}):{data:[]};
 async function transition(formData:FormData) {
  "use server";
  const routeLocale=raw;
  const reportId=String(formData.get("report_id")??"");
  const action=String(formData.get("action")??"");
  const outcome=String(formData.get("outcome")??"").trim();
  const db=await createClient();
  const {data:{user:actor}}=await db.auth.getUser();
  if(!actor) redirect("/"+routeLocale+"/login");
  const {error}=await db.rpc("transition_client_financial_report",{p_report_id:reportId,p_action:action,p_outcome:outcome||null,p_details:{source:"ops_financial_reports_page"}});
  revalidatePath("/"+routeLocale+"/ops/financial-reports");
  if(error) redirect("/"+routeLocale+"/ops/financial-reports?error=1");
  redirect("/"+routeLocale+"/ops/financial-reports");
 }
 const date=(v:string|null)=>v?new Intl.DateTimeFormat(locale,{dateStyle:"medium",timeStyle:"short"}).format(new Date(v)):"—";
 const money=(n:number,c:string)=>{try{return new Intl.NumberFormat(locale,{style:"currency",currency:c.trim()}).format(n)}catch{return n.toLocaleString(locale)+" "+c.trim()}};
 const eventLabels:Record<string,string>={prepared:"Prepared",submitted_for_review:"Submitted for review",review_approved:"Review approved",review_rejected:"Review rejected",published:"Published",publication_withdrawn:"Publication withdrawn",recipient_verified:"Recipient verified"};
 return <div className="space-y-7">
  <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">FINANCE / GOVERNANCE</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-zinc-950">{t.title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">{t.intro}</p></div><Link href={"/"+locale+"/ops"} className="text-sm font-semibold text-zinc-600">← {t.back}</Link></section>
  {query.error==="1"&&<p role="alert" className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-900">{t.actionError}</p>}
  {!rows.length?<section className="rounded-2xl border border-[var(--kram-border)] bg-white p-8 text-sm text-zinc-500">{t.noReports}</section>:<div className="space-y-5">{rows.map((r:any)=>{
   const asset=Array.isArray(r.assets)?r.assets[0]:r.assets; const client=Array.isArray(r.clients)?r.clients[0]:r.clients; const events=(audit??[]).filter((e:any)=>e.report_id===r.id);
   return <article key={r.id} className="overflow-hidden rounded-2xl border border-[var(--kram-border)] bg-white">
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 p-5"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--kram-orange)]">{r.report_number} · {r.status}</p><h2 className="mt-2 text-lg font-bold text-zinc-950">{r.title}</h2><p className="mt-1 text-sm text-zinc-500">{t.asset}: {asset?.name??"—"} {asset?.reference_code?"· "+asset.reference_code:""} · {t.client}: {client?.full_name??"—"}</p></div><p className="text-lg font-bold text-zinc-950">{money(Number(r.total_spent),r.currency)}</p></div>
    <div className="grid gap-4 p-5 md:grid-cols-3"><div className="rounded-xl bg-zinc-50 p-4"><p className="text-xs font-semibold text-zinc-500">{t.prepare}</p><p className="mt-2 text-sm font-semibold">{staffLabel(r.prepared_by)}</p><p className="mt-1 text-xs text-zinc-500">{date(r.prepared_at)}</p><p className="mt-2 text-sm text-zinc-600">{r.preparation_outcome??"—"}</p></div><div className="rounded-xl bg-zinc-50 p-4"><p className="text-xs font-semibold text-zinc-500">{t.review}</p><p className="mt-2 text-sm font-semibold">{staffLabel(r.reviewed_by)}</p><p className="mt-1 text-xs text-zinc-500">{date(r.reviewed_at)}</p><p className="mt-2 text-sm text-zinc-600">{r.review_outcome??"—"}</p></div><div className="rounded-xl bg-zinc-50 p-4"><p className="text-xs font-semibold text-zinc-500">{t.publish}</p><p className="mt-2 text-sm font-semibold">{staffLabel(r.published_by)}</p><p className="mt-1 text-xs text-zinc-500">{date(r.published_at)}</p><p className="mt-2 text-sm text-zinc-600">{r.recipient_name_snapshot??"—"}{r.recipient_email_snapshot?" · "+r.recipient_email_snapshot:""}</p></div></div>
    {r.status==="draft"&&<div className="border-t border-zinc-100 p-5"><form action={transition} className="grid gap-3 md:grid-cols-[1fr_auto]"><input type="hidden" name="report_id" value={r.id}/><textarea name="outcome" required minLength={3} rows={2} placeholder={r.prepared_by?t.review:t.preparation} className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-orange-400"/><div className="flex flex-wrap gap-2">{!r.prepared_by?<button name="action" value="prepare" className="rounded-xl bg-[var(--kram-charcoal)] px-4 py-2 text-sm font-bold text-white">{t.prepare}</button>:<><button name="action" value="submit_review" className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-semibold">{t.submit}</button><button name="action" value="approve_review" className="rounded-xl bg-[var(--kram-charcoal)] px-3 py-2 text-sm font-bold text-white">{t.approve}</button><button name="action" value="reject_review" className="rounded-xl border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-800">{t.reject}</button>{r.reviewed_by&&r.review_outcome?.startsWith("Approved: ")&&<button name="action" value="publish" className="rounded-xl bg-[var(--kram-orange)] px-3 py-2 text-sm font-bold text-white">{t.publish}</button>}</>}</div></form></div>}
    <details className="border-t border-zinc-100"><summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-4 text-sm font-semibold text-zinc-700"><History size={16}/>{t.history} ({events.length})</summary><div className="space-y-3 px-5 pb-5">{events.length?events.map((e:any)=><div key={e.id} className="flex gap-3 text-sm"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-zinc-500"/><div><p className="font-semibold text-zinc-800">{eventLabels[e.event_type]??e.event_type}</p><p className="text-zinc-600">{e.outcome}</p><p className="mt-1 text-xs text-zinc-400">{date(e.event_at)} · {e.actor_id?staffLabel(e.actor_id):"System"}{e.recipient_name_snapshot?" · "+e.recipient_name_snapshot:""}</p></div></div>):<p className="text-sm text-zinc-500">{t.noHistory}</p>}</div></details>
   </article>
  })}</div>}

 </div>;
}
