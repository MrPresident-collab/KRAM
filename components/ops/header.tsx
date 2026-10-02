"use client";

import { Bell, Search } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { copy, locales } from "@/lib/i18n";

export function OpsHeader({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--kram-border)] bg-[rgba(247,247,245,0.92)] px-5 backdrop-blur lg:px-8">
    <div className="flex min-w-0 flex-1 items-center">
      <div className="hidden max-w-md flex-1 items-center gap-2 rounded-lg border border-[var(--kram-border)] bg-white px-3 py-2 md:flex">
        <Search size={16} className="text-zinc-400" />
        <span className="text-sm text-zinc-400">{t.common.search} KRAM...</span>
        <kbd className="ml-auto rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] text-zinc-400">⌘K</kbd>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="hidden items-center rounded-lg border border-[var(--kram-border)] bg-white p-1 sm:flex">
        {locales.map((item) => <Link key={item} href={`/${item}/ops`} className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase ${item === locale ? "bg-[var(--kram-black)] text-white" : "text-zinc-500"}`}>{item}</Link>)}
      </div>
      <button aria-label={t.common.notifications} className="relative rounded-lg border border-[var(--kram-border)] bg-white p-2.5 text-zinc-600 hover:bg-zinc-50">
        <Bell size={17} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--kram-orange)]" />
      </button>
      <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--kram-black)] text-xs font-bold text-white">K</div>
    </div>
  </header>;
}
