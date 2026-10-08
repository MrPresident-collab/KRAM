import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, CheckCircle2, MapPin, UserRound, ClipboardList, ClipboardCheck, FolderKanban, Receipt, FileText, Plus } from "lucide-react";
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
  const [{ data: workOrders }, { data: inspections }, { data: projects }, { data: expenses }, { data: reports }, { count: documentCount }] = await Promise.all([
    supabase.from("work_orders").select("id,title,status,priority,created_at").eq("asset_id", id).order("created_at", { ascending: false }).limit(8),
    supabase.from("inspections").select("id,inspection_type,status,scheduled_for,created_at").eq("asset_id", id).order("created_at", { ascending: false }).limit(8),
    supabase.from("projects").select("id,name,status,progress_percent,updated_at").eq("asset_id", id).order("updated_at", { ascending: false }).limit(8),
    supabase.from("expenses").select("id,description,amount,currency,status,expense_date").eq("asset_id", id).order("expense_date", { ascending: false }).limit(8),
    supabase.from("reports").select("id,title,status,report_type,created_at").eq("asset_id", id).order("created_at", { ascending: false }).limit(8),
    supabase.from("documents").select("id", { count: "exact", head: true }).eq("asset_id", id),
  ]);

  const openWorkOrders = (workOrders ?? []).filter((x) => !["closed", "verified", "completed"].includes(x.status)).length;
  const activeInspections = (inspections ?? []).filter((x) => !["closed", "report_ready"].includes(x.status)).length;
  const activeProjects = (projects ?? []).filter((x) => !["closed", "completed"].includes(x.status)).length;
  const { data: claims } = await supabase.auth.getClaims(); const uid = claims?.claims?.sub; const { data: member } = uid ? await supabase.from("organization_members").select("organization_id").eq("user_id", uid).eq("status", "active").limit(1).maybeSingle() : { data: null }; const { data: organization } = member?.organization_id ? await supabase.from("organizations").select("default_currency").eq("id", member.organization_id).maybeSingle() : { data: null }; const defaultCurrency = String(organization?.default_currency || "USD").toUpperCase(); const expenseAmount = (expenses ?? []).filter((x) => String(x.currency || "").toUpperCase() === defaultCurrency).reduce((sum, x) => sum + Number(x.amount ?? 0), 0); const expenseSummary = new Intl.NumberFormat(locale, { style: "currency", currency: defaultCurrency, maximumFractionDigits: 0 }).format(expenseAmount);

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
            <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-[var(--kram-orange)]">{typeLabels[locale as Locale][asset.type as keyof typeof typeLabels.fr]}</span>
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AssetMetric icon={ClipboardList} label="Open work orders" value={String(openWorkOrders)} />
        <AssetMetric icon={ClipboardCheck} label="Active inspections" value={String(activeInspections)} />
        <AssetMetric icon={FolderKanban} label="Active projects" value={String(activeProjects)} />
        <AssetMetric icon={Receipt} label="Recorded expenses" value={expenseSummary} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-[var(--kram-border)] bg-white">
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
              <div><h2 className="text-base font-bold text-zinc-950">Recent operations</h2><p className="mt-1 text-xs text-zinc-400">Latest work connected to this asset.</p></div>
              <div className="flex items-center gap-2">
                <Link href={`/${locale}/ops/work-orders/new`} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-[11px] font-bold text-zinc-700"><Plus size={13}/> Work order</Link>
                <Link href={`/${locale}/ops/inspections/new`} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--kram-charcoal)] px-2.5 py-1.5 text-[11px] font-bold text-white"><Plus size={13}/> Inspection</Link>
              </div>
            </div>
            {(workOrders?.length || inspections?.length || projects?.length) ? <div className="divide-y divide-zinc-100">
              {(workOrders ?? []).slice(0,4).map((x)=><Link key={"wo-"+x.id} href={`/${locale}/ops/work-orders/${x.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-50"><div><p className="text-sm font-semibold text-zinc-800">{x.title}</p><p className="mt-1 text-xs text-zinc-400">Work Order · {x.priority}</p></div><span className="text-xs font-semibold text-zinc-500">{x.status.replaceAll("_"," ")}</span></Link>)}
              {(inspections ?? []).slice(0,3).map((x)=><Link key={"in-"+x.id} href={`/${locale}/ops/inspections/${x.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-50"><div><p className="text-sm font-semibold text-zinc-800 capitalize">{x.inspection_type.replaceAll("_"," ")}</p><p className="mt-1 text-xs text-zinc-400">Inspection · {x.scheduled_for ? new Date(x.scheduled_for).toLocaleDateString(locale) : "Not scheduled"}</p></div><span className="text-xs font-semibold text-zinc-500">{x.status.replaceAll("_"," ")}</span></Link>)}
              {(projects ?? []).slice(0,2).map((x)=><Link key={"pr-"+x.id} href={`/${locale}/ops/projects/${x.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-50"><div><p className="text-sm font-semibold text-zinc-800">{x.name}</p><p className="mt-1 text-xs text-zinc-400">Project · {x.progress_percent}% complete</p></div><span className="text-xs font-semibold text-zinc-500">{x.status.replaceAll("_"," ")}</span></Link>)}
            </div> : <div className="flex min-h-48 items-center justify-center text-sm text-zinc-400">No operational records yet.</div>}
          </div>

          <div className="rounded-2xl border border-[var(--kram-border)] bg-white">
            <div className="border-b border-zinc-100 px-5 py-4"><h2 className="text-base font-bold">Financial & document records</h2></div>
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              <Link href={`/${locale}/ops/expenses?asset=${id}`} className="rounded-xl border border-zinc-100 p-4 hover:bg-zinc-50"><div className="flex items-center gap-2"><Receipt size={16} className="text-[var(--kram-orange)]"/><span className="text-sm font-bold">Expenses</span></div><p className="mt-2 text-xs text-zinc-400">{expenses?.length ?? 0} recent records</p></Link>
              <Link href={`/${locale}/ops/reports?asset=${id}`} className="rounded-xl border border-zinc-100 p-4 hover:bg-zinc-50"><div className="flex items-center gap-2"><FileText size={16} className="text-[var(--kram-orange)]"/><span className="text-sm font-bold">Reports</span></div><p className="mt-2 text-xs text-zinc-400">{reports?.length ?? 0} reports · {documentCount ?? 0} documents</p></Link>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-6">
            <h2 className="text-base font-bold text-zinc-950">Description</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-600">{asset.description || "No description has been recorded for this asset."}</p>
            <div className="mt-6 border-t border-zinc-100 pt-5"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Coordinates</p><p className="mt-2 text-xs text-zinc-500">{asset.latitude != null && asset.longitude != null ? `${asset.latitude}, ${asset.longitude}` : "No coordinates recorded yet."}</p></div>
          </div>
          <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-6">
            <h2 className="text-base font-bold">Quick actions</h2>
            <div className="mt-4 grid gap-2"><Link href={`/${locale}/ops/projects/new`} className="rounded-xl border border-zinc-100 px-4 py-3 text-xs font-bold text-zinc-700 hover:bg-zinc-50">Start project</Link><Link href={`/${locale}/ops/expenses/new`} className="rounded-xl border border-zinc-100 px-4 py-3 text-xs font-bold text-zinc-700 hover:bg-zinc-50">Record expense</Link><Link href={`/${locale}/ops/reports/new`} className="rounded-xl border border-zinc-100 px-4 py-3 text-xs font-bold text-zinc-700 hover:bg-zinc-50">Create report</Link></div>
          </div>
        </div>
      </section>
    </div>
  );
}

function AssetMetric({icon:Icon,label,value}:{icon:typeof ClipboardList;label:string;value:string}) {
 return <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-5"><Icon size={17} className="text-[var(--kram-orange)]"/><p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">{label}</p><p className="mt-2 text-2xl font-bold text-zinc-950">{value}</p></div>;
}
