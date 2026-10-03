import { Globe2, GitBranch, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { isLocale, type Locale, copy } from "@/lib/i18n";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];
  return <div className="space-y-7">
    <section><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">{t.nav.system}</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-zinc-950">{t.settings.title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">{t.settings.description}</p></section>
    <section className="grid gap-5 lg:grid-cols-3">
      {[{icon:Globe2,title:t.settings.countries,desc:t.settings.countriesDesc},{icon:GitBranch,title:t.settings.branches,desc:t.settings.branchesDesc},{icon:ShieldCheck,title:t.settings.access,title2:t.settings.access,desc:t.settings.accessDesc}].map((item,i)=>{const Icon=item.icon;return <div key={i} className="rounded-2xl border border-[var(--kram-border)] bg-white p-6"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white"><Icon size={18}/></div><h2 className="mt-5 text-base font-bold text-zinc-950">{item.title}</h2><p className="mt-2 text-sm leading-6 text-zinc-500">{item.desc}</p><div className="mt-6 rounded-xl bg-[var(--kram-background)] px-4 py-3 text-xs font-medium text-zinc-500">{t.settings.comingSoon}</div></div>})}
    </section>
  </div>;
}