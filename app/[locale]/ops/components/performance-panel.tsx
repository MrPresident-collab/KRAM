"use client";

import { useState } from "react";

type TrendPoint = { label: string; created: number; completed: number; inspections: number };
type StatusPoint = { label: string; value: number };

const PERIODS = [7, 14, 30] as const;

export function PerformancePanel({ locale, trend, status }: { locale: string; trend: TrendPoint[]; status: StatusPoint[] }) {
  const labels = {
    title: locale === "fr" ? "Performance opérationnelle" : locale === "pt" ? "Desempenho operacional" : "Operational performance",
    subtitle: locale === "fr" ? "Activité réelle de votre périmètre sur la période sélectionnée." : locale === "pt" ? "Atividade real do seu perímetro no período selecionado." : "Actual activity within your scope for the selected period.",
    created: locale === "fr" ? "Créées" : locale === "pt" ? "Criadas" : "Created",
    completed: locale === "fr" ? "Terminées" : locale === "pt" ? "Concluídas" : "Completed",
    inspections: locale === "fr" ? "Inspections" : locale === "pt" ? "Inspeções" : "Inspections",
    health: locale === "fr" ? "État des ordres" : locale === "pt" ? "Estado das ordens" : "Work-order health",
    empty: locale === "fr" ? "Aucune activité opérationnelle enregistrée sur cette période." : locale === "pt" ? "Não há atividade operacional registada neste período." : "No operational activity recorded for this period.",
    emptyHint: locale === "fr" ? "Les tendances apparaîtront lorsque des ordres ou inspections seront créés." : locale === "pt" ? "As tendências aparecerão quando forem criadas ordens ou inspeções." : "Trends will appear once work orders or inspections are created.",
    noOrders: locale === "fr" ? "Aucun ordre de travail" : locale === "pt" ? "Nenhuma ordem de trabalho" : "No work orders yet",
    noOrdersHint: locale === "fr" ? "Créez votre premier ordre pour commencer à suivre l’état opérationnel." : locale === "pt" ? "Crie a sua primeira ordem para começar a acompanhar o estado operacional." : "Create your first work order to start tracking operational health.",
    period: locale === "fr" ? "Période" : locale === "pt" ? "Período" : "Period",
  };

  const [days, setDays] = useState<7 | 14 | 30>(14);
  const visibleTrend = trend.slice(-days);
  const maxTrend = Math.max(1, ...visibleTrend.flatMap(p => [p.created, p.completed, p.inspections]));
  const maxStatus = Math.max(1, ...status.map(p => p.value));
  const point = (value: number, index: number) => `${(index / Math.max(1, visibleTrend.length - 1)) * 100},${90 - (value / maxTrend) * 78}`;

  return <section className="grid gap-5 xl:grid-cols-[1.45fr_.55fr]">
    <div className="rounded-2xl border border-[var(--kram-border)] bg-white">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--kram-border)] px-6 py-5">
        <div><h2 className="text-[15px] font-black tracking-[-.02em] text-[var(--kram-deep)]">{labels.title}</h2><p className="mt-1 text-xs text-[var(--kram-metal)]">{labels.subtitle}</p></div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[10px] font-bold uppercase tracking-[.12em] text-[var(--kram-metal)]">{labels.period}</span>
          {PERIODS.map(value => <button key={value} type="button" onClick={() => setDays(value)} className={`rounded-lg px-2.5 py-1.5 text-[10px] font-black transition ${days === value ? "bg-[var(--kram-orange)] text-white" : "bg-[var(--kram-bg)] text-[var(--kram-metal)] hover:text-[var(--kram-deep)]"}`}>{value}d</button>)}
        </div>
      </div>
      <div className="px-6 pb-5 pt-6">
        {visibleTrend.length < 2 || maxTrend === 0 ? <div className="grid h-56 place-items-center rounded-xl bg-[var(--kram-bg)] px-6 text-center"><div><p className="text-sm font-bold text-[var(--kram-deep)]">{labels.empty}</p><p className="mt-1 text-xs text-[var(--kram-metal)]">{labels.emptyHint}</p></div></div> :
        <div className="relative h-56">
          <div className="absolute inset-0 flex flex-col justify-between">{[0,1,2,3].map(line=><span key={line} className="border-t border-dashed border-[var(--kram-border)]"/>)}</div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
            <polyline points={visibleTrend.map((p,i)=>point(p.created,i)).join(" ")} fill="none" stroke="var(--kram-orange)" strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points={visibleTrend.map((p,i)=>point(p.completed,i)).join(" ")} fill="none" stroke="var(--kram-charcoal)" strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points={visibleTrend.map((p,i)=>point(p.inspections,i)).join(" ")} fill="none" stroke="var(--kram-soft-metal)" strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex justify-between pt-2">{visibleTrend.filter((_,i)=>i % Math.max(1, Math.ceil(visibleTrend.length / 7)) === 0 || i === visibleTrend.length - 1).map(p=><span key={p.label} className="text-[9px] font-semibold text-[var(--kram-soft-metal)]">{p.label}</span>)}</div>
        </div>}
      </div>
    </div>
    <div className="rounded-2xl border border-[var(--kram-border)] bg-white">
      <div className="border-b border-[var(--kram-border)] px-6 py-5"><h2 className="text-[15px] font-black tracking-[-.02em] text-[var(--kram-deep)]">{labels.health}</h2></div>
      <div className="space-y-5 px-6 py-6">{status.length === 0 ? <div className="rounded-xl bg-[var(--kram-bg)] px-5 py-8 text-center"><p className="text-sm font-bold text-[var(--kram-deep)]">{labels.noOrders}</p><p className="mt-1 text-xs leading-5 text-[var(--kram-metal)]">{labels.noOrdersHint}</p></div> : status.map(item=><div key={item.label}><div className="mb-2 flex items-center justify-between gap-3 text-xs"><span className="font-semibold text-[var(--kram-charcoal)]">{item.label}</span><span className="font-black text-[var(--kram-deep)]">{item.value}</span></div><div className="h-2 overflow-hidden rounded-full bg-[var(--kram-bg)]"><div className="h-full rounded-full bg-[var(--kram-orange)]" style={{width:`${(item.value/maxStatus)*100}%`}}/></div></div>)}</div>
    </div>
  </section>;
}
