"use client";

import Link from "next/link";
import { ChevronDown, Globe2 } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const labels = {
  fr: { eyebrow: "Portée autorisée", global: "Organisation globale", country: "Pays autorisé", branch: "Agence autorisée", manage: "Gérer les accès" },
  en: { eyebrow: "Authorized scope", global: "Global organization", country: "Authorized country", branch: "Authorized branch", manage: "Manage access" },
  pt: { eyebrow: "Âmbito autorizado", global: "Organização global", country: "País autorizado", branch: "Filial autorizada", manage: "Gerir acessos" },
} as const;

export function ScopeSwitcher({ locale, scope }: { locale: Locale; scope: string }) {
  const t = labels[locale];
  const scopeLabel = t[scope as keyof typeof t] ?? scope;
  return <div className="group relative"><div className="flex items-center gap-3 rounded-xl border border-[var(--kram-border)] bg-white px-3 py-2 text-left shadow-sm"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--kram-deep)] text-white"><Globe2 size={15} /></span><span className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--kram-metal)]">{t.eyebrow}</span><span className="block truncate text-xs font-semibold text-[var(--kram-ink)]">{scopeLabel}</span></span><ChevronDown size={15} className="ml-auto text-[var(--kram-metal)]" /></div><div className="invisible absolute bottom-full left-0 z-50 mb-2 w-full translate-y-1 rounded-xl border border-[var(--kram-border)] bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"><p className="px-2 py-1.5 text-[10px] leading-4 text-[var(--kram-metal)]">{locale === "fr" ? "Les limites d’accès sont appliquées par Supabase RLS." : locale === "pt" ? "Os limites de acesso são aplicados pelo Supabase RLS." : "Access limits are enforced by Supabase RLS."}</p><Link href={`/${locale}/ops/settings`} className="mt-1 block rounded-lg px-2 py-2 text-xs font-bold text-[var(--kram-charcoal)] hover:bg-[var(--kram-bg)]">{t.manage} →</Link></div></div>;
}
