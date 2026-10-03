import Link from "next/link";
import { ArrowRight, Plus, Search, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { copy, isLocale, type Locale } from "@/lib/i18n";

export default async function ClientsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];
  const supabase = await createClient();
  const { data: clients, error } = await supabase.from("clients").select("id, full_name, email, phone, created_at").order("created_at", { ascending: false }).limit(50);
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

    <section className="rounded-2xl border border-[var(--kram-border)] bg-white">
      <div className="flex flex-col gap-3 border-b border-[var(--kram-border)] p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex max-w-md flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5"><Search size={16} className="text-zinc-400" /><span className="text-sm text-zinc-400">{t.clients.search}</span></div>
        <div className="text-xs font-medium text-zinc-400">{rows.length} {t.clients.records}</div>
      </div>
      {error ? <div className="p-10 text-center"><p className="text-sm font-semibold text-zinc-900">{t.clients.loadError}</p><p className="mt-1 text-xs text-zinc-500">{error.message}</p></div>
      : rows.length === 0 ? <div className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100"><Users size={20} className="text-zinc-500" /></div>
          <h2 className="mt-4 text-base font-bold text-zinc-950">{t.clients.emptyTitle}</h2>
          <p className="mt-1 max-w-md text-sm leading-6 text-zinc-500">{t.clients.emptyDescription}</p>
          <Link href={`/${locale}/ops/clients/new`} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50">{t.clients.createFirst}<ArrowRight size={15} /></Link>
        </div>
      : <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left">
          <thead className="border-b border-zinc-100 bg-zinc-50/70"><tr>
            {[t.clients.name, t.clients.contact, t.clients.phone, t.clients.created].map((label) => <th key={label} className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">{label}</th>)}<th className="w-12 px-4" />
          </tr></thead>
          <tbody className="divide-y divide-zinc-100">{rows.map((client) => <tr key={client.id} className="group hover:bg-zinc-50/60"><td className="contents">
            <td className="px-5 py-4"><Link href={`/${locale}/ops/clients/${client.id}`} className="block"><div className="font-semibold text-zinc-900 group-hover:text-[var(--kram-orange)]">{client.full_name}</div><div className="mt-0.5 text-xs text-zinc-400">{client.id.slice(0, 8).toUpperCase()}</div></Link></td>
            <td className="px-5 py-4 text-sm text-zinc-600">{client.email || "—"}</td>
            <td className="px-5 py-4 text-sm text-zinc-600">{client.phone || "—"}</td>
            <td className="px-5 py-4 text-sm text-zinc-500">{new Date(client.created_at).toLocaleDateString(locale)}</td>
            <td className="px-4 py-4 text-right"><Link href={`/${locale}/ops/clients/${client.id}`} aria-label={client.full_name}><ArrowRight size={16} className="ml-auto text-zinc-300 transition group-hover:text-zinc-700" /></td>
          </tr>)}</tbody>
        </table></div>}
    </section>
  </div>;
}
