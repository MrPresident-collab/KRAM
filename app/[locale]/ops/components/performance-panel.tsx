"use client";

type TrendPoint = { label: string; created: number; completed: number; inspections: number };
type StatusPoint = { label: string; value: number };

export function PerformancePanel({ locale, trend, status }: { locale: string; trend: TrendPoint[]; status: StatusPoint[] }) {
  const labels = {
    title: locale === "fr" ? "Performance opérationnelle" : locale === "pt" ? "Desempenho operacional" : "Operational performance",
    subtitle: locale === "fr" ? "Activité réelle de votre périmètre sur les 14 derniers jours." : locale === "pt" ? "Atividade real do seu perímetro nos últimos 14 dias." : "Actual activity within your scope over the last 14 days.",
    created: locale === "fr" ? "Créées" : locale === "pt" ? "Criadas" : "Created",
    completed: locale === "fr" ? "Terminées" : locale === "pt" ? "Concluídas" : "Completed",
    inspections: locale === "fr" ? "Inspections" : locale === "pt" ? "Inspeções" : "Inspections",
    health: locale === "fr" ? "État des ordres" : locale === "pt" ? "Estado das ordens" : "Work-order health",
    empty: locale === "fr" ? "Pas assez de données pour afficher une tendance." : locale === "pt" ? "Dados insuficientes para apresentar uma tendência." : "Not enough data to show a trend.",
  };
  const maxTrend = Math.max(1, ...trend.flatMap(p => [p.created, p.completed, p.inspections]));
  const maxStatus = Math.max(1, ...status.map(p => p.value));
  const point = (value:number, index:number) => `${(index / Math.max(1, trend.length - 1)) * 100},${90 - (value / maxTrend) * 78}`;
  return <section className="grid gap-5 xl:grid-cols-[1.45fr_.55fr]">
    <div className="rounded-2xl border border-[var(--kram-border)] bg-white">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--kram-border)] px-6 py-5">
        <div><h2 className="text-[15px] font-black tracking-[-.02em] text-[var(--kram-deep)]">{labels.title}</h2><p className="mt-1 text-xs text-[var(--kram-metal)]">{labels.subtitle}</p></div>
        <div className="flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-[.12em] text-[var(--kram-metal)]">
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[var(--kram-orange)]"/>{labels.created}</span>
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[var(--kram-charcoal)]"/>{labels.completed}</span>
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[var(--kram-soft-metal)]"/>{labels.inspections}</span>
        </div>
      </div>
      <div className="px-6 pb-5 pt-6">
        {trend.length < 2 ? <div className="grid h-56 place-items-center rounded-xl bg-[var(--kram-bg)] text-center text-xs text-[var(--kram-metal)]">{labels.empty}</div> :
        <div className="relative h-56">
          <div className="absolute inset-0 flex flex-col justify-between">{[0,1,2,3].map(line=><span key={line} className="border-t border-dashed border-[var(--kram-border)]"/>)}</div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
            <polyline points={trend.map((p,i)=>point(p.created,i)).join(" ")} fill="none" stroke="var(--kram-orange)" strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points={trend.map((p,i)=>point(p.completed,i)).join(" ")} fill="none" stroke="var(--kram-charcoal)" strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points={trend.map((p,i)=>point(p.inspections,i)).join(" ")} fill="none" stroke="var(--kram-soft-metal)" strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex justify-between pt-2">{trend.filter((_,i)=>i%2===0||i===trend.length-1).map(p=><span key={p.label} className="text-[9px] font-semibold text-[var(--kram-soft-metal)]">{p.label}</span>)}</div>
        </div>}
      </div>
    </div>
    <div className="rounded-2xl border border-[var(--kram-border)] bg-white">
      <div className="border-b border-[var(--kram-border)] px-6 py-5"><h2 className="text-[15px] font-black tracking-[-.02em] text-[var(--kram-deep)]">{labels.health}</h2></div>
      <div className="space-y-5 px-6 py-6">{status.map(item=><div key={item.label}><div className="mb-2 flex items-center justify-between gap-3 text-xs"><span className="font-semibold text-[var(--kram-charcoal)]">{item.label}</span><span className="font-black text-[var(--kram-deep)]">{item.value}</span></div><div className="h-2 overflow-hidden rounded-full bg-[var(--kram-bg)]"><div className="h-full rounded-full bg-[var(--kram-orange)]" style={{width:`${(item.value/maxStatus)*100}%`}}/></div></div>)}</div>
    </div>
  </section>;
}
