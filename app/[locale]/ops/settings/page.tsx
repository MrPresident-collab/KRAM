import Link from "next/link";
import { Bell, Globe2, GitBranch, Languages, ShieldCheck, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { isLocale, type Locale, copy } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { SettingsPreferences } from "./preferences";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale]; const supabase=await createClient(); const {data:claims}=await supabase.auth.getClaims(); const uid=claims?.claims?.sub; const {data:membership}=uid?await supabase.from("organization_members").select("organization_id").eq("user_id",uid).eq("status","active").limit(1).maybeSingle():{data:null}; const {data:organization}=membership?await supabase.from("organizations").select("default_currency").eq("id",membership.organization_id).maybeSingle():{data:null};
  const items = [
    { href: `/${locale}/ops/settings/countries`, icon: Globe2, title: t.settings.countries, desc: t.settings.countriesDesc },
    { href: `/${locale}/ops/settings/branches`, icon: GitBranch, title: t.settings.branches, desc: t.settings.branchesDesc },
    { href: `/${locale}/ops/users`, icon: ShieldCheck, title: t.settings.access, desc: t.settings.accessDesc },
    { href: `/${locale}/ops/settings/languages`, icon: Languages, title: locale === "fr" ? "Langues" : locale === "pt" ? "Idiomas" : "Languages", desc: locale === "fr" ? "Choisissez la langue de l’interface KRAM." : locale === "pt" ? "Escolha o idioma da interface KRAM." : "Choose the KRAM interface language." },
  ];

  return <div className="mx-auto max-w-6xl space-y-8 pb-10">
    <section className="border-b border-[var(--kram-border)] pb-7">
      <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[var(--kram-orange)]">{t.nav.system}</p>
      <h1 className="mt-2 text-3xl font-black tracking-[-.05em] text-[var(--kram-deep)]">{t.settings.title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--kram-metal)]">{t.settings.description}</p>
    </section>

    <section>
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[.16em] text-[var(--kram-soft-metal)]">{locale === "fr" ? "Organisation & accès" : locale === "pt" ? "Organização e acesso" : "Organization & access"}</p>
      <div className="divide-y divide-[var(--kram-border)] overflow-hidden rounded-2xl border border-[var(--kram-border)] bg-white">
        {items.map(({ href, icon: Icon, title, desc }) => <Link key={href} href={href} className="group flex items-center gap-4 px-5 py-5 transition hover:bg-[var(--kram-bg)] md:px-6">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--kram-bg)] text-[var(--kram-charcoal)] group-hover:bg-[var(--kram-orange-soft)] group-hover:text-[var(--kram-orange)]"><Icon size={18}/></span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-[var(--kram-deep)]">{title}</span><span className="mt-1 block max-w-2xl text-xs leading-5 text-[var(--kram-metal)]">{desc}</span></span>
          <ChevronRight size={17} className="text-[var(--kram-soft-metal)] transition-transform group-hover:translate-x-0.5"/>
        </Link>)}
      </div>
    </section>

    <section>
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[.16em] text-[var(--kram-soft-metal)]">{locale === "fr" ? "Préférences" : locale === "pt" ? "Preferências" : "Preferences"}</p>
      <div className="divide-y divide-[var(--kram-border)] overflow-hidden rounded-2xl border border-[var(--kram-border)] bg-white">
        <div className="flex items-center gap-4 px-5 py-5 md:px-6"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--kram-bg)] text-[var(--kram-charcoal)]"><Bell size={18}/></span><div><p className="text-sm font-bold text-[var(--kram-deep)]">{locale === "fr" ? "Centre de notifications" : locale === "pt" ? "Centro de notificações" : "Notification center"}</p><p className="mt-1 text-xs text-[var(--kram-metal)]">{locale === "fr" ? "Les alertes KRAM apparaîtront dans le centre de notifications." : locale === "pt" ? "Os alertas KRAM aparecerão no centro de notificações." : "KRAM alerts will appear in the notification center."}</p></div></div>
      </div>
    </section>
  </div>;
}
