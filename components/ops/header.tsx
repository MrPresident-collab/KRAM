"use client";
import { Bell, Search } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { copy } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/ops/language-switcher";
import { UserMenu } from "@/components/ops/user-menu";

type Props = { locale: Locale; user: { name: string; email: string; role: string; scope: string; avatarUrl?: string | null } };

export function OpsHeader({ locale, user }: Props) {
  const t = copy[locale];
  return <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--kram-border)] bg-[rgba(243,243,240,0.94)] px-5 backdrop-blur lg:px-8">
    <div className="flex min-w-0 flex-1 items-center"><div className="hidden max-w-md flex-1 items-center gap-2 rounded-xl border border-[var(--kram-border)] bg-white px-3 py-2 md:flex"><Search size={16} className="text-[var(--kram-metal)]" /><span className="text-sm text-zinc-400">{t.common.search} KRAM...</span><kbd className="ml-auto rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] text-zinc-400">⌘K</kbd></div></div>
    <div className="flex items-center gap-2"><LanguageSwitcher locale={locale} /><button aria-label={t.common.notifications} className="relative rounded-xl border border-[var(--kram-border)] bg-white p-2.5 text-zinc-600 hover:bg-zinc-50"><Bell size={17} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--kram-orange)]" /></button><UserMenu locale={locale} user={user} /></div>
  </header>;
}
