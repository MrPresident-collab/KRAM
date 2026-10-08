"use client";

import {
  AlertTriangle,
  Building2,
  ClipboardList,
  Coins,
} from "lucide-react";

type AssetRow = { id: string; name: string; reference_code: string; status: string; site: string };
type SiteRow = { name: string; total: number; healthy: number; percent: number };

export function PerformancePanel({
  locale,
  contextLabel,
  assetsTotal,
  assetsActive,
  attentionAssets,
  maintenanceSpend,
  defaultCurrency,
  openOrders,
  completedOrders,
  providers,
  clients,
  attentionRows,
  sites,
}: {
  locale: string;
  contextLabel: string;
  assetsTotal: number;
  assetsActive: number;
  attentionAssets: number;
  maintenanceSpend: number;
  defaultCurrency: string;
  openOrders: number;
  completedOrders: number;
  providers: number;
  clients: number;
  attentionRows: AssetRow[];
  sites: SiteRow[];
}) {
  const numberLocale = locale === "fr" ? "fr-FR" : locale === "pt" ? "pt-PT" : "en-US";
  const formattedSpend = maintenanceSpend > 0
    ? new Intl.NumberFormat(numberLocale, { style: "currency", currency: defaultCurrency, maximumFractionDigits: 0 }).format(maintenanceSpend)
    : "—";

  const activeShare = assetsTotal > 0 ? Math.round((assetsActive / assetsTotal) * 100) : 0;
  const totalCompleted = openOrders + completedOrders;
  const openShare = totalCompleted > 0 ? Math.round((openOrders / totalCompleted) * 100) : 0;

  const labels =
    locale === "fr"
      ? {
          title: "Vue de gestion des actifs",
          assets: "Actifs gérés",
          attention: "Actifs à surveiller",
          spend: "Dépenses de maintenance",
          open: "Ordres ouverts",
          completed: "Clos",
          healthy: "actifs actifs",
          assetHealth: "Santé des actifs par site",
          attentionTitle: "Actifs nécessitant une attention",
          workload: "Charge opérationnelle",
          providers: "Prestataires",
          clients: "Clients",
          noAssets: "Aucune donnée d’actif pour le moment.",
          noAttention: "Aucun actif n’a besoin d’attention pour le moment.",
          noSites: "Aucune donnée de site disponible pour le moment.",
          noSpend: "Aucune dépense enregistrée.",
          noWork: "Aucun volume d’ordres enregistré.",
        }
      : locale === "pt"
        ? {
            title: "Visão geral da gestão de ativos",
            assets: "Ativos geridos",
            attention: "Ativos a vigiar",
            spend: "Despesas de manutenção",
            open: "Ordens abertas",
            completed: "Concluídas",
            healthy: "ativos ativos",
            assetHealth: "Saúde dos ativos por local",
            attentionTitle: "Ativos que requerem atenção",
            workload: "Carga operacional",
            providers: "Prestadores",
            clients: "Clientes",
            noAssets: "Ainda não há dados de ativos.",
            noAttention: "Nenhum ativo requer atenção neste momento.",
            noSites: "Ainda não há dados de locais.",
            noSpend: "Nenhuma despesa registada.",
            noWork: "Ainda não há volume de ordens registado.",
          }
        : {
            title: "Asset Management Overview",
            assets: "Managed Assets",
            attention: "Assets Requiring Attention",
            spend: "Maintenance Spend",
            open: "Open Work Orders",
            completed: "Completed",
            healthy: "active assets",
            assetHealth: "Asset health by site",
            attentionTitle: "Assets requiring attention",
            workload: "Operational workload",
            providers: "Providers",
            clients: "Clients",
            noAssets: "No asset data yet.",
            noAttention: "No assets currently require attention.",
            noSites: "No site data available yet.",
            noSpend: "No spend recorded yet.",
            noWork: "No work order volume recorded yet.",
          };

  const kpis = [
    {
      icon: Building2,
      label: labels.assets,
      value: String(assetsTotal),
      note: assetsTotal ? `${activeShare}% ${labels.healthy}` : labels.noAssets,
    },
    {
      icon: AlertTriangle,
      label: labels.attention,
      value: String(attentionAssets),
      note: attentionAssets ? String(attentionAssets) : labels.noAttention,
      alert: attentionAssets > 0,
    },
    {
      icon: Coins,
      label: labels.spend,
      value: formattedSpend || "—",
      note: formattedSpend ? defaultCurrency : labels.noSpend,
    },
    {
      icon: ClipboardList,
      label: labels.open,
      value: String(openOrders),
      note: totalCompleted ? `${completedOrders} ${labels.completed.toLowerCase()}` : labels.noWork,
    },
  ];

  return (
    <div className="space-y-6 pb-4">
      <section className="overflow-hidden rounded-3xl border border-[var(--kram-border)] bg-[var(--kram-surface)] shadow-[0_12px_28px_rgba(24,24,24,0.05)]">
        <div className="flex flex-col gap-3 border-b border-[var(--kram-border)] bg-[var(--kram-bg)] px-5 py-5 md:flex-row md:items-end md:justify-between md:px-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--kram-orange)]">{labels.title}</p>
            <h1 className="mt-2 text-2xl font-black tracking-[-0.06em] text-[var(--kram-deep)] md:text-3xl">{contextLabel}</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--kram-border)] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--kram-metal)]">

          </div>
        </div>

        <div className="grid gap-px bg-[var(--kram-border)] md:grid-cols-2 xl:grid-cols-4">
          {kpis.map(({ icon: Icon, label, value, note, alert }) => (
            <div key={label} className="min-h-[170px] bg-white p-5 md:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kram-metal)]">{label}</p>
                  <p className="mt-3 break-words text-3xl font-black tracking-[-0.06em] text-[var(--kram-deep)]">{value}</p>
                </div>
                <div className={"flex h-10 w-10 shrink-0 items-center justify-center rounded-xl " + (alert ? "bg-[var(--kram-orange-soft)] text-[var(--kram-orange)]" : "bg-[var(--kram-bg)] text-[var(--kram-charcoal)]")}>
                  <Icon size={18} />
                </div>
              </div>
              <p className="mt-5 text-[11px] leading-5 text-[var(--kram-metal)]">{note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-[var(--kram-border)] bg-white">
          <div className="border-b border-[var(--kram-border)] px-5 py-4 md:px-6">
            <h2 className="text-base font-black tracking-[-0.03em] text-[var(--kram-deep)]">{labels.assetHealth}</h2>
          </div>
          <div className="space-y-4 p-5 md:p-6">
            {sites.length ? sites.map((site) => (
              <div key={site.name} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-[var(--kram-deep)]">{site.name}</span>
                  <span className="font-semibold text-[var(--kram-metal)]">{site.percent}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[var(--kram-bg)]">
                  <div className="h-full rounded-full bg-[var(--kram-orange)]" style={{ width: `${Math.max(6, site.percent)}%` }} />
                </div>
              </div>
            )) : (
              <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-[var(--kram-border)] bg-[var(--kram-bg)] px-4 py-10 text-center text-sm text-[var(--kram-metal)]">{labels.noSites}</div>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-[var(--kram-charcoal)] p-6 text-white shadow-[0_18px_35px_rgba(36,36,36,0.18)]">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--kram-orange)]">{labels.workload}</p>
          <div className="mt-6 flex items-center justify-center">
            <div className="relative grid h-36 w-36 place-items-center rounded-full" style={{ background: `conic-gradient(var(--kram-orange) 0 ${openShare}%, rgba(255,255,255,0.12) ${openShare}% 100%)` }}>
              <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--kram-charcoal)] text-center">
                <div>
                  <p className="text-2xl font-black tracking-[-0.06em]">{openOrders}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/65">{labels.open}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/4 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">{labels.open}</p><p className="mt-2 text-2xl font-black tracking-[-0.05em]">{openOrders}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/4 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">{labels.completed}</p><p className="mt-2 text-2xl font-black tracking-[-0.05em]">{completedOrders}</p></div>
          </div>
          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="flex items-center justify-between text-[11px] text-white/70"><span>{labels.providers}</span><span className="font-bold text-white">{providers}</span></div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-white/70"><span>{labels.clients}</span><span className="font-bold text-white">{clients}</span></div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--kram-border)] bg-white">
        <div className="border-b border-[var(--kram-border)] px-5 py-4 md:px-6"><h2 className="text-base font-black tracking-[-0.03em] text-[var(--kram-deep)]">{labels.attentionTitle}</h2></div>
        {attentionRows.length ? (
          <div className="divide-y divide-[var(--kram-border)]">
            {attentionRows.slice(0, 6).map((row) => (
              <div key={row.id} className="flex flex-col items-start justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center md:px-6">
                <div className="min-w-0"><p className="truncate text-sm font-bold text-[var(--kram-deep)]">{row.name}</p><p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[var(--kram-metal)]">{row.reference_code}</p></div>
                <div className="flex max-w-full items-center gap-3"><span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--kram-orange)]">{row.status}</span><span className="truncate text-[11px] text-[var(--kram-metal)]">{row.site}</span></div>
              </div>
            ))}
          </div>
        ) : <div className="flex min-h-[140px] items-center justify-center px-6 py-10 text-center text-sm text-[var(--kram-metal)]">{labels.noAttention}</div>}
      </section>
    </div>
  );
}

export default PerformancePanel;
