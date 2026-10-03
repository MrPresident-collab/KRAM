"use client";

import { Bell, Search } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { copy, locales } from "@/lib/i18n";

const languageMeta = {
  fr: { label: "FR", flag: "🇫🇷", name: "Français" },
  en: { label: "EN", flag: "🇬🇧", name: "English" },
  pt: { label: "PT", flag: "🇵🇹", name: "Português" },
} as const;

export function OpsHeader({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--kram-border)] bg-[rgba(242,242,239,0.94)] px-5 backdrop-blur lg:px-8">
    <div className="flex min-w-0 flex-1 items-center">
      <div className="hidden max-w-md flex-1 items-center gap-2 rounded-xl border border-[var(--kram-border)] bg-white px-3 py-2 md:flex">
        <Search size={16} className="text-[var(--kram-metal)]" />
        <span className="text-sm text-zinc-400">{t.common.search} KRAM...</span>
        <kbd className="ml-auto rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] text-zinc-400">⌘K</kbd>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <div className="hidden items-center rounded-xl border border-[var(--kram-border)] bg-white p-1 sm:flex" aria-label="Language">
        {locales.map((item) => {
          const meta = languageMeta[item];
          const active = item === locale;
          return (
            <Link
              key={item}
              href={`/${item}/ops`}
              title={meta.name}
              aria-label={meta.name}
              className={`relative flex h-8 w-10 items-center justify-center overflow-hidden rounded-lg text-[11px] font-extrabold transition ${active ? "ring-2 ring-[var(--kram-orange)] ring-offset-1" : "opacity-65 hover:opacity-100"}`}
            >
              <span className="absolute inset-0 text-[25px] leading-8">{meta.flag}</span>
              <span className={`relative z-10 text-[10px] tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)] ${active ? "text-white" : "text-white"}`}>{meta.label}</span>
            </Link>
          );
        })}
      </div>

      <button aria-label={t.common.notifications} className="relative rounded-xl border border-[var(--kram-border)] bg-white p-2.5 text-zinc-600 hover:bg-zinc-50">
        <Bell size={17} />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--kram-orange)]" />
      </button>

      <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--kram-charcoal)] text-xs font-bold text-white ring-1 ring-[var(--kram-metal-soft)]">K</div>
    </div>
  </header>;
}
