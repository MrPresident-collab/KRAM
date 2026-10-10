import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowUpRight, FileText, Wallet, CircleAlert, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isLocale, type Locale } from "@/lib/i18n";
import { KramLogo } from "@/components/brand/kram-logo";
import { ClientSignOut } from "@/components/client-portal-sign-out";

const words = {
  en: { eyebrow:"FINANCIAL TRANSPARENCY", title:"Expenses & financial reports", intro:"Understand how each service used its budget. Detailed reports are shared after service delivery.", back:"Your overview", budget:"Approved budgets", spent:"Reported spend", remaining:"Budget remaining", reports:"Service delivery reports", empty:"Your published financial reports will appear here after KRAM completes and publishes a service report.", budgetNote:"Figures include published reports only. Draft and internal financial records are never shown.", budgetGap:"Budget was insufficient", withinBudget:"Within budget", spentLabel:"Reported spend", budgetLabel:"Service budget", additional:"Additional funding", covered:"Work covered", purchases:"Purchases", addons:"Add-ons", details:"View report", published:"Published", unknown:"Not specified", signOut:"Sign out", noSummary:"No summary supplied." },
  fr: { eyebrow:"TRANSPARENCE FINANCIÈRE", title:"Dépenses et rapports financiers", intro:"Comprenez comment le budget de chaque service a été utilisé. Un rapport détaillé est partagé après chaque prestation.", back:"Votre espace", budget:"Budgets approuvés", spent:"Dépenses déclarées", remaining:"Budget restant", reports:"Rapports de prestation", empty:"Vos rapports financiers publiés apparaîtront ici après la réalisation et la publication du rapport par KRAM.", budgetNote:"Les montants concernent uniquement les rapports publiés. Les brouillons et dossiers financiers internes restent privés.", budgetGap:"Budget insuffisant", withinBudget:"Dans le budget", spentLabel:"Dépenses déclarées", budgetLabel:"Budget du service", additional:"Financement supplémentaire", covered:"Travaux couverts", purchases:"Achats", addons:"Suppléments", details:"Voir le rapport", published:"Publié", unknown:"Non précisé", signOut:"Se déconnecter", noSummary:"Aucun résumé fourni." },
  pt: { eyebrow:"TRANSPARÊNCIA FINANCEIRA", title:"Despesas e relatórios financeiros", intro:"Perceba como o orçamento de cada serviço foi utilizado. O relatório detalhado é partilhado após cada serviço.", back:"A sua área", budget:"Orçamentos aprovados", spent:"Despesas reportadas", remaining:"Orçamento restante", reports:"Relatórios de prestação de serviços", empty:"Os relatórios financeiros publicados aparecerão aqui depois de a KRAM concluir e publicar o relatório do serviço.", budgetNote:"Os valores incluem apenas relatórios publicados. Rascunhos e registos financeiros internos nunca são apresentados.", budgetGap:"Orçamento insuficiente", withinBudget:"Dentro do orçamento", spentLabel:"Despesas reportadas", budgetLabel:"Orçamento do serviço", additional:"Financiamento adicional", covered:"Trabalho realizado", purchases:"Compras", addons:"Extras", details:"Ver relatório", published:"Publicado", unknown:"Não especificado", signOut:"Terminar sessão", noSummary:"Sem resumo disponível." }
} as const;

function money(amount: number, currency: string, locale: Locale) {
  try { return new Intl.NumberFormat(locale, { style:"currency", currency:currency.trim(), maximumFractionDigits:2 }).format(amount); }
  catch { return amount.toLocaleString(locale) + " " + currency.trim(); }
}
function date(value: string | null, locale: Locale) {
  if (!value) return "—";
  try { return new Intl.DateTimeFormat(locale, { dateStyle:"medium" }).format(new Date(value)); } catch { return "—"; }
}
function listText(value: unknown, locale: Locale) {
  if (!Array.isArray(value) || value.length === 0) return locale==="fr" ? "Non précisé" : locale==="pt" ? "Não especificado" : "Not specified";
  return value.map((item:any) => typeof item === "string" ? item : [item?.name, item?.description, item?.item, item?.quantity ? "×"+item.quantity : null].filter(Boolean).join(" — ")).filter(Boolean).join("; ");
}

export default async function ClientFinancialReportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const route = await params;
  const locale: Locale = isLocale(route.locale) ? route.locale : "fr";
  const t = words[locale];
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/" + locale + "/client-login");
  const { data: clientId, error: clientError } = await supabase.rpc("current_kram_client_id");
  if (clientError || !clientId) redirect("/" + locale + "/client-login");

  const { data: reports, error } = await supabase
    .from("client_financial_reports")
    .select("id,report_number,title,currency,budget_amount,total_spent,additional_funding_amount,service_summary,work_covered,purchases,addons,budget_insufficient,budget_notes,published_at,assets(id,name,reference_code),work_orders(id,title)")
    .eq("client_id", clientId)
    .eq("status", "published")
    .order("published_at", { ascending:false });
  const rows = reports ?? [];
  const totals = rows.reduce((acc, report:any) => {
    const currency = report.currency.trim();
    if (!acc[currency]) acc[currency] = { budget:0, spent:0, additional:0 };
    acc[currency].budget += Number(report.budget_amount || 0);
    acc[currency].spent += Number(report.total_spent || 0);
    acc[currency].additional += Number(report.additional_funding_amount || 0);
    return acc;
  }, {} as Record<string,{budget:number;spent:number;additional:number}>);
  const pretty = (value:string) => value.replaceAll("_"," ").replace(/\b\w/g,c=>c.toUpperCase());

  return <main className="client-portal">
    <header className="client-portal-header">
      <Link href={"/"+locale} aria-label="KRAM home"><KramLogo className="client-portal-logo"/></Link>
      <nav aria-label="Client navigation"><Link href={"/"+locale+"/client"}>{t.back}</Link><Link href={"/"+locale+"/client/financial-reports"} className="client-nav-active">{t.reports}</Link><ClientSignOut locale={locale} label={t.signOut}/></nav>
    </header>
    <div className="client-portal-main">
      <Link className="client-form-back" href={"/"+locale+"/client"}><ArrowLeft size={15}/>{t.back}</Link>
      <section className="client-portal-welcome">
        <div><p className="eyebrow"><span className="eyebrow-line"/>{t.eyebrow}</p><h1>{t.title}</h1><p className="client-portal-lead">{t.intro}</p></div>
        <div className="client-portal-welcome-mark"><Wallet size={31} strokeWidth={1.25}/><span>KRAM</span></div>
      </section>
      {error && <p role="status" className="client-portal-empty">Financial reports are temporarily unavailable. Please try again later.</p>}
      <section className="client-portal-grid" aria-label={t.eyebrow}>
        {Object.entries(totals).length ? Object.entries(totals).map(([currency, values]) => <article className="client-portal-stat" key={currency}><span>{t.budget}</span><strong>{money(values.budget,currency,locale)}</strong><small>{currency}</small></article>) : <article className="client-portal-stat"><span>{t.budget}</span><strong>—</strong><small>{rows.length} {t.reports.toLowerCase()}</small></article>}
        {Object.entries(totals).length ? Object.entries(totals).map(([currency, values]) => <article className="client-portal-stat" key={"spent-"+currency}><span>{t.spent}</span><strong>{money(values.spent,currency,locale)}</strong><small>{currency}</small></article>) : <article className="client-portal-stat"><span>{t.spent}</span><strong>—</strong><small>—</small></article>}
        {Object.entries(totals).length ? Object.entries(totals).map(([currency, values]) => <article className="client-portal-stat" key={"remaining-"+currency}><span>{t.remaining}</span><strong>{money(values.budget-values.spent,currency,locale)}</strong><small>{currency}</small></article>) : <article className="client-portal-stat"><span>{t.remaining}</span><strong>—</strong><small>—</small></article>}
      </section>
      <p className="client-portal-empty">{t.budgetNote}</p>
      <section className="client-portal-panel">
        <div className="client-portal-panel-heading"><div><p className="eyebrow">01 / FINANCIAL RECORDS</p><h2>{t.reports}</h2></div><FileText size={20}/></div>
        {rows.length ? <div className="space-y-5">{rows.map((report:any) => {
          const asset = Array.isArray(report.assets) ? report.assets[0] : report.assets;
          const workOrder = Array.isArray(report.work_orders) ? report.work_orders[0] : report.work_orders;
          return <article className="rounded-xl border border-zinc-200 p-5 sm:p-6 space-y-4" key={report.id}>
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow">{report.report_number} · {date(report.published_at,locale)}</p><h3 className="mt-2 text-lg font-semibold text-zinc-950">{report.title}</h3><p className="mt-1 text-sm text-zinc-500">{asset?.name ?? "—"}{asset?.reference_code ? " · "+asset.reference_code : ""}{workOrder?.title ? " · "+workOrder.title : ""}</p></div><span className="client-portal-status">{t.published}</span></div>
            <p className="text-sm leading-6 text-zinc-600">{report.service_summary || t.noSummary}</p>
            <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-lg bg-zinc-50 p-4"><span className="text-xs text-zinc-500">{t.budgetLabel}</span><strong className="mt-1 block text-base">{money(Number(report.budget_amount),report.currency,locale)}</strong></div><div className="rounded-lg bg-zinc-50 p-4"><span className="text-xs text-zinc-500">{t.spentLabel}</span><strong className="mt-1 block text-base">{money(Number(report.total_spent),report.currency,locale)}</strong></div><div className="rounded-lg bg-zinc-50 p-4"><span className="text-xs text-zinc-500">{t.additional}</span><strong className="mt-1 block text-base">{money(Number(report.additional_funding_amount),report.currency,locale)}</strong></div></div>
            <div className="grid gap-4 md:grid-cols-2"><div><h4 className="text-sm font-semibold">{t.covered}</h4><p className="mt-1 text-sm leading-6 text-zinc-600">{report.work_covered || t.unknown}</p></div><div><h4 className="text-sm font-semibold">{t.purchases}</h4><p className="mt-1 text-sm leading-6 text-zinc-600">{listText(report.purchases,locale)}</p></div><div><h4 className="text-sm font-semibold">{t.addons}</h4><p className="mt-1 text-sm leading-6 text-zinc-600">{listText(report.addons,locale)}</p></div><div><h4 className="text-sm font-semibold">{report.budget_insufficient ? <><CircleAlert size={15} className="mr-1 inline text-orange-600"/>{t.budgetGap}</> : <><CheckCircle2 size={15} className="mr-1 inline text-emerald-700"/>{t.withinBudget}</>}</h4><p className="mt-1 text-sm leading-6 text-zinc-600">{report.budget_notes || t.unknown}</p></div></div>
          </article>;
        })}</div> : <p className="client-portal-empty">{t.empty}</p>}
      </section>
      <aside className="client-portal-privacy"><CheckCircle2 size={19}/><div><strong>{t.eyebrow}</strong><p>{t.budgetNote}</p></div></aside>
    </div>
    <footer className="client-portal-footer"><span>© KRAM</span><span>{t.eyebrow}</span><Link href={"/"+locale}>{t.back}</Link></footer>
  </main>;
}
