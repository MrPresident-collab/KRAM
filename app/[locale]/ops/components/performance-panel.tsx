"use client";

import { useState } from "react";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, ClipboardList, Coins, ShieldCheck, Users } from "lucide-react";

type AssetRow = { id: string; name: string; reference_code: string; status: string; site: string };
type SiteRow = { name: string; total: number; healthy: number; percent: number };

export function PerformancePanel({
  locale, contextLabel, assetsTotal, assetsActive, attentionAssets, maintenanceSpend, openOrders, completedOrders, providers, clients, attentionRows, sites,
}: {
  locale: string;
  contextLabel: string;
  assetsTotal: number;
  assetsActive: number;
  attentionAssets: number;
  maintenanceSpend: number;
  openOrders: number;
  completedOrders: number;
  providers: number;
  clients: number;
  attentionRows: AssetRow[];
  sites: SiteRow[];
}) {
  const [days, setDays] = useState<30 | 60 | 90>(30);
  const labels = locale === "fr" ? {
    title: "Vue de gestion des actifs", assets: "Actifs gérés", healthy: "Actifs en bon état", attention: "Actifs à surveiller", spend: "Dépenses de maintenance", open: "Ordres ouverts", completed: "Terminés", work: "Performance des interventions", attentionTitle: "Actifs nécessitant une attention", attentionEmpty: "Aucun actif ne nécessite actuellement une attention.", sites: "État des actifs par site", team: "Performance de l’équipe", providers: "Prestataires actifs", clients: "Clients gérés", days: "jours", notEnough: "Données insuffisantes", noAssets: "Aucun actif n’est encore enregistré.", siteEmpty: "Les données de site apparaîtront lorsque les actifs seront enregistrés.", period: "Période", view: "Voir", managed: "sous gestion", current: "actuellement", orders: "ordres de travail", 
  } : locale === "pt" ? {
    title: "Visão geral da gestão de ativos", assets: "Ativos geridos", healthy: "Ativos em bom estado", attention: "Ativos que precisam de atenção", spend: "Despesas de manutenção", open: "Ordens abertas", completed: "Concluídas", work: "Desempenho das intervenções", attentionTitle: "Ativos que precisam de atenção", attentionEmpty: "Nenhum ativo requer atenção neste momento.", sites: "Saúde dos ativos por local", team: "Desempenho da equipa", providers: "Prestadores ativos", clients: "Clientes geridos", days: "dias", notEnough: "Dados insuficientes", noAssets: "Ainda não existem ativos registados.", siteEmpty: "Os dados por local aparecerão quando os ativos forem registados.", period: "Período", view: "Ver", managed: "sob gestão", current: "atualmente", orders: "ordens de trabalho",
  } : {
    title: "Asset Management Overview", assets: "Managed Assets", healthy: "Assets in good standing", attention: "Assets Requiring Attention", spend: "Maintenance Spend", open: "Open Work Orders", completed: "Completed", work: "Work Order Performance", attentionTitle: "Assets Requiring Attention", attentionEmpty: "No assets currently require attention.", sites: "Asset Health by Site", team: "Team Performance", providers: "Active Providers", clients: "Managed Clients", days: "days", notEnough: "Not enough data", noAssets: "No assets have been registered yet.", siteEmpty: "Site health will appear as assets are registered.", period: "Period", view: "View", managed: "under management", current: "currently", orders: "work orders",
  };

  const currency = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : locale === "pt" ? "pt-PT" : "en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const health = assetsTotal ? Math.round((assetsActive / assetsTotal) * 1000) / 10 : null;

  return <div className="space-y-6">
    <section className="rounded-2xl border border-[var(--kram-border)] bg-white">
      <div className="flex flex-col gap-4 border-b border-[var(--kram-border)] px-5 py-5 sm:flex-row sm:items-end sm:justify-between md:px-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[.2em] text-[var(--kram-orange)]">{labels.title}</p>
          <h1 className="mt-2 text-2xl font-black tracking-[-.05em] text-[var(--kram-deep)] md:text-3xl">{contextLabel}</h1>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-[var(--kram-border)] bg-[var(--kram-bg)] p-1">
          {[30,60,90].map(value => <button key={value} type="button" onClick={() => setDays(value as 30|60|90)} className={`rounded-lg px-3 py-2 text-[10px] font-black ${days===value ? "bg-[var(--kram-orange)] text-white" : "text-[var(--kram-metal)]"}`}>{value}d</button>)}
        </div>
      </div>

      <div className="grid gap-px bg-[var(--kram-border)] sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={ShieldCheck} label={labels.assets} value={assetsTotal} note={labels.managed} />
        <Kpi icon={AlertTriangle} label={labels.attention} value={attentionAssets} note={assetsTotal ? `${health}% ${labels.healthy}` : labels.noAssets} alert={attentionAssets > 0} />
        <Kpi icon={Coins} label={labels.spend} value={maintenanceSpend > 0 ? currency.format(maintenanceSpend) : "—"} note={maintenanceSpend > 0 ? `${labels.period}: ${days} ${labels.days}` : labels.notEnough} />
        <Kpi icon={ClipboardList} label={labels.open} value={openOrders} note={`${completedOrders} ${labels.completed.toLowerCase()} ${labels.period.toLowerCase()}`} />
      </div>
    </section>

    <section className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
      <div className="rounded-2xl border border-[var(--kram-border)] bg-white">
        <Header title={labels.attentionTitle} subtitle={`${attentionAssets} ${labels.current}`} />
        {attentionRows.length ? <div className="divide-y divide-[var(--kram-border)]">{attentionRows.map(row => <div key={row.id} className="flex items-center justify-between gap-4 px-6 py-4"><div className="min-w-0"><p className="truncate text-sm font-bold text-[var(--kram-deep)]">{row.name}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-[.1em] text-[var(--kram-soft-metal)]">{row.reference_code} · {row.site || "Site not assigned"}</p></div><span className="shrink-0 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-black text-[var(--kram-orange)]">{row.status}</span></div>)}</div> : <Empty text={assetsTotal ? labels.attentionEmpty : labels.noAssets}/>}
      </div>

      <div className="rounded-2xl bg-[var(--kram-charcoal)] p-6 text-white">
        <p className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--kram-orange)]">{labels.team}</p>
        <div className="mt-6 grid grid-cols-2 gap-5">
          <Metric value={providers} label={labels.providers}/>
          <Metric value={clients} label={labels.clients}/>
        </div>
        <div className="mt-7 border-t border-white/10 pt-5"><p className="text-3xl font-black tracking-[-.05em]">{openOrders}</p><p className="mt-1 text-xs text-white/50">{labels.open.toLowerCase()} · {completedOrders} {labels.completed.toLowerCase()}</p></div>
      </div>
    </section>

    <section className="rounded-2xl border border-[var(--kram-border)] bg-white">
      <Header title={labels.work} subtitle={`${openOrders} ${labels.open.toLowerCase()} · ${completedOrders} ${labels.completed.toLowerCase()}`}/>
      <div className="grid gap-px bg-[var(--kram-border)] sm:grid-cols-2">
        <div className="bg-white p-6"><p className="text-[10px] font-black uppercase tracking-[.16em] text-[var(--kram-metal)]">{labels.open}</p><p className="mt-3 text-4xl font-black tracking-[-.06em] text-[var(--kram-deep)]">{openOrders}</p><div className="mt-4 h-2 rounded-full bg-[var(--kram-bg)]"><div className="h-full rounded-full bg-[var(--kram-orange)]" style={{width: openOrders+completedOrders ? `${Math.round((openOrders/(openOrders+completedOrders))*100)}%` : "0%"}}/></div></div>
        <div className="bg-white p-6"><p className="text-[10px] font-black uppercase tracking-[.16em] text-[var(--kram-metal)]">{labels.completed}</p><p className="mt-3 text-4xl font-black tracking-[-.06em] text-[var(--kram-deep)]">{completedOrders}</p><div className="mt-4 h-2 rounded-full bg-[var(--kram-bg)]"><div className="h-full rounded-full bg-[var(--kram-charcoal)]" style={{width: openOrders+completedOrders ? `${Math.round((completedOrders/(openOrders+completedOrders))*100)}%` : "0%"}}/></div></div>
      </div>
    </section>

    <section className="rounded-2xl border border-[var(--kram-border)] bg-white">
      <Header title={labels.sites} subtitle={sites.length ? `${sites.length} sites` : labels.siteEmpty}/>
      {sites.length ? <div className="divide-y divide-[var(--kram-border)]">{sites.map(site => <div key={site.name} className="grid grid-cols-[110px_1fr_48px] items-center gap-4 px-6 py-4"><span className="truncate text-xs font-bold text-[var(--kram-charcoal)]">{site.name}</span><div className="h-2 overflow-hidden rounded-full bg-[var(--kram-bg)]"><div className="h-full rounded-full bg-[var(--kram-orange)]" style={{width:`${site.percent}%`}}/></div><span className="text-right text-xs font-black text-[var(--kram-deep)]">{site.percent}%</span></div>)}</div> : <Empty text={labels.siteEmpty}/>}
    </section>
  </div>;
}

function Kpi({icon:Icon,label,value,note,alert}:{icon:typeof ShieldCheck;label:string;value:number|string;note:string;alert?:boolean}) {
  return <div className="min-h-[154px] bg-white p-5 md:p-6"><div className="flex items-center justify-between"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--kram-bg)] text-[var(--kram-metal)]"><Icon size={17}/></div>{alert ? <ArrowUpRight size={15} className="text-[var(--kram-orange)]"/> : null}</div><p className="mt-5 text-3xl font-black tracking-[-.06em] text-[var(--kram-deep)]">{value}</p><p className="mt-1 text-[13px] font-black text-[var(--kram-charcoal)]">{label}</p><p className="mt-1 text-[10px] leading-4 text-[var(--kram-metal)]">{note}</p></div>;
}
function Header({title,subtitle}:{title:string;subtitle:string}) { return <div className="border-b border-[var(--kram-border)] px-6 py-5"><h2 className="text-[15px] font-black tracking-[-.02em] text-[var(--kram-deep)]">{title}</h2><p className="mt-1 text-xs text-[var(--kram-metal)]">{subtitle}</p></div>; }
function Empty({text}:{text:string}) { return <div className="px-6 py-10 text-center text-xs text-[var(--kram-metal)]">{text}</div>; }
function Metric({value,label}:{value:number;label:string}) { return <div><p className="text-3xl font-black tracking-[-.05em]">{value}</p><p className="mt-1 text-[10px] text-white/50">{label}</p></div>; }
