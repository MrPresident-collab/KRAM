import { ArrowUpRight, Building2, CheckCircle2, ClipboardList, Clock3, FileCheck2, Plus, ShieldCheck, Users } from "lucide-react";
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

  const [assets, clients, openOrders, approvals, activeOrders, attentionAssets, inspections, providers] = await Promise.all([
    countRows(supabase, "assets"),
    countRows(supabase, "clients"),
    countRows(supabase, "work_orders", { column: "status", operator: "not", value: "(closed,verified,completed)" }),
    countRows(supabase, "approvals", { column: "status", operator: "eq", value: "pending" }),
    countRows(supabase, "work_orders", { column: "status", operator: "eq", value: "in_progress" }),
    countRows(supabase, "assets", { column: "status", operator: "eq", value: "attention" }),
    countRows(supabase, "inspections", { column: "status", operator: "eq", value: "scheduled" }),
    countRows(supabase, "service_providers", { column: "verification_status", operator: "eq", value: "verified" }),
  ]);

  const fr = locale === "fr"; const pt = locale === "pt";
  const dashboardLabels = {
    eyebrow: pt ? "Centro de operações" : fr ? "Centre des opérations" : "Operations console",
    description: pt ? "O estado operacional da sua área autorizada, com foco no que exige ação." : fr ? "L’état opérationnel de votre périmètre autorisé, centré sur ce qui nécessite une action." : "The operational state of your authorized scope, focused on what needs action.",
    create: pt ? "Nova ordem" : fr ? "Nouvel ordre" : "New work order",
    assets: pt ? "Ativos" : fr ? "Actifs" : "Assets",
    openOrders: pt ? "Ordens abertas" : fr ? "Ordres ouverts" : "Open work orders",
    awaiting: pt ? "Aguardando aprovação" : fr ? "En attente d’approbation" : "Awaiting approval",
    active: pt ? "Em execução" : fr ? "En cours" : "In progress",
    attention: pt ? "Fila de atenção" : fr ? "File d’attention" : "Attention queue",
    attentionDesc: pt ? "Itens que exigem decisão, verificação ou intervenção." : fr ? "Éléments nécessitant une décision, vérification ou intervention." : "Items requiring a decision, verification or intervention.",
    approvals: pt ? "Aprovações pendentes" : fr ? "Approbations en attente" : "Pending approvals",
    attentionAssets: pt ? "Ativos com atenção" : fr ? "Actifs à surveiller" : "Assets needing attention",
    scheduled: pt ? "Inspeções agendadas" : fr ? "Inspections planifiées" : "Scheduled inspections",
    network: pt ? "Rede de campo" : fr ? "Réseau terrain" : "Field network",
    verified: pt ? "prestadores verificados" : fr ? "prestataires vérifiés" : "verified providers",
    viewNetwork: pt ? "Abrir rede" : fr ? "Ouvrir le réseau" : "Open network",
    clients: pt ? "Clientes" : fr ? "Clients" : "Clients",
    owners: pt ? "proprietários sob acompanhamento" : fr ? "propriétaires suivis" : "owners under management",
    evidence: pt ? "Inspeções" : fr ? "Inspections" : "Inspections",
    scheduledShort: pt ? "agendadas" : fr ? "planifiées" : "scheduled",
  };

  const metrics = [
    { label: dashboardLabels.assets, value: assets, note: pt ? "Registo de ativos" : fr ? "Registre des actifs" : "Asset registry", icon: Building2 },
    { label: dashboardLabels.openOrders, value: openOrders, note: pt ? "Trabalho ainda aberto" : fr ? "Travail encore ouvert" : "Work still open", icon: ClipboardList },
    { label: dashboardLabels.awaiting, value: approvals, note: pt ? "Decisão necessária" : fr ? "Décision requise" : "Decision required", icon: Clock3, accent: approvals > 0 },
    { label: dashboardLabels.active, value: activeOrders, note: pt ? "Intervenções em curso" : fr ? "Interventions en cours" : "Active interventions", icon: CheckCircle2 },
  ];

  const attentionTotal = approvals + attentionAssets + inspections;

  return <div className="space-y-6 pb-10">
    <section className="relative overflow-hidden rounded-2xl border border-[var(--kram-border)] bg-[var(--kram-deep)] px-6 py-7 text-white md:px-9 md:py-8">
      <div className="absolute right-[-80px] top-[-120px] h-80 w-80 rounded-full bg-[var(--kram-orange)] opacity-10 blur-3xl" />
      <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[var(--kram-orange)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--kram-orange)]" />{dashboardLabels.eyebrow}</div>
          <h1 className="text-3xl font-black tracking-[-.055em] md:text-[42px]">{contextLabel}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">{dashboardLabels.description}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/${locale}/ops/work-orders/new`} className="inline-flex items-center gap-2 rounded-xl bg-[var(--kram-orange)] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#df6816]"><Plus size={15}/>{dashboardLabels.create}</Link>
          <Link href={`/${locale}/ops/assets`} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10">{dashboardLabels.assets}<ArrowUpRight size={14}/></Link>
        </div>
      </div>
    </section>

    <section className="grid gap-px overflow-hidden rounded-2xl border border-[var(--kram-border)] bg-[var(--kram-border)] sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ label, value, note, icon: Icon, accent }) => <div key={label} className="bg-white p-5">
        <div className="flex items-center justify-between"><div className={`grid h-9 w-9 place-items-center rounded-lg ${accent ? "bg-[var(--kram-orange-soft)] text-[var(--kram-orange)]" : "bg-[var(--kram-bg)] text-[var(--kram-metal)]"}`}><Icon size={17}/></div>{accent&&<span className="text-[9px] font-bold uppercase tracking-[.14em] text-[var(--kram-orange)]">{pt?"Ação":fr?"Action":"Action"}</span>}</div>
        <div className="mt-5 text-3xl font-black tracking-[-.06em] text-[var(--kram-deep)]">{value}</div>
        <div className="mt-1 text-[13px] font-bold text-[var(--kram-charcoal)]">{label}</div>
        <div className="mt-1 text-[11px] text-[var(--kram-metal)]">{note}</div>
      </div>)}
    </section>

    <section className="grid gap-5 xl:grid-cols-[1.4fr_.6fr]">
      <div className="rounded-2xl border border-[var(--kram-border)] bg-white">
        <div className="flex items-center justify-between border-b border-[var(--kram-border)] px-6 py-5">
          <div><h2 className="text-[15px] font-black tracking-[-.02em] text-[var(--kram-deep)]">{dashboardLabels.attention}</h2><p className="mt-1 text-xs text-[var(--kram-metal)]">{dashboardLabels.attentionDesc}</p></div>
          <div className="rounded-full border border-[var(--kram-border)] px-2.5 py-1 text-[10px] font-black text-[var(--kram-charcoal)]">{attentionTotal}</div>
        </div>
        <div className="divide-y divide-[var(--kram-border)]">
          {[
            { label: dashboardLabels.approvals, value: approvals, route: "approvals" },
            { label: dashboardLabels.attentionAssets, value: attentionAssets, route: "assets" },
            { label: dashboardLabels.scheduled, value: inspections, route: "inspections" },
          ].map(({ label, value, route }) => <Link href={`/${locale}/ops/${route}`} key={label} className="flex items-center justify-between px-6 py-4 hover:bg-[var(--kram-bg)]"><div className="flex items-center gap-3"><span className={`h-2 w-2 rounded-full ${value > 0 ? "bg-[var(--kram-orange)]" : "bg-[var(--kram-soft-metal)]"}`}/><span className="text-sm font-semibold text-[var(--kram-charcoal)]">{label}</span></div><span className="min-w-7 rounded-full bg-[var(--kram-bg)] px-2.5 py-1 text-center text-xs font-black text-[var(--kram-metal)]">{value}</span></Link>)}
        </div>
      </div>
      <div className="rounded-2xl bg-[var(--kram-charcoal)] p-6 text-white">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[var(--kram-orange)]">{dashboardLabels.network}</p>
        <div className="mt-3 flex items-end justify-between gap-4"><div><p className="text-4xl font-black tracking-[-.06em]">{providers}</p><p className="mt-1 text-xs text-white/50">{dashboardLabels.verified}</p></div><ShieldCheck size={24} className="text-[var(--kram-orange)]"/></div>
        <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5"><div><p className="text-[10px] uppercase tracking-[.14em] text-white/35">{dashboardLabels.clients}</p><p className="mt-1 text-lg font-black">{clients}</p><p className="text-[10px] text-white/40">{dashboardLabels.owners}</p></div><Link href={`/${locale}/ops/providers`} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-bold hover:bg-white/10">{dashboardLabels.viewNetwork}</Link></div>
      </div>
    </section>

    <section className="grid gap-3 md:grid-cols-2">
      <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-5"><div className="flex items-center gap-2 text-[var(--kram-metal)]"><Users size={16}/><span className="text-[10px] font-bold uppercase tracking-[.15em]">{dashboardLabels.clients}</span></div><div className="mt-4 text-2xl font-black tracking-[-.05em]">{clients}</div><p className="mt-1 text-xs text-[var(--kram-metal)]">{dashboardLabels.owners}</p></div>
      <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-5"><div className="flex items-center gap-2 text-[var(--kram-metal)]"><FileCheck2 size={16}/><span className="text-[10px] font-bold uppercase tracking-[.15em]">{dashboardLabels.evidence}</span></div><div className="mt-4 text-2xl font-black tracking-[-.05em]">{inspections}</div><p className="mt-1 text-xs text-[var(--kram-metal)]">{dashboardLabels.scheduledShort}</p></div>
    </section>
  </div>;
}
