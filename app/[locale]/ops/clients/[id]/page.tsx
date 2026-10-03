import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, Mail, Phone, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { copy, isLocale, type Locale } from "@/lib/i18n";

export default async function ClientDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];
  const supabase = await createClient();

  const [{ data: client, error }, { data: assets }] = await Promise.all([
    supabase.from("clients").select("id,full_name,email,phone,notes,created_at,updated_at").eq("id", id).maybeSingle(),
    supabase.from("assets").select("id,name,reference_code,type,status,city,country_code").eq("client_id", id).order("created_at", { ascending: false }),
  ]);

  if (error || !client) notFound();

  const initials = client.full_name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-7">
      <Link href={`/${locale}/ops/clients`} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900">
        <ArrowLeft size={15} /> {t.common.back}
      </Link>

      <section className="rounded-2xl border border-[var(--kram-border)] bg-white">
        <div className="flex flex-col gap-5 border-b border-zinc-100 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--kram-charcoal)] text-sm font-black text-white">
              {initials || "C"}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">{t.nav.clients}</p>
              <h1 className="mt-1 text-2xl font-bold tracking-[-0.04em] text-zinc-950">{client.full_name}</h1>
              <p className="mt-1 text-xs text-zinc-400">{client.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
          <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-600">
            {assets?.length ?? 0} {t.assets.records}
          </span>
        </div>

        <div className="grid gap-0 md:grid-cols-3">
          <div className="border-b border-zinc-100 p-6 md:border-b-0 md:border-r">
            <Mail size={17} className="text-[var(--kram-orange)]" />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">{t.clients.contact}</p>
            <p className="mt-1 text-sm font-semibold text-zinc-800">{client.email || "—"}</p>
          </div>
          <div className="border-b border-zinc-100 p-6 md:border-b-0 md:border-r">
            <Phone size={17} className="text-[var(--kram-orange)]" />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">{t.clients.phone}</p>
            <p className="mt-1 text-sm font-semibold text-zinc-800">{client.phone || "—"}</p>
          </div>
          <div className="p-6">
            <UserRound size={17} className="text-[var(--kram-orange)]" />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">{t.clients.created}</p>
            <p className="mt-1 text-sm font-semibold text-zinc-800">{new Date(client.created_at).toLocaleDateString(locale)}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-[var(--kram-border)] bg-white">
          <div className="border-b border-zinc-100 px-5 py-4">
            <h2 className="text-base font-bold text-zinc-950">{t.assets.title}</h2>
            <p className="mt-1 text-xs text-zinc-400">Assets registered to this client.</p>
          </div>
          {assets?.length ? (
            <div className="divide-y divide-zinc-100">
              {assets.map((asset) => (
                <Link
                  key={asset.id}
                  href={`/${locale}/ops/assets/${asset.id}`}
                  className="group flex items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-50/70"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-[var(--kram-orange)]">
                      <Building2 size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-zinc-900">{asset.name}</p>
                      <p className="mt-0.5 text-xs text-zinc-400">{asset.reference_code} · {[asset.city, asset.country_code].filter(Boolean).join(", ") || "—"}</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold capitalize text-zinc-600">{asset.status}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex min-h-56 items-center justify-center p-8 text-center">
              <div>
                <Building2 size={20} className="mx-auto text-zinc-300" />
                <p className="mt-3 text-sm font-semibold text-zinc-700">No assets linked to this client yet.</p>
                <Link href={`/${locale}/ops/assets/new`} className="mt-3 inline-flex text-xs font-bold text-[var(--kram-orange)] hover:underline">Create an asset</Link>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-6">
          <h2 className="text-base font-bold text-zinc-950">Notes</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-600">{client.notes || "No notes have been recorded for this client."}</p>
          <div className="mt-6 border-t border-zinc-100 pt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Record</p>
            <p className="mt-2 text-xs text-zinc-500">Created {new Date(client.created_at).toLocaleString(locale)}</p>
            <p className="mt-1 text-xs text-zinc-500">Updated {new Date(client.updated_at).toLocaleString(locale)}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
