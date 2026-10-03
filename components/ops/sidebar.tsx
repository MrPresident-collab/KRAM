"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Building2, ClipboardCheck, ClipboardList, FileText, FolderKanban, LayoutDashboard, LifeBuoy, Settings, ShieldCheck, Users, Wallet, Wrench, ChevronDown } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { copy } from "@/lib/i18n";
import { ScopeSwitcher } from "@/components/ops/scope-switcher";

export function OpsSidebar({ locale, scope = "global" }: { locale: Locale; scope?: string }) {
  const pathname = usePathname();
  const t = copy[locale];
  const sections = [
    { label: "Control room", items: [{ href: `/${locale}/ops`, label: t.nav.overview, icon: LayoutDashboard }] },
    { label: t.nav.operations, items: [
      { href: `/${locale}/ops/work-orders`, label: t.nav.workOrders, icon: ClipboardList },
      { href: `/${locale}/ops/inspections`, label: t.nav.inspections, icon: ClipboardCheck },
      { href: `/${locale}/ops/projects`, label: t.nav.projects, icon: FolderKanban },
      { href: `/${locale}/ops/maintenance`, label: t.nav.maintenance, icon: Wrench },
    ] },
    { label: t.nav.assets, items: [{ href: `/${locale}/ops/assets`, label: t.nav.allAssets, icon: Building2 }, { href: `/${locale}/ops/clients`, label: t.nav.clients, icon: Users }] },
    { label: t.nav.network, items: [{ href: `/${locale}/ops/providers`, label: t.nav.providers, icon: ShieldCheck }] },
    { label: t.nav.finance, items: [{ href: `/${locale}/ops/expenses`, label: t.nav.expenses, icon: Wallet }, { href: `/${locale}/ops/approvals`, label: t.nav.approvals, icon: ClipboardCheck }] },
    { label: t.nav.documents, items: [{ href: `/${locale}/ops/reports`, label: t.nav.reports, icon: FileText }, { href: `/${locale}/ops/documents`, label: t.nav.documents, icon: FileText }] },
    { label: t.nav.system, items: [{ href: `/${locale}/ops/activity`, label: t.nav.activity, icon: Activity }, { href: `/${locale}/ops/users`, label: t.nav.usersRoles, icon: Users }, { href: `/${locale}/ops/settings`, label: t.nav.settings, icon: Settings }] },
  ];

  return <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] border-r border-[var(--kram-border)] bg-[var(--kram-surface)] lg:flex lg:flex-col">
    <div className="border-b border-[var(--kram-border)] px-7 pb-6 pt-7">
      <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-[10px] bg-[var(--kram-deep)] text-sm font-black tracking-[-.12em] text-white">KR</div><div><div className="text-[22px] font-black tracking-[-.09em] text-[var(--kram-deep)]">KRAM</div><div className="text-[9px] font-semibold uppercase tracking-[.16em] text-[var(--kram-metal)]">Remote Asset Management</div></div></div>
      <div className="mt-6 flex items-center justify-between rounded-xl border border-[var(--kram-border)] bg-[var(--kram-bg)] px-3 py-2.5"><div><div className="text-[10px] font-bold uppercase tracking-[.13em] text-[var(--kram-metal)]">Workspace</div><div className="mt-0.5 text-sm font-semibold text-[var(--kram-ink)]">KRAM Global</div></div><ChevronDown size={15} className="text-[var(--kram-metal)]" /></div>
    </div>
    <div className="kram-scrollbar flex-1 overflow-y-auto px-4 py-6">{sections.map((section) => <div key={section.label} className="mb-7"><p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-[var(--kram-soft-metal)]">{section.label}</p><nav className="space-y-1">{section.items.map((item) => { const Icon = item.icon; const active = pathname === item.href || (item.href !== `/${locale}/ops` && pathname.startsWith(item.href)); return <Link key={item.href} href={item.href} className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition ${active ? "bg-[var(--kram-deep)] text-white shadow-sm" : "text-[var(--kram-metal)] hover:bg-[var(--kram-bg)] hover:text-[var(--kram-ink)]"}`}><Icon size={16} strokeWidth={active ? 2.3 : 1.8} /><span>{item.label}</span>{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--kram-orange)]" />}</Link>; })}</nav></div>)}</div>
    <div className="border-t border-[var(--kram-border)] p-4"><ScopeSwitcher locale={locale} scope={scope} /><div className="mt-3 flex items-start gap-2 rounded-xl bg-[var(--kram-orange-soft)] p-3"><LifeBuoy size={15} className="mt-0.5 shrink-0 text-[var(--kram-orange)]" /><p className="text-[11px] leading-4 text-[var(--kram-charcoal)]"><span className="font-bold">Ops desk</span><br />Your authorized operational scope is active.</p></div></div>
  </aside>;
}
