import Link from "next/link";
import { Plus } from "lucide-react";
import { ClientsSearch } from "./clients-search";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { copy, isLocale, type Locale } from "@/lib/i18n";

export default async function ClientsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];
  const supabase = await createClient();
  const { data: clients, error } = await supabase.from("clients").select("id, full_name, email, primary_phone, created_at").order("created_at", { ascending: false }).limit(50);
  const rows = clients ?? [];

  return <div className="space-y-7">
    <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">{t.nav.clients}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-zinc-950 md:text-4xl">{t.clients.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">{t.clients.description}</p>
      </div>
      <Link href={`/${locale}/ops/clients/new`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--kram-charcoal)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800">
        <Plus size={16} />{t.clients.newClient}
      </Link>
    </section>

    <ClientsSearch locale={locale as Locale} clients={rows} error={error?.message ?? null} />
  </div>;
}
