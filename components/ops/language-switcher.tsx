"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";

function Flag({ locale }: { locale: Locale }) {
  if (locale === "fr") return <svg viewBox="0 0 36 24" className="absolute inset-0 h-full w-full" aria-hidden="true"><rect width="12" height="24" fill="#1d4ed8" /><rect x="12" width="12" height="24" fill="#fff" /><rect x="24" width="12" height="24" fill="#ef4444" /></svg>;
  if (locale === "pt") return <svg viewBox="0 0 36 24" className="absolute inset-0 h-full w-full" aria-hidden="true"><rect width="36" height="24" fill="#d71920" /><rect width="14" height="24" fill="#046a38" /><circle cx="14" cy="12" r="5.1" fill="#f4c542" /><circle cx="14" cy="12" r="3.7" fill="#fff" /><circle cx="14" cy="12" r="2.7" fill="#d71920" /></svg>;
  return <svg viewBox="0 0 36 24" className="absolute inset-0 h-full w-full" aria-hidden="true"><rect width="36" height="24" fill="#1d4ed8" /><path d="M0 0 36 24M36 0 0 24" stroke="#fff" strokeWidth="6" /><path d="M0 0 36 24M36 0 0 24" stroke="#dc2626" strokeWidth="2.6" /><path d="M18 0v24M0 12h36" stroke="#fff" strokeWidth="8" /><path d="M18 0v24M0 12h36" stroke="#dc2626" strokeWidth="4" /></svg>;
}

const meta = { fr: { code: "FR", name: "Français" }, en: { code: "EN", name: "English" }, pt: { code: "PT", name: "Português" } } as const;

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  return <div className="hidden items-center gap-1 rounded-xl border border-[var(--kram-border)] bg-white p-1 sm:flex" aria-label="Language">
    {locales.map((item) => {
      const active = item === locale;
      const href = pathname.replace(/^\/(fr|en|pt)(?=\/|$)/, "/" + item);
      return <Link key={item} href={href} title={meta[item].name} aria-label={meta[item].name} className={"relative flex h-8 w-10 items-center justify-center overflow-hidden rounded-lg transition " + (active ? "ring-2 ring-[var(--kram-orange)] ring-offset-1" : "opacity-65 hover:opacity-100")}>
        <Flag locale={item} />
        <span className="absolute inset-0 bg-black/10" />
        <span className="relative z-10 text-[9px] font-black tracking-[0.08em] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)]">{meta[item].code}</span>
      </Link>;
    })}
  </div>;
}
