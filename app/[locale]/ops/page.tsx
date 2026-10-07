import { ArrowUpRight, FileCheck2, ShieldCheck, Users } from "lucide-react";
import { PerformancePanel } from "./components/performance-panel";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

type CountFilter =
  | { column: string; operator: "eq"; value: string }
  | { column: string; operator: "not"; value: string };

async function countRows(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: string,
  filter?: CountFilter,
) {
  let query = supabase.from(table).select("id", { count: "exact", head: true });
  if (filter?.operator === "eq") query = query.eq(filter.column, filter.value);
  if (filter?.operator === "not") query = query.not(filter.column, "in", filter.value);
  const { count } = await query;
  return count ?? 0;
}

export default async function OpsDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;

  const [{ data: membership }] = await Promise.all([
    userId ? supabase.from("organization_members").select("scope_level,country_id,branch_id").eq("user_id", userId).limit(1).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  let contextLabel = locale === "fr" ? "Vue globale" : locale === "pt" ? "Visão global" : "Global Overview";
  if (membership?.scope_level === "country" && membership.country_id) {
    const { data } = await supabase.from("countries").select("name").eq("id", membership.country_id).maybeSingle();
    if (data?.name) contextLabel = data.name + (locale === "fr" ? " — Vue d’ensemble" : locale === "pt" ? " — Visão geral" : " — Overview");
  } else if (membership?.scope_level === "branch" && membership.branch_id) {
    const { data } = await supabase.from("branches").select("name").eq("id", membership.branch_id).maybeSingle();
    if (data?.name) contextLabel = data.name + (locale === "fr" ? " — Vue d’ensemble" : locale === "pt" ? " — Visão geral" : " — Overview");
  }


  const trendStart = new Date();
  trendStart.setUTCHours(0, 0, 0, 0);
  trendStart.setUTCDate(trendStart.getUTCDate() - 29);

  const [{ data: trendOrders }, { data: trendInspections }, { data: responseUpdates }] = await Promise.all([
    supabase.from("work_orders").select("id,created_at,status").is("deleted_at", null).gte("created_at", trendStart.toISOString()).order("created_at", { ascending: true }),
    supabase.from("inspections").select("created_at,status").is("deleted_at", null).gte("created_at", trendStart.toISOString()).order("created_at", { ascending: true }),
    supabase.from("work_order_updates").select("work_order_id,created_at").gte("created_at", trendStart.toISOString()).order("created_at", { ascending: true }),
  ]);

  const trend = Array.from({ length: 30 }, (_, index) => {
    const day = new Date(trendStart);
    day.setUTCDate(trendStart.getUTCDate() + index);
    const next = new Date(day);
    next.setUTCDate(day.getUTCDate() + 1);
    const orders = (trendOrders ?? []).filter(row => {
      const created = new Date(row.created_at);
      return created >= day && created < next;
    });
    const inspectionsForDay = (trendInspections ?? []).filter(row => {
      const created = new Date(row.created_at);
      return created >= day && created < next;
    });
    return {
      label: day.toLocaleDateString(locale === "fr" ? "fr-FR" : locale === "pt" ? "pt-PT" : "en-GB", { day: "2-digit", month: "short", timeZone: "UTC" }),
      created: orders.length,
      completed: orders.filter(row => ["closed", "verified", "completed"].includes(row.status)).length,
      inspections: inspectionsForDay.length,
    };
  });

  const responseMap = new Map<string, string>();
  for (const update of responseUpdates ?? []) {
    if (!responseMap.has(update.work_order_id)) responseMap.set(update.work_order_id, update.created_at);
  }
  const responseHours = (trendOrders ?? [])
    .map(order => {
      const firstUpdate = responseMap.get(order.id);
      if (!firstUpdate) return null;
      return (new Date(firstUpdate).getTime() - new Date(order.created_at).getTime()) / 3600000;
    })
    .filter((value): value is number => value !== null && value >= 0);
  const averageResponseHours = responseHours.length
    ? responseHours.reduce((sum, value) => sum + value, 0) / responseHours.length
    : null;

  const statusCounts = await Promise.all(
    ["open", "in_progress", "completed", "verified", "closed"].map(async status => ({
      status,
      count: await countRows(supabase, "work_orders", { column: "status", operator: "eq", value: status }),
    })),
  );

  const [assets, clients, openOrders, approvals, attentionAssets, inspections, pendingProviders] = await Promise.all([
    countRows(supabase, "assets"),
    countRows(supabase, "clients"),
    countRows(supabase, "work_orders", { column: "status", operator: "not", value: "(closed,verified,completed)" }),
    countRows(supabase, "approvals", { column: "status", operator: "eq", value: "pending" }),
    countRows(supabase, "assets", { column: "status", operator: "eq", value: "attention" }),
    countRows(supabase, "inspections", { column: "status", operator: "eq", value: "scheduled" }),
    countRows(supabase, "service_providers", { column: "verification_status", operator: "eq", value: "pending" }),
  ]);


  const fr = locale === "fr"; const pt = locale === "pt";
  const dashboardLabels = {
    title: pt ? "Desempenho operacional" : fr ? "Performance opérationnelle" : "Operations Performance",
    scope: pt ? "Global" : fr ? "Global" : "Global",
    period: pt ? "Últimos 30 dias" : fr ? "30 derniers jours" : "Last 30 days",
    open: pt ? "Ordens abertas" : fr ? "Ordres ouverts" : "Open WOs",
    completed: pt ? "Concluídas" : fr ? "Terminées" : "Completed",
    response: pt ? "Primeira resposta" : fr ? "Première réponse" : "First response",
    overdue: pt ? "Em atraso" : fr ? "En retard" : "Overdue",
    notTracked: pt ? "Não monitorizado" : fr ? "Non suivi" : "Not tracked",
    responseNote: pt ? "média até à primeira atualização" : fr ? "moyenne jusqu’à la première mise à jour" : "average to first update",
    attention: pt ? "Necessita atenção" : fr ? "Nécessite une attention" : "Needs Attention",
    attentionDesc: pt ? "Itens que exigem decisão, verificação ou intervenção." : fr ? "Éléments nécessitant une décision, vérification ou intervention." : "Items requiring a decision, verification or intervention.",
    approvals: pt ? "Aprovações pendentes" : fr ? "Approbations en attente" : "Pending approvals",
    attentionAssets: pt ? "Ativos que precisam de atenção" : fr ? "Actifs nécessitant une attention" : "Assets requiring attention",
    scheduled: pt ? "Inspeções pendentes" : fr ? "Inspections en attente" : "Pending inspections",
    providers: pt ? "Prestadores aguardando verificação" : fr ? "Prestataires en attente de vérification" : "Providers awaiting verification",
    health: pt ? "Saúde operacional" : fr ? "Santé opérationnelle" : "Operational Health",
    network: pt ? "Rede de campo" : fr ? "Réseau terrain" : "Field network",
    verified: pt ? "prestadores verificados" : fr ? "prestataires vérifiés" : "verified providers",
    viewNetwork: pt ? "Abrir rede" : fr ? "Ouvrir le réseau" : "Open network",
    clients: pt ? "Clientes" : fr ? "Clients" : "Clients",
    owners: pt ? "proprietários sob acompanhamento" : fr ? "propriétaires suivis" : "owners under management",
    evidence: pt ? "Inspeções" : fr ? "Inspections" : "Inspections",
    scheduledShort: pt ? "agendadas" : fr ? "planifiées" : "scheduled",
  };

  const healthLabels: Record<string, string> = {
    open: pt ? "Abertas" : fr ? "Ouvertes" : "Open",
    in_progress: pt ? "Em execução" : fr ? "En cours" : "In progress",
    completed: pt ? "Concluídas" : fr ? "Terminées" : "Completed",
    verified: pt ? "Verificadas" : fr ? "Vérifiées" : "Verified",
    closed: pt ? "Fechadas" : fr ? "Fermées" : "Closed",
  };
  const status = statusCounts.filter(item => item.count > 0).map(item => ({ label: healthLabels[item.status], value: item.count }));
  const attentionTotal = approvals + attentionAssets + inspections + pendingProviders;

  return <div className="space-y-6 pb-10">
    <PerformancePanel
      locale={locale}
      contextLabel={contextLabel}
      trend={trend}
      status={status}
      openOrders={openOrders}
      averageResponseHours={averageResponseHours}
      labels={dashboardLabels}
    />

    <section className="grid gap-5 xl:grid-cols-[1.4fr_.6fr]">
      <div className="rounded-2xl border border-[var(--kram-border)] bg-white">
        <div className="flex items-center justify-between border-b border-[var(--kram-border)] px-6 py-5">
          <div>
            <h2 className="text-[15px] font-black tracking-[-.02em] text-[var(--kram-deep)]">{dashboardLabels.attention}</h2>
            <p className="mt-1 text-xs text-[var(--kram-metal)]">{dashboardLabels.attentionDesc}</p>
          </div>
          <div className="rounded-full border border-[var(--kram-border)] px-2.5 py-1 text-[10px] font-black text-[var(--kram-charcoal)]">{attentionTotal}</div>
        </div>
        <div className="divide-y divide-[var(--kram-border)]">
          {[
            { label: dashboardLabels.approvals, value: approvals, route: "approvals" },
            { label: dashboardLabels.scheduled, value: inspections, route: "inspections" },
            { label: dashboardLabels.providers, value: pendingProviders, route: "providers" },
            { label: dashboardLabels.attentionAssets, value: attentionAssets, route: "assets" },
          ].filter(item => item.value > 0).map(({ label, value, route }) => (
            <Link href={`/${locale}/ops/${route}`} key={label} className="flex items-center justify-between px-6 py-4 hover:bg-[var(--kram-bg)]">
              <div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-[var(--kram-orange)]"/><span className="text-sm font-semibold text-[var(--kram-charcoal)]">{label}</span></div>
              <span className="min-w-7 rounded-full bg-[var(--kram-bg)] px-2.5 py-1 text-center text-xs font-black text-[var(--kram-metal)]">{value}</span>
              <ArrowUpRight size={14} className="text-[var(--kram-soft-metal)]"/>
            </Link>
          ))}
          {!attentionTotal && <div className="px-6 py-8 text-center text-xs text-[var(--kram-metal)]">{locale === "fr" ? "Aucune action requise." : locale === "pt" ? "Nenhuma ação necessária." : "Nothing needs attention."}</div>}
        </div>
      </div>

      <div className="rounded-2xl bg-[var(--kram-charcoal)] p-6 text-white">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[var(--kram-orange)]">{dashboardLabels.network}</p>
        <div className="mt-3 flex items-end justify-between gap-4">
          <div><p className="text-4xl font-black tracking-[-.06em]">{pendingProviders}</p><p className="mt-1 text-xs text-white/50">{dashboardLabels.providers}</p></div>
          <ShieldCheck size={24} className="text-[var(--kram-orange)]"/>
        </div>
        <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
          <div><p className="text-[10px] uppercase tracking-[.14em] text-white/35">{dashboardLabels.clients}</p><p className="mt-1 text-lg font-black">{clients}</p><p className="text-[10px] text-white/40">{dashboardLabels.owners}</p></div>
          <Link href={`/${locale}/ops/providers`} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-bold hover:bg-white/10">{dashboardLabels.viewNetwork}</Link>
        </div>
      </div>
    </section>

    <section className="grid gap-3 md:grid-cols-2">
      <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-5"><div className="flex items-center gap-2 text-[var(--kram-metal)]"><Users size={16}/><span className="text-[10px] font-bold uppercase tracking-[.15em]">{dashboardLabels.clients}</span></div><div className="mt-4 text-2xl font-black tracking-[-.05em]">{clients}</div><p className="mt-1 text-xs text-[var(--kram-metal)]">{dashboardLabels.owners}</p></div>
      <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-5"><div className="flex items-center gap-2 text-[var(--kram-metal)]"><FileCheck2 size={16}/><span className="text-[10px] font-bold uppercase tracking-[.15em]">{dashboardLabels.evidence}</span></div><div className="mt-4 text-2xl font-black tracking-[-.05em]">{inspections}</div><p className="mt-1 text-xs text-[var(--kram-metal)]">{dashboardLabels.scheduledShort}</p></div>
    </section>
  </div>;
}
