"use client";

import { Bell, Search, Command } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { UserMenu } from "@/components/ops/user-menu";

type Props = { locale: Locale; user: { name: string; email: string; role: string; scope: string; jobTitle?: string | null; avatarUrl?: string | null } };

export function OpsHeader({ locale, user }: Props) {
  return (
    <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-[var(--kram-border)] bg-[rgba(243,243,240,.94)] px-5 backdrop-blur-xl lg:px-8">
      <div className="min-w-0 flex-1">
        <button type="button" className="flex h-10 w-full max-w-[620px] items-center gap-3 rounded-xl border border-[var(--kram-border)] bg-white px-3.5 text-left shadow-[0_1px_2px_rgba(0,0,0,.02)] transition hover:border-[var(--kram-soft-metal)]">
          <Search size={17} className="text-[var(--kram-metal)]" />
          <span className="text-[13px] text-[var(--kram-metal)]">{locale === "fr" ? "Rechercher dans KRAM..." : locale === "pt" ? "Pesquisar no KRAM..." : "Search KRAM operations..."}</span>
          <span className="ml-auto hidden items-center gap-1 rounded-md border border-[var(--kram-border)] bg-[var(--kram-bg)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--kram-metal)] sm:flex"><Command size={10} />K</span>
        </button>
      </div>
      <div className="ml-5 flex items-center gap-2">
        <button type="button" aria-label="Notifications" className="relative rounded-xl border border-[var(--kram-border)] bg-white p-2.5 text-[var(--kram-charcoal)] transition hover:bg-[var(--kram-bg)]">
          <Bell size={17} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--kram-orange)]" />
        </button>
        <UserMenu locale={locale} user={user} />
      </div>
    </header>
  );
}
