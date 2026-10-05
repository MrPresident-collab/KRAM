"use client";

import { useEffect, useState } from "react";
import { OpsHeader } from "@/components/ops/header";
import { OpsSidebar } from "@/components/ops/sidebar";
import type { Locale } from "@/lib/i18n";

type User = {
  name: string;
  email: string;
  role: string;
  scope: string;
  jobTitle?: string | null;
  avatarUrl?: string | null;
};

type Props = {
  locale: Locale;
  user: User;
  children: React.ReactNode;
};

export function OpsShell({ locale, user, children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("kram.ops.sidebar");
    if (saved === "collapsed") setCollapsed(true);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("kram.ops.sidebar", collapsed ? "collapsed" : "expanded");
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [locale]);

  return (
    <div className="min-h-screen">
      <OpsSidebar
        locale={locale}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className={`min-h-screen transition-[padding-left] duration-200 ease-out ${collapsed ? "lg:pl-[72px]" : "lg:pl-[228px]"}`}>
        <OpsHeader
          locale={locale}
          user={user}
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((value) => !value)}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main className="mx-auto max-w-[1680px] px-5 py-6 lg:px-7 lg:py-7">{children}</main>
      </div>
    </div>
  );
}
