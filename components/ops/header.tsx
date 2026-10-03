"use client";
import { Bell, Search, CircleHelp } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { copy } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/ops/language-switcher";
import { UserMenu } from "@/components/ops/user-menu";

type Props = { locale: Locale; user: { name: string; email: string; role: string; scope: string; avatarUrl?: string | null } };

export function OpsHeader({ locale, user }: Props) {
  const t = copy[locale];
  return <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[var(--kram-border)] bg-[rgba(243,243,240,.92)] px-5 backdrop-blur-xl lg:px-9"><div className="flex min-w-0 flex-1 items-center gap-5"><div className="hidden h-10 max-w-[460px] flex-1 items-center gap-3 rounded-xl border border-[var(--kram-border)] bg-white px-3.5 shadow-[0_1px_2px_rgba(0,0,0,.02)] md:flex"><Search size={16} className="text-[var(--kram-metal)]" /><span className="text-[13px] text-[var(--kram-metal)]">{t.common.search} assets, orders, clients…</span><kbd className="ml-auto rounded-md border border-[var(--kram-border)] bg-[var(--kram-bg)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--kram-metal)]">⌘ K</kbd></div><div className="hidden items-center gap-2 text-[11px] font-semibold text-[var(--kram-metal)] xl:flex"><span className="h-2 w-2 rounded-full bg-[var(--kram-green)]" /> All systems operational</div></div><div className="flex items-center gap-2.5"><button aria-label="Help" className="hidden rounded-xl p-2.5 text-[var(--kram-metal)] hover:bg-white sm:block"><CircleHelp size={17} /></button><LanguageSwitcher locale={locale} /><button aria-label={t.common.notifications} className="relative rounded-xl border border-[var(--kram-border)] bg-white p-2.5 text-[var(--kram-charcoal)] hover:bg-[var(--kram-bg)]"><Bell size={17} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--kram-orange)]" /></button><UserMenu locale={locale} user={user} /></div></header>;
}
