import Link from "next/link";
import { Check, ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

const options = [
  { code: "fr", label: "Français", native: "Français" },
  { code: "en", label: "English", native: "English" },
  { code: "pt", label: "Português", native: "Português" },
] as const;

export default async function LanguagesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <div className="mx-auto max-w-3xl space-y-7 pb-10">
    <Link href={`/${locale}/ops/settings`} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--kram-metal)] hover:text-[var(--kram-ink)]"><ChevronLeft size={15}/> {locale === "fr" ? "Paramètres" : locale === "pt" ? "Definições" : "Settings"}</Link>
    <section><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[var(--kram-orange)]">KRAM</p><h1 className="mt-2 text-3xl font-black tracking-[-.05em] text-[var(--kram-deep)]">{locale === "fr" ? "Langue" : locale === "pt" ? "Idioma" : "Language"}</h1><p className="mt-2 text-sm text-[var(--kram-metal)]">{locale === "fr" ? "Choisissez la langue de l’interface." : locale === "pt" ? "Escolha o idioma da interface." : "Choose the language used across KRAM."}</p></section>
    <div className="divide-y divide-[var(--kram-border)] overflow-hidden rounded-2xl border border-[var(--kram-border)] bg-white">
      {options.map((option) => <Link key={option.code} href={`/${option.code}/ops/settings/languages`} className="flex items-center gap-4 px-5 py-5 transition hover:bg-[var(--kram-bg)]"><span className={`grid h-9 w-9 place-items-center rounded-lg text-xs font-black ${locale===option.code ? "bg-[var(--kram-deep)] text-white" : "bg-[var(--kram-bg)] text-[var(--kram-metal)]"}`}>{option.code.toUpperCase()}</span><div className="flex-1"><p className="text-sm font-bold text-[var(--kram-deep)]">{option.label}</p><p className="mt-0.5 text-xs text-[var(--kram-metal)]">{option.native}</p></div>{locale===option.code && <Check size={17} className="text-[var(--kram-orange)]"/>}</Link>)}
    </div>
  </div>;
}
