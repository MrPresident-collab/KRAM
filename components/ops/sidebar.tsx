"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity, Building2, ClipboardCheck, ClipboardList, FileText, FolderKanban,
  LayoutDashboard, LifeBuoy, Settings, ShieldCheck, Users, Wallet, Wrench
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { copy } from "@/lib/i18n";
import { ScopeSwitcher } from "@/components/ops/scope-switcher";

export function OpsSidebar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const t = copy[locale];

  const implemented = new Set([
    `/${locale}/ops`,
    `/${locale}/ops/assets`,
    `/${locale}/ops/clients`,
    `/${locale}/ops/users`,
    `/${locale}/ops/settings`,
    `/${locale}/ops/work-orders`,
    `/${locale}/ops/inspections`,
    `/${locale}/ops/projects`,
    `/${locale}/ops/maintenance`,
    `/${locale}/ops/assets/properties`,
    `/${locale}/ops/providers`,
    `/${locale}/ops/expenses`,
    `/${locale}/ops/approvals`,
    `/${locale}/ops/reports`,
    `/${locale}/ops/activity`,
  ]);

  const sections = [
    { label: null, items: [{ href: `/${locale}/ops`, label: t.nav.overview, icon: LayoutDashboard }] },
    { label: t.nav.operations, items: [
      { href: `/${locale}/ops/work-orders`, label: t.nav.workOrders, icon: ClipboardList },
      { href: `/${locale}/ops/inspections`, label: t.nav.inspections, icon: ClipboardCheck },
      { href: `/${locale}/ops/projects`, label: t.nav.projects, icon: FolderKanban },
      { href: `/${locale}/ops/maintenance`, label: t.nav.maintenance, icon: Wrench }
    ]},
    { label: t.nav.assets, items: [
      { href: `/${locale}/ops/assets`, label: t.nav.allAssets, icon: Building2 },
      { href: `/${locale}/ops/assets/properties`, label: t.nav.properties, icon: Building2 }
    ]},
    { label: null, items: [{ href: `/${locale}/ops/clients`, label: t.nav.clients, icon: Users }] },
    { label: t.nav.network, items: [{ href: `/${locale}/ops/providers`, label: t.nav.providers, icon: ShieldCheck }] },
    { label: t.nav.finance, items: [
      { href: `/${locale}/ops/expenses`, label: t.nav.expenses, icon: Wallet },
      { href: `/${locale}/ops/approvals`, label: t.nav.approvals, icon: ClipboardCheck }
    ]},
    { label: t.nav.documents, items: [{ href: `/${locale}/ops/reports`, label: t.nav.reports, icon: FileText }] },
    { label: t.nav.system, items: [
      { href: `/${locale}/ops/activity`, label: t.nav.activity, icon: Activity },
      { href: `/${locale}/ops/users`, label: t.nav.usersRoles, icon: Users },
      { href: `/${locale}/ops/settings`, label: t.nav.settings, icon: Settings }
    ]}
  ];

  return <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-[var(--kram-border)] bg-white lg:flex lg:flex-col">
    <div className="flex h-20 items-center border-b border-[var(--kram-border)] px-6">
      <div>
        <div className="text-xl font-black tracking-[-0.06em]">KRAM</div>
        <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-400">Remote Asset Management</div>
      </div>
    </div>
    <div className="kram-scrollbar flex-1 overflow-y-auto px-3 py-5">
      {sections.map((section, index) => <div key={section.label ?? `section-${index}`} className="mb-6">
        {section.label && <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">{section.label}</p>}
        <nav className="space-y-1">{section.items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== `/${locale}/ops` && pathname.startsWith(item.href));
          const ready = implemented.has(item.href) || item.href.startsWith(`/${locale}/ops/users`) || item.href.startsWith(`/${locale}/ops/settings`);
          return ready ? (
            <Link key={item.href} href={item.href} className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${active ? "bg-[var(--kram-charcoal)] text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"}`}>
              <Icon size={17} strokeWidth={active ? 2.2 : 1.8} /><span>{item.label}</span>
            </Link>
          ) : (
            <div key={item.href} title="Coming soon" className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300">
              <Icon size={17} strokeWidth={1.8} /><span>{item.label}</span>
            </div>
          );
        })}</nav>
      </div>)}
    </div>
    <div className="border-t border-[var(--kram-border)] p-4">
      <ScopeSwitcher />
      <div className="mt-3 rounded-xl bg-[var(--kram-background)] p-3">
        <div className="flex items-center gap-2"><LifeBuoy size={15} className="text-[var(--kram-orange)]" /><span className="text-xs font-semibold">KRAM Ops</span></div>
        <p className="mt-1 text-[11px] leading-4 text-zinc-500">Control your authorized KRAM scope.</p>
      </div>
    </div>
  </aside>;
}
