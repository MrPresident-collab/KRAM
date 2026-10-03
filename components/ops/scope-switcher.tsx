"use client";

import { ChevronDown, Globe2 } from "lucide-react";

export function ScopeSwitcher() {
  return (
    <button type="button" className="flex items-center gap-3 rounded-xl border border-[var(--kram-border)] bg-white px-3 py-2 text-left shadow-sm hover:bg-zinc-50">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--kram-black)] text-white"><Globe2 size={15} /></span>
      <span className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Operational scope</span><span className="block truncate text-sm font-semibold text-zinc-900">Global</span></span>
      <ChevronDown size={15} className="ml-2 text-zinc-400" />
    </button>
  );
}
