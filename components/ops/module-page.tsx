import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { Locale } from "@/lib/i18n";

type ModuleCopy = {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction?: string;
  metrics: readonly { label: string; value: string; hint: string }[];
  queueTitle: string;
  queueDescription: string;
  emptyTitle: string;
  emptyDescription: string;
  workflowTitle: string;
  workflow: readonly string[];
  backLabel?: string;
  backHref?: string;
};

export function OpsModulePage({
  locale,
  copy,
  icon: Icon,
  actionHref,
}: {
  locale: Locale;
  copy: ModuleCopy;
  icon: LucideIcon;
  actionHref?: string;
}) {
  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">{copy.eyebrow}</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--kram-charcoal)] text-white">
              <Icon size={19} />
            </div>
            <h1 className="text-3xl font-bold tracking-[-0.045em] text-zinc-950 md:text-4xl">{copy.title}</h1>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">{copy.description}</p>
        </div>
        {copy.primaryAction && actionHref && <Link href={actionHref} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--kram-orange)] px-4 py-2.5 text-sm font-bold text-white shadow-sm">{copy.primaryAction}</Link>}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {copy.metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-[var(--kram-border)] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">{metric.label}</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">{metric.value}</p>
            <p className="mt-1 text-xs text-zinc-400">{metric.hint}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-[var(--kram-border)] bg-white">
          <div className="border-b border-zinc-100 px-5 py-4">
            <h2 className="text-base font-bold text-zinc-950">{copy.queueTitle}</h2>
            <p className="mt-1 text-xs text-zinc-400">{copy.queueDescription}</p>
          </div>
          <div className="min-h-80 p-6">
            <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--kram-border)] bg-[var(--kram-background)] px-6 py-10 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[var(--kram-orange)] shadow-sm">
                <Icon size={19} />
              </div>
              <h3 className="mt-4 text-sm font-bold text-zinc-900">{copy.emptyTitle}</h3>
              <p className="mt-1 max-w-md text-sm leading-6 text-zinc-500">{copy.emptyDescription}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={17} className="text-[var(--kram-orange)]" />
            <h2 className="text-base font-bold text-zinc-950">{copy.workflowTitle}</h2>
          </div>
          <div className="mt-5 space-y-2">
            {copy.workflow.map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-xl border border-zinc-100 px-3.5 py-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--kram-background)] text-[10px] font-bold text-zinc-500">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-zinc-700">{step}</span>
                {index < copy.workflow.length - 1 && <ArrowRight size={14} className="ml-auto text-zinc-300" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {copy.backHref && copy.backLabel && (
        <Link href={copy.backHref} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-950">
          <ArrowRight size={15} className="rotate-180" />
          {copy.backLabel}
        </Link>
      )}
    </div>
  );
}
