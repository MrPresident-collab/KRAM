"use client";

import { useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, Clock3, ClipboardList, TrendingDown, TrendingUp } from "lucide-react";

type TrendPoint = { label: string; created: number; completed: number; inspections: number };
type StatusPoint = { label: string; value: number };

const PERIODS = [7, 14, 30] as const;

export function PerformancePanel({
  locale, contextLabel, trend, status, openOrders, averageResponseHours, labels,
}: {
  locale: string;
  contextLabel: string;
  trend: TrendPoint[];
  status: StatusPoint[];
  openOrders: number;
  averageResponseHours: number | null;
  labels: Record<string, string>;
}) {
  const [days, setDays] = useState<7 | 14 | 30>(30);
  const visibleTrend = trend.slice(-days);
  const completed = visibleTrend.reduce((sum, item) => sum + item.completed, 0);
  const maxTrend = Math.max(1, ...visibleTrend.flatMap(item => [item.created, item.completed, item.inspections]));
  const maxStatus = Math.max(1, ...status.map(item => item.value));
  const point = (value: number, index: number) => `${(index / Math.max(1, visibleTrend.length - 1)) * 100},${90 - (value / maxTrend) * 78}`;
  const response = averageResponseHours === null ? "—" : averageResponseHours < 1 ? `${Math.round(averageResponseHours * 60)}m` : `${averageResponseHours.toFixed(1)}h`;

  const trendLabels = {
    created: locale === "fr" ? "Créées" : locale === "pt" ? "Criadas" : "Created",
    completed: locale === "fr" ? "Terminées" : locale === "pt" ? "Concluídas" : "Completed",
    inspections: locale === "fr" ? "Inspections" : locale === "pt" ? "Inspeções" : "Inspections",
  };

  return <div className="space-y-5">
    <section className="rounded-2xl border border-[var(--kram-border)] bg-white">
      <div className="flex flex-col gap-4 border-b border-[var(--kram-border)] px-5 py-5 sm:flex-row sm:items-end sm:justify-between md:px-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-[var(--kram-orange)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--kram-orange)]" />{labels.title}</div>
          <h1 className="mt-2 text-2xl font-black tracking-[-.045em] text-[var(--kram-deep)] md:text-3xl">{contextLabel}</h1>
          <p className="mt-1 text-xs text-[var(--kram-metal)]">{labels.period}</p>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-[var(--kram-border)] bg-[var(--kram-bg)] p-1">
          {PERIODS.map(value => <button key={value} type="button" onClick={() => setDays(value)} className={`rounded-lg px-3 py-2 text-[10px] font-black transition ${days === value ? "bg-[var(--kram-orange)] text-white shadow-sm" : "text-[var(--kram-metal)] hover:text-[var(--kram-deep)]"}`}>{value}d</button>)}
        </div>
      </div>

      <div className="grid gap-px bg-[var(--kram-border)] sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={ClipboardList} label={labels.open} value={openOrders} note={locale === "fr" ? "Actuellement ouverts" : locale === "pt" ? "Atualmente abertas" : "Currently open"} />
        <Kpi icon={CheckCircle2} label={labels.completed} value={completed} note={locale === "fr" ? "Sur la période" : locale === "pt" ? "No período" : "In selected period"} accent />
        <Kpi icon={Clock3} label={labels.response} value={response} note={labels.responseNote} />
        <Kpi icon={AlertTriangle} label={labels.overdue} value="—" note={labels.notTracked} muted />
      </div>
    </section>

    <section className="grid gap-5 xl:grid-cols-[1.45fr_.55fr]">
      <div className="rounded-2xl border border-[var(--kram-border)] bg-white">
        <div className="border-b border-[var(--kram-border)] px-6 py-5">
          <div className="flex items-center justify-between gap-3">
            <div><h2 className="text-[15px] font-black tracking-[-.02em] text-[var(--kram-deep)]">Work Order Activity</h2><p className="mt-1 text-xs text-[var(--kram-metal)]">{labels.period}</p></div>
            <Activity size={17} className="text-[var(--kram-orange)]"/>
          </div>
        </div>
        <div className="px-6 pb-5 pt-6">
          {visibleTrend.length < 2 || maxTrend === 0 ? <div className="grid h-56 place-items-center rounded-xl bg-[var(--kram-bg)] px-6 text-center"><div><p className="text-sm font-bold text-[var(--kram-deep)]">{locale === "fr" ? "Aucune activité opérationnelle" : locale === "pt" ? "Sem atividade operacional" : "No operational activity"}</p><p className="mt-1 text-xs text-[var(--kram-metal)]">{locale === "fr" ? "Les tendances apparaîtront avec les premiers ordres ou inspections." : locale === "pt" ? "As tendências aparecerão com as primeiras ordens ou inspeções." : "Trends will appear once work orders or inspections are created."}</p></div></div> :
          <div className="relative h-56">
            <div className="absolute inset-0 flex flex-col justify-between">{[0,1,2,3].map(line => <span key={line} className="border-t border-dashed border-[var(--kram-border)]"/>)}</div>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
              <polyline points={visibleTrend.map((item,index)=>point(item.created,index)).join(" ")} fill="none" stroke="var(--kram-orange)" strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points={visibleTrend.map((item,index)=>point(item.completed,index)).join(" ")} fill="none" stroke="var(--kram-charcoal)" strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points={visibleTrend.map((item,index)=>point(item.inspections,index)).join(" ")} fill="none" stroke="var(--kram-soft-metal)" strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex justify-between pt-2">{visibleTrend.filter((_,index)=>index % Math.max(1, Math.ceil(visibleTrend.length / 7)) === 0 || index === visibleTrend.length - 1).map(item=><span key={item.label} className="text-[9px] font-semibold text-[var(--kram-soft-metal)]">{item.label}</span>)}</div>
          </div>}
          <div className="mt-4 flex flex-wrap gap-4 text-[10px] font-bold text-[var(--kram-metal)]"><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[var(--kram-orange)]"/>{trendLabels.created}</span><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[var(--kram-charcoal)]"/>{trendLabels.completed}</span><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[var(--kram-soft-metal)]"/>{trendLabels.inspections}</span></div>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--kram-border)] bg-white">
        <div className="border-b border-[var(--kram-border)] px-6 py-5"><h2 className="text-[15px] font-black tracking-[-.02em] text-[var(--kram-deep)]">{labels.health}</h2><p className="mt-1 text-xs text-[var(--kram-metal)]">{locale === "fr" ? "Répartition des ordres de travail" : locale === "pt" ? "Distribuição das ordens de trabalho" : "Current work-order distribution"}</p></div>
        <div className="space-y-4 px-6 py-6">{status.length === 0 ? <div className="rounded-xl bg-[var(--kram-bg)] px-5 py-8 text-center"><p className="text-sm font-bold text-[var(--kram-deep)]">{locale === "fr" ? "Aucune ordre de travail" : locale === "pt" ? "Nenhuma ordem de trabalho" : "No work orders yet"}</p></div> : status.map(item => <div key={item.label}><div className="mb-2 flex items-center justify-between text-xs"><span className="font-semibold text-[var(--kram-charcoal)]">{item.label}</span><span className="font-black text-[var(--kram-deep)]">{item.value}</span></div><div className="h-2 overflow-hidden rounded-full bg-[var(--kram-bg)]"><div className="h-full rounded-full bg-[var(--kram-orange)]" style={{width:`${(item.value / maxStatus) * 100}%`}}/></div></div>)}</div>
      </div>
    </section>
  </div>;
}

function Kpi({ icon: Icon, label, value, note, accent, muted }: { icon: typeof ClipboardList; label: string; value: number | string; note: string; accent?: boolean; muted?: boolean }) {
  return <div className={`min-h-[150px] bg-white p-5 md:p-6 ${muted ? "opacity-75" : ""}`}>
    <div className="flex items-center justify-between">
      <div className={`grid h-9 w-9 place-items-center rounded-xl ${accent ? "bg-[var(--kram-orange-soft)] text-[var(--kram-orange)]" : "bg-[var(--kram-bg)] text-[var(--kram-metal)]"}`}><Icon size={17}/></div>
      {accent && <TrendingUp size={15} className="text-[var(--kram-orange)]"/>}
      {muted && <span className="text-[9px] font-black uppercase tracking-[.14em] text-[var(--kram-soft-metal)]">—</span>}
    </div>
    <div className="mt-5 text-3xl font-black tracking-[-.06em] text-[var(--kram-deep)]">{value}</div>
    <div className="mt-1 text-[13px] font-black text-[var(--kram-charcoal)]">{label}</div>
    <div className="mt-1 text-[10px] font-medium leading-4 text-[var(--kram-metal)]">{note}</div>
  </div>;
}
