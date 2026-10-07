"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Building2, MessageSquare, ClipboardCheck, ClipboardList, FileText, FolderKanban, LayoutDashboard, UsersRound, Wallet, Wrench, Settings, ShieldCheck, PanelLeftClose, UserRoundCog, Files, HardHat, BadgeCheck, X } from "lucide-react";
import { KramBrand } from "@/components/brand/kram-brand";
import type { Locale } from "@/lib/i18n";
import { copy } from "@/lib/i18n";

type Props = { locale: Locale; collapsed?: boolean; mobileOpen?: boolean; onCloseMobile?: () => void };

export function OpsSidebar({ locale, collapsed = false, mobileOpen = false, onCloseMobile }: Props) {
  const pathname = usePathname();
  const t = copy[locale];
  const overview = locale === "fr" ? "Vue globale" : locale === "pt" ? "Visão global" : "Global Overview";
  const sections = [
    { label: "", items: [{ href: "/" + locale + "/ops", label: overview, icon: LayoutDashboard }] },
    { label: t.nav.operations, items: [
      { href: "/" + locale + "/ops/work-orders", label: t.nav.workOrders, icon: ClipboardList },
      { href: "/" + locale + "/ops/inspections", label: t.nav.inspections, icon: BadgeCheck },
      { href: "/" + locale + "/ops/projects", label: t.nav.projects, icon: FolderKanban },
      { href: "/" + locale + "/ops/maintenance", label: t.nav.maintenance, icon: Wrench }
    ] },
    { label: locale === "fr" ? "Communication" : locale === "pt" ? "Comunicação" : "Communication", items: [{ href: "/" + locale + "/ops/communications", label: locale === "fr" ? "Conversations" : locale === "pt" ? "Conversas" : "Conversations", icon: MessageSquare }] },
    { label: t.nav.assets, items: [
      { href: "/" + locale + "/ops/assets", label: t.nav.allAssets, icon: Building2 },
      { href: "/" + locale + "/ops/clients", label: t.nav.clients, icon: UsersRound }
    ] },
    { label: t.nav.network, items: [{ href: "/" + locale + "/ops/providers", label: t.nav.providers, icon: HardHat }] },
    { label: t.nav.finance, items: [
      { href: "/" + locale + "/ops/expenses", label: t.nav.expenses, icon: Wallet },
      { href: "/" + locale + "/ops/approvals", label: t.nav.approvals, icon: ShieldCheck }
    ] },
    { label: t.nav.documents, items: [
      { href: "/" + locale + "/ops/reports", label: t.nav.reports, icon: FileText },
      { href: "/" + locale + "/ops/documents", label: t.nav.documents, icon: Files }
    ] },
    { label: t.nav.system, items: [
      { href: "/" + locale + "/ops/activity", label: t.nav.activity, icon: Activity },
      { href: "/" + locale + "/ops/users", label: t.nav.usersRoles, icon: UserRoundCog },
      { href: "/" + locale + "/ops/settings", label: t.nav.settings, icon: Settings }
    ] }
  ];

  return <>
    {mobileOpen && <button type="button" aria-label="Close navigation" onClick={onCloseMobile} className="fixed inset-0 z-40 bg-black/30 lg:hidden" />}
    <aside className={"fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--kram-border)] bg-[var(--kram-surface)] transition-[width,transform] duration-200 " + (collapsed ? "lg:w-[72px]" : "lg:w-[228px]") + " " + (mobileOpen ? "w-[280px] translate-x-0" : "w-[280px] -translate-x-full lg:translate-x-0")}>
      <div className={"flex h-[68px] items-center border-b border-[var(--kram-border)] " + (collapsed ? "justify-center px-2" : "justify-between px-5")}>
        <KramBrand locale={locale} compact={collapsed} />
        <button type="button" onClick={onCloseMobile} className="rounded-lg p-2 text-[var(--kram-metal)] hover:bg-[var(--kram-bg)] lg:hidden" aria-label="Close navigation"><X size={18}/></button>
      </div>
      <div className="kram-scrollbar flex-1 overflow-y-auto px-2.5 py-4">
        {sections.map((section,i)=><div key={i} className={section.label ? "mb-5" : "mb-3"}>
          {section.label && !collapsed && <p className="mb-1.5 px-2.5 text-[9px] font-bold uppercase tracking-[.17em] text-[var(--kram-soft-metal)]">{section.label}</p>}
          <nav className="space-y-0.5">{section.items.map(item=>{
            const Icon=item.icon;
            const active=pathname===item.href || (item.href!=="/"+locale+"/ops" && pathname.startsWith(item.href));
            return <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined} onClick={onCloseMobile} className={"group flex items-center rounded-lg py-2.5 text-[13px] font-semibold transition " + (collapsed ? "justify-center px-2" : "gap-3 px-2.5") + " " + (active ? "bg-[var(--kram-deep)] text-white" : "text-[var(--kram-metal)] hover:bg-[var(--kram-bg)] hover:text-[var(--kram-ink)]")}>
              <Icon size={16} strokeWidth={active ? 2.2 : 1.8}/>{!collapsed&&<span className="truncate">{item.label}</span>}{active&&!collapsed&&<span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--kram-orange)]"/>}
            </Link>;
          })}</nav>
        </div>)}
      </div>
      {collapsed&&<div className="hidden pb-4 text-center lg:block"><PanelLeftClose size={15} className="mx-auto text-[var(--kram-soft-metal)]"/></div>}
    </aside>
  </>;
}
