import { AlertTriangle, ArrowUpRight, Building2, CheckCircle2, ClipboardList, Clock3, FileCheck2, Plus, ShieldCheck, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { copy, isLocale, type Locale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

// Supabase's fluent query builder is intentionally kept behind this small count helper.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function countRows(supabase: Awaited<ReturnType<typeof createClient>>, table: string, filters?: (query: any) => any) {
  let query = supabase.from(table).select("id", { count: "exact", head: true });
  if (filters) query = filters(query);
  const { count } = await query;
  return count ?? 0;
}

export default async function OpsDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;

  const [{ data: membership }] = await Promise.all([
    userId ? supabase.from("organization_members").select("scope_level,country_id,branch_id").eq("user_id", userId).limit(1).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  let contextLabel = locale === "fr" ? "Vue globale" : locale === "pt" ? "Visão global" : "Global Overview";
  if (membership?.scope_level === "country" && membership.country_id) {
    const { data } = await supabase.from("countries").select("name").eq("id", membership.country_id).maybeSingle();
    if (data?.name) contextLabel = `${data.name} ${locale === "fr" ? "— Vue d’ensemble" : locale === "pt" ? "— Visão geral" : "— Overview"}`;
  } else if (membership?.scope_level === "branch" && membership.branch_id) {
    const { data } = await supabase.from("branches").select("name").eq("id", membership.branch_id).maybeSingle();
    if (data?.name) contextLabel = `${data.name} ${locale === "fr" ? "— Vue d’ensemble" : locale === "pt" ? "— Visão geral" : "— Overview"}`;
  }

  const [assets, clients, openOrders, approvals, activeOrders, attentionAssets, inspections, providers] = await Promise.all([
    countRows(supabase, "assets"),
    countRows(supabase, "clients"),
    countRows(supabase, "work_orders", q => q.not("status", "in", "(closed,verified,completed)")),
    countRows(supabase, "approvals", q => q.eq("status", "pending")),
    countRows(supabase, "work_orders", q => q.eq("status", "in_progress")),
    countRows(supabase, "assets", q => q.eq("status", "attention")),
    countRows(supabase, "inspections", q => q.eq("status", "scheduled")),
    countRows(supabase, "service_providers", q => q.eq("verification_status", "verified")),
  ]);

  const fr = locale === "fr";
  const pt = locale === "pt";
  const labels = {
    overview: pt ? "Visão geral" : fr ? "Vue d’ensemble" : "Overview",
    eyebrow: pt ? "Centro de operações" : fr ? "Centre des opérations" : "Operations console",
    description: pt ? "Acompanhe o que precisa de atenção, o que está em curso e o estado dos ativos KRAM." : fr ? "Suivez ce qui nécessite une action, ce qui est en cours et l’état des actifs KRAM." : "See what needs action, what is underway, and the state of KRAM assets.",
    create: pt ? "Criar pedido" : fr ? "Créer une demande" : "Create request",
    assets: pt ? "Ativos" : fr ? "Actifs" : "Assets",
    openOrders: pt ? "Ordens abertas" : fr ? "Ordres ouverts" : "Open work orders",
    awaiting: pt ? "Aguardando aprovação" : fr ? "En attente d’approbation" : "Awaiting approval",
    active: pt ? "Operações ativas" : fr ? "Opérations actives" : "Active operations",
    attention: pt ? "Ação necessária" : fr ? "À traiter maintenant" : "Action required",
    attentionDesc: pt ? "Itens que precisam de uma decisão ou intervenção." : fr ? "Les éléments qui nécessitent une décision ou une intervention." : "Items that need a decision or intervention.",
    approvals: pt ? "Aprovações pendentes" : fr ? "Approbations en attente" : "Pending approvals",
    attentionAssets: pt ? "Ativos com atenção" : fr ? "Actifs à surveiller" : "Assets needing attention",
    scheduled: pt ? "Inspeções agendadas" : fr ? "Inspections planifiées" : "Scheduled inspections",
    network: pt ? "Rede KRAM" : fr ? "Réseau KRAM" : "KRAM network",
    verified: pt ? "prestadores verificados" : fr ? "prestataires vérifiés" : "verified providers",
    viewNetwork: pt ? "Ver rede" : fr ? "Voir le réseau" : "View network",
    clients: pt ? "Clientes" : fr ? "Clients" : "Clients",
    owners: pt ? "proprietários acompanhados pela KRAM" : fr ? "propriétaires suivis par KRAM" : "owners supported by KRAM",
    evidence: pt ? "Cadeia de evidências" : fr ? "Chaîne de preuves" : "Evidence chain",
    scheduledShort: pt ? "inspeções agendadas" : fr ? "inspections planifiées" : "scheduled inspections",
  };

  const metrics = [
    { label: labels.assets, value: assets, note: pt ? "Registo central" : fr ? "Registre central" : "Central asset registry", icon: Building2 },
    { label: labels.openOrders, value: openOrders, note: pt ? "Em todas as filiais" : fr ? "Toutes les agences" : "Across authorized scope", icon: ClipboardList },
    { label: labels.awaiting, value: approvals, note: pt ? "Requer decisão" : fr ? "Nécessite une décision" : "Requires a decision", icon: Clock3, accent: true },
    { label: labels.active, value: activeOrders, note: pt ? "Trabalho no terreno" : fr ? "Travail terrain" : "Field work in progress", icon: CheckCircle2 },
  ];

  return <div className="space-y-6 pb-10">
    <section className="kram-grid relative overflow-hidden rounded-2xl border border-[var(--kram-border)] bg-white px-6 py-7 md:px-9 md:py-8">
      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[var(--kram-orange-soft)] to-transparent opacity-70" />
      <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[var(--kram-orange)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--kram-orange)]" /> {labels.eyebrow}</div>
          <h1 className="max-w-3xl text-3xl font-black tracking-[-.055em] text-[var(--kram-deep)] md:text-[40px]">{contextLabel}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--kram-metal)]">{labels.description}</p>
        </div>
        <div className="flex gap-2">
          <a href={`/${locale}/ops/work-orders`} className="inline-flex items-center gap-2 rounded-xl bg-[var(--kram-orange)] px-4 py-2.5 text-xs font-bold text-white shadow-[0_6px_18px_rgba(244,119,33,.2)] hover:bg-[#df6816]"><Plus size={15} /> {labels.create}</a>
          <a href={`/${locale}/ops/assets`} className="inline-flex items-center gap-2 rounded-xl border border-[var(--kram-border)] bg-white px-4 py-2.5 text-xs font-bold text-[var(--kram-charcoal)] hover:bg-[var(--kram-bg)]">{labels.assets}<ArrowUpRight size={14} /></a>
        </div>
      </div>
    </section>

    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ label, value, note, icon: Icon, accent }) => <div key={label} className="rounded-2xl border border-[var(--kram-border)] bg-white p-5">
        <div className="flex items-start justify-between"><div className={`grid h-9 w-9 place-items-center rounded-xl ${accent ? "bg-[var(--kram-orange-soft)] text-[var(--kram-orange)]" : "bg-[var(--kram-bg)] text-[var(--kram-metal)]"}`}><Icon size={17}/></div>{accent && <span className="rounded-full bg-[var(--kram-orange-soft)] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[var(--kram-orange)]">Priority</span>}</div>
        <div className="mt-5 text-3xl font-black tracking-[-.06em] text-[var(--kram-deep)]">{value}</div><div className="mt-1 text-[13px] font-bold text-[var(--kram-charcoal)]">{label}</div><div className="mt-1 text-[11px] text-[var(--kram-metal)]">{note}</div>
      </div>)}
    </section>

    <section className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
      <div className="rounded-2xl border border-[var(--kram-border)] bg-white">
        <div className="flex items-center justify-between border-b border-[var(--kram-border)] px-6 py-5"><div><h2 className="text-[15px] font-black tracking-[-.02em] text-[var(--kram-deep)]">{labels.attention}</h2><p className="mt-1 text-xs text-[var(--kram-metal)]">{labels.attentionDesc}</p></div><AlertTriangle size={18} className="text-[var(--kram-orange)]"/></div>
        <div className="divide-y divide-[var(--kram-border)]">
          {[
            { label: labels.approvals, value: approvals, route: "approvals" },
            { label: labels.attentionAssets, value: attentionAssets, route: "assets" },
            { label: labels.scheduled, value: inspections, route: "inspections" },
          ].map(({ label, value, route }) => <a href={`/${locale}/ops/${route}`} key={label} className="flex items-center justify-between px-6 py-4 transition hover:bg-[var(--kram-bg)]"><div className="flex items-center gap-3"><span className={`h-2 w-2 rounded-full ${value > 0 ? "bg-[var(--kram-orange)]" : "bg-[var(--kram-soft-metal)]"}`}/><span className="text-sm font-semibold text-[var(--kram-charcoal)]">{label}</span></div><span className="rounded-full bg-[var(--kram-bg)] px-2.5 py-1 text-xs font-black text-[var(--kram-metal)]">{value}</span></a>)}
        </div>
      </div>
      <div className="rounded-2xl bg-[var(--kram-deep)] p-6 text-white">
        <div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[var(--kram-orange)]">{labels.network}</p><h2 className="mt-2 text-xl font-black tracking-[-.04em]">{providers}</h2><p className="mt-1 text-xs text-white/55">{labels.verified}</p></div><ShieldCheck size={20} className="text-[var(--kram-orange)]"/></div>
        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5"><div><p className="text-[10px] uppercase tracking-[.14em] text-white/40">{labels.clients}</p><p className="mt-1 text-lg font-black">{clients}</p></div><a href={`/${locale}/ops/providers`} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-bold text-white hover:bg-white/10">{labels.viewNetwork}</a></div>
      </div>
    </section>

    <section className="grid gap-3 md:grid-cols-2">
      <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-5"><div className="flex items-center gap-2 text-[var(--kram-metal)]"><Users size={16}/><span className="text-[10px] font-bold uppercase tracking-[.15em]">{labels.clients}</span></div><div className="mt-4 text-2xl font-black tracking-[-.05em]">{clients}</div><p className="mt-1 text-xs text-[var(--kram-metal)]">{labels.owners}</p></div>
      <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-5"><div className="flex items-center gap-2 text-[var(--kram-metal)]"><FileCheck2 size={16}/><span className="text-[10px] font-bold uppercase tracking-[.15em]">{labels.evidence}</span></div><div className="mt-4 text-2xl font-black tracking-[-.05em]">{inspections}</div><p className="mt-1 text-xs text-[var(--kram-metal)]">{labels.scheduledShort}</p></div>
    </section>
  </div>;
}
