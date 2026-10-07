"use client";

import { useSyncExternalStore, useState } from "react";
import { OpsHeader } from "@/components/ops/header";
import { OpsSidebar } from "@/components/ops/sidebar";
import type { Locale } from "@/lib/i18n";

type User = { name: string; email: string; role: string; scope: string; jobTitle?: string | null; avatarUrl?: string | null };

export function OpsShell({ locale, user, workspaceLabel, children }: { locale: Locale; user: User; workspaceLabel: string; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const collapsed = useSyncExternalStore(
    (onStoreChange) => {
      const handler = () => onStoreChange();
      window.addEventListener("storage", handler);
      window.addEventListener("kram-sidebar-change", handler);
      return () => {
        window.removeEventListener("storage", handler);
        window.removeEventListener("kram-sidebar-change", handler);
      };
    },
    () => window.localStorage.getItem("kram.ops.sidebar") === "collapsed",
    () => false,
  );

  const toggleSidebar = () => {
    const next = !collapsed;
    window.localStorage.setItem("kram.ops.sidebar", next ? "collapsed" : "expanded");
    window.dispatchEvent(new Event("kram-sidebar-change"));
  };

  return <div className="min-h-screen">
    <OpsSidebar locale={locale} collapsed={collapsed} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
    <div className={"min-h-screen transition-[padding-left] duration-200 " + (collapsed ? "lg:pl-[72px]" : "lg:pl-[228px]")}>
      <OpsHeader locale={locale} user={user} workspaceLabel={workspaceLabel} collapsed={collapsed} onToggleSidebar={toggleSidebar} onOpenMobile={() => setMobileOpen(true)} />
      <main className="mx-auto max-w-[1680px] px-5 py-6 lg:px-7 lg:py-7">{children}</main>
    </div>
  </div>;
}
