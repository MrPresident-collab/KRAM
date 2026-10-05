"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Building2, ClipboardCheck, ClipboardList, FileText, FolderKanban, LayoutDashboard, Users, Wallet, Wrench, Settings, ShieldCheck } from "lucide-react";
import { KramBrand } from "@/components/brand/kram-brand";
import type { Locale } from "@/lib/i18n";
import { copy } from "@/lib/i18n";

type Props = { locale: Locale; scope?: string; workspaceLabel?: string };

export function OpsSidebar({ locale }: Props) {
  const pathname = usePathname();
  const t = copy[locale];
  const overview = locale === "fr" ? "Vue globale" : locale === "pt" ? "Visão global" : "Global Overview";
  const sections = [
    { label: "", items: [{ href: "/" + locale + "/ops", label: overview, icon: LayoutDashboard }] },
    { label: t.nav.operations, items: [
      { href: "/" + locale + "/ops/work-orders", label: t.nav.workOrders, icon: ClipboardList },
      { href: "/" + locale + "/ops/inspections", label: t.nav.inspections, icon: ClipboardCheck },
      { href: "/" + locale + "/ops/projects", label: t.nav.projects, icon: FolderKanban },
      { href: "/" + locale + "/ops/maintenance", label: t.nav.maintenance, icon: Wrench }
    ] },
    { label: t.nav.assets, items: [
      { href: "/" + locale + "/ops/assets", label: t.nav.allAssets, icon: Building2 },
      { href: "/" + locale + "/ops/clients", label: t.nav.clients, icon: Users }
    ] },
    { label: t.nav.network, items: [{ href: "/" + locale + "/ops/providers", label: t.nav.providers, icon: ShieldCheck }] },
    { label: t.nav.finance, items: [
      { href: "/" + locale + "/ops/expenses", label: t.nav.expenses, icon: Wallet },
      { href: "/" + locale + "/ops/approvals", label: t.nav.approvals, icon: ClipboardCheck }
    ] },
    { label: t.nav.documents, items: [
      { href: "/" + locale + "/ops/reports", label: t.nav.reports, icon: FileText },
      { href: "/" + locale + "/ops/documents", label: t.nav.documents, icon: FileText }
    ] },
    { label: t.nav.system, items: [
      { href: "/" + locale + "/ops/activity", label: t.nav.activity, icon: Activity },
      { href: "/" + locale + "/ops/users", label: t.nav.usersRoles, icon: Users },
      { href: "/" + locale + "/ops/settings", label: t.nav.settings, icon: Settings }
    ] }
  ];

  return <aside className="fixed inset-y-0 left-0 z-40 hidden w-[228px] border-r border-[var(--kram-border)] bg-[var(--kram-surface)] lg:flex lg:flex-col">
    <div className="flex h-[68px] items-center border-b border-[var(--kram-border)] px-5">
      <KramBrand locale={locale} />
    </div>
    <div className="kram-scrollbar flex-1 overflow-y-auto px-2.5 py-4">
      {sections.map((section,i)=><div key={i} className={section.label ? "mb-5" : "mb-3"}>
        {section.label && <p className="mb-1.5 px-2.5 text-[9px] font-bold uppercase tracking-[.17em] text-[var(--kram-soft-metal)]">{section.label}</p>}
        <nav className="space-y-0.5">{section.items.map(item=>{
          const Icon=item.icon;
          const active=pathname===item.href || (item.href!=="/"+locale+"/ops" && pathname.startsWith(item.href));
          return <Link key={item.href} href={item.href} className={"group flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-[13px] font-semibold transition " + (active ? "bg-[var(--kram-deep)] text-white" : "text-[var(--kram-metal)] hover:bg-[var(--kram-bg)] hover:text-[var(--kram-ink)]")}>
            <Icon size={16} strokeWidth={active ? 2.2 : 1.8}/><span className="truncate">{item.label}</span>{active&&<span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--kram-orange)]"/>}
          </Link>;
        })}</nav>
      </div>)}
    </div>
  </aside>;
}
