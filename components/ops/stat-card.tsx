import type { LucideIcon } from "lucide-react";

export function StatCard({ label, value, hint, icon: Icon }: { label: string; value: string; hint: string; icon: LucideIcon }) {
  return <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-5">
    <div className="flex items-start justify-between">
      <div><p className="text-xs font-semibold text-zinc-500">{label}</p><p className="mt-2 text-3xl font-bold tracking-[-0.04em] text-zinc-950">{value}</p></div>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--kram-orange-soft)] text-[var(--kram-orange)]"><Icon size={17} /></div>
    </div>
    <p className="mt-4 text-[11px] text-zinc-400">{hint}</p>
  </div>;
}
