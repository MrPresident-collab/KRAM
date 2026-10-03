import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, CheckCircle2, MapPin, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { copy, isLocale, type Locale } from "@/lib/i18n";

const typeLabels = {
  fr: { residential: "Résidentiel", commercial: "Commercial", construction: "Construction", retail: "Commerce", warehouse: "Entrepôt", land: "Terrain", hospitality: "Hôtellerie", other: "Autre" },
  en: { residential: "Residential", commercial: "Commercial", construction: "Construction", retail: "Retail", warehouse: "Warehouse", land: "Land", hospitality: "Hospitality", other: "Other" },
  pt: { residential: "Residencial", commercial: "Comercial", construction: "Construção", retail: "Comércio", warehouse: "Armazém", land: "Terreno", hospitality: "Hotelaria", other: "Outro" },
} as const;

export default async function AssetDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];
  const supabase = await createClient();

  const { data: asset, error } = await supabase
    .from("assets")
    .select("id,name,reference_code,type,status,country_code,region,city,address,latitude,longitude,description,created_at,updated_at,clients(id,full_name,email,phone)")
    .eq("id", id)
    .maybeSingle();

  if (error || !asset) notFound();

  const client = Array.isArray(asset.clients) ? asset.clients[0] : asset.clients;
  const labels = typeLabels[locale];

  const statusLabel = asset.status === "attention"
    ? locale === "fr" ? "Attention" : locale === "pt" ? "Atenção" : "Needs attention"
    : asset.status === "inactive"
      ? locale === "fr" ? "Inactif" : locale === "pt" ? "Inativo" : "Inactive"
      : asset.status === "archived"
        ? locale === "fr" ? "Archivé" : locale === "pt" ? "Arquivado" : "Archived"
        : locale === "fr" ? "Actif" : locale === "pt" ? "Ativo" : "Active";

  return (
    <div className="space-y-7">
      <Link href={`/${locale}/ops/assets`} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900">
        <ArrowLeft size={15} /> {t.common.back}
      </Link>

      <section className="rounded-2xl border border-[var(--kram-border)] bg-white">
        <div className="flex flex-col gap-5 border-b border-zinc-100 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--kram-charcoal)] text-white">
              <Building2 size={22} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">{t.nav.assets}</p>
              <h1 className="mt-1 text-2xl font-bold tracking-[-0.04em] text-zinc-950">{asset.name}</h1>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">{asset.reference_code}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-[var(--kram-orange)]">{labels[asset.type]}</span>
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-600">{statusLabel}</span>
          </div>
        </div>

        <div className="grid gap-0 md:grid-cols-3">
          <div className="border-b border-zinc-100 p-6 md:border-b-0 md:border-r">
            <MapPin size={17} className="text-[var(--kram-orange)]" />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">{t.assets.location}</p>
            <p className="mt-1 text-sm font-semibold text-zinc-800">{[asset.city, asset.region, asset.country_code].filter(Boolean).join(", ") || "—"}</p>
            <p className="mt-1 text-xs text-zinc-500">{asset.address || "No street address recorded."}</p>
          </div>
          <div className="border-b border-zinc-100 p-6 md:border-b-0 md:border-r">
            <UserRound size={17} className="text-[var(--kram-orange)]" />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">{t.assets.owner}</p>
            {client ? (
              <Link href={`/${locale}/ops/clients/${client.id}`} className="mt-1 block text-sm font-semibold text-zinc-800 hover:text-[var(--kram-orange)]">{client.full_name}</Link>
            ) : <p className="mt-1 text-sm font-semibold text-zinc-500">—</p>}
          </div>
          <div className="p-6">
            <CheckCircle2 size={17} className="text-[var(--kram-orange)]" />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Record</p>
            <p className="mt-1 text-sm font-semibold text-zinc-800">{new Date(asset.created_at).toLocaleDateString(locale)}</p>
            <p className="mt-1 text-xs text-zinc-500">Created</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-zinc-950">Asset control center</h2>
              <p className="mt-1 text-xs text-zinc-400">Operational records attached to this asset.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["Inspections", `/${locale}/ops/inspections`],
              ["Work Orders", `/${locale}/ops/work-orders`],
              ["Projects", `/${locale}/ops/projects`],
              ["Maintenance", `/${locale}/ops/maintenance`],
              ["Expenses", `/${locale}/ops/expenses`],
              ["Reports", `/${locale}/ops/reports`],
            ].map(([label, href]) => (
              <Link key={label} href={href} className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-4 transition hover:border-orange-200 hover:bg-orange-50/30">
                <p className="text-sm font-bold text-zinc-800">{label}</p>
                <p className="mt-1 text-xs text-zinc-400">No records connected yet</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-6">
          <h2 className="text-base font-bold text-zinc-950">Description</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-600">{asset.description || "No description has been recorded for this asset."}</p>
          <div className="mt-6 border-t border-zinc-100 pt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Coordinates</p>
            <p className="mt-2 text-xs text-zinc-500">
              {asset.latitude != null && asset.longitude != null ? `${asset.latitude}, ${asset.longitude}` : "No coordinates recorded yet."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
