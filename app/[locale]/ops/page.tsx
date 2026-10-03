import { Activity, AlertCircle, Building2, ClipboardList, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { StatCard } from "@/components/ops/stat-card";
import { copy, isLocale, type Locale } from "@/lib/i18n";

export default async function OpsDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];

  return <div className="space-y-7">
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">{t.dashboard.eyebrow}</p>
      <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div><h1 className="text-3xl font-bold tracking-[-0.045em] text-zinc-950 md:text-4xl">{t.dashboard.title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">{t.dashboard.description}</p></div>
        <span className="rounded-full border border-[var(--kram-border)] bg-white px-3 py-1.5 text-xs font-medium text-zinc-500">{t.common.today}</span>
      </div>
    </section>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard label={t.dashboard.clients} value="—" hint="CRM" icon={Users} />
      <StatCard label={t.dashboard.assets} value="—" hint="Asset registry" icon={Building2} />
      <StatCard label={t.dashboard.openWorkOrders} value="—" hint="Operations" icon={ClipboardList} />
      <StatCard label={t.dashboard.awaitingApproval} value="—" hint="Decisions" icon={AlertCircle} />
      <StatCard label={t.dashboard.activeOperations} value="—" hint="Live work" icon={Activity} />
    </section>

    <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
      <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-6">
        <div className="flex items-center justify-between"><div><h2 className="text-base font-bold text-zinc-950">{t.dashboard.needsAttention}</h2><p className="mt-1 text-xs text-zinc-400">{t.dashboard.operationsSnapshot}</p></div><AlertCircle size={18} className="text-[var(--kram-orange)]" /></div>
        <div className="mt-6 divide-y divide-zinc-100">{[t.dashboard.approval,t.dashboard.overdue,t.dashboard.verification].map((item)=><div key={item} className="flex items-center justify-between py-4"><span className="text-sm text-zinc-600">{item}</span><span className="h-7 min-w-7 rounded-full bg-zinc-100 px-2 text-center text-xs font-bold leading-7 text-zinc-500">0</span></div>)}</div>
      </div>

      <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--kram-orange)]" />
          <h2 className="text-base font-bold text-[var(--kram-orange)]">{t.dashboard.recentActivity}</h2>
        </div>
        <p className="mt-1 text-xs text-zinc-400">Your latest operational events will appear here.</p>
        <div className="mt-6 flex min-h-36 items-center justify-center rounded-xl border border-dashed border-[var(--kram-border)] bg-[var(--kram-background)] px-6 text-center">
          <div>
            <Activity size={20} className="mx-auto text-[var(--kram-metal)]" />
            <p className="mt-2 text-sm font-semibold text-zinc-700">No activity recorded yet</p>
            <p className="mt-1 text-xs text-zinc-400">Activity will populate as KRAM operations are connected.</p>
          </div>
        </div>
      </div>
    </section>
  </div>;
}
