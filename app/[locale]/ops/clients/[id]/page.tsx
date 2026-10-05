import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, Mail, Phone, UserRound, ClipboardList, ClipboardCheck, FolderKanban, Receipt, FileText, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { copy, isLocale, type Locale, getDetailUi } from "@/lib/i18n";

export default async function ClientDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];
  const ui = getDetailUi(locale as Locale).client;
  const supabase = await createClient();

  const [{ data: client, error }, { data: assets }] = await Promise.all([
    supabase.from("clients").select("id,full_name,email,primary_phone,alternative_phone,residency_country,residency_city,residency_address,preferred_language,preferred_contact_method,notes,created_at,updated_at").eq("id", id).maybeSingle().eq("id", id).maybeSingle(),
    supabase.from("assets").select("id,name,reference_code,type,status,city,country_code").eq("client_id", id).order("created_at", { ascending: false }),\n    supabase.from("client_authorized_contacts").select("full_name,relationship,primary_phone,alternative_phone,email,residency_country,residency_city,residency_address,preferred_language,preferred_contact_method,same_as_client").eq("client_id", id).eq("status","active").maybeSingle(),
  ]);

  if (error || !client) notFound();

  const initials = client.full_name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0])
    .join("")
    .toUpperCase();

  const assetIds = (assets ?? []).map((asset) => asset.id);

  const [{ data: workOrders }, { data: inspections }, { data: projects }, { data: expenses }, { data: reports }] = assetIds.length
    ? await Promise.all([
        supabase.from("work_orders").select("id,title,status,priority,created_at,asset_id,assets(id,name)").in("asset_id", assetIds).order("created_at", { ascending: false }).limit(12),
        supabase.from("inspections").select("id,inspection_type,status,scheduled_for,created_at,asset_id,assets(id,name)").in("asset_id", assetIds).order("created_at", { ascending: false }).limit(12),
        supabase.from("projects").select("id,name,status,progress_percent,updated_at,asset_id,assets(id,name)").in("asset_id", assetIds).order("updated_at", { ascending: false }).limit(12),
        supabase.from("expenses").select("id,description,amount,currency,status,expense_date,asset_id,assets(id,name)").in("asset_id", assetIds).order("expense_date", { ascending: false }).limit(12),
        supabase.from("reports").select("id,title,status,report_type,created_at,asset_id,assets(id,name)").in("asset_id", assetIds).order("created_at", { ascending: false }).limit(12),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }, { data: [] }];

  const openWorkOrders = (workOrders ?? []).filter((x) => !["closed", "verified", "completed"].includes(x.status)).length;
  const activeInspections = (inspections ?? []).filter((x) => !["closed", "report_ready"].includes(x.status)).length;
  const activeProjects = (projects ?? []).filter((x) => !["completed", "closed"].includes(x.status)).length;
  const expenseTotals = (expenses ?? []).reduce<Record<string, number>>((sum, row) => {
    const currency = row.currency || "—";
    sum[currency] = (sum[currency] || 0) + Number(row.amount || 0);
    return sum;
  }, {});
  const expenseSummary = Object.entries(expenseTotals).map(([currency, amount]) => amount.toLocaleString() + " " + currency).join(" · ") || "0";

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
            <p className="mt-1 text-sm font-semibold text-zinc-800">{client.primary_phone || "—"}</p>
          </div>
          <div className="p-6">
            <UserRound size={17} className="text-[var(--kram-orange)]" />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">{t.clients.created}</p>
            <p className="mt-1 text-sm font-semibold text-zinc-800">{new Date(client.created_at).toLocaleDateString(locale)}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryMetric icon={Building2} label={ui.asset + "s"} value={String(assets?.length ?? 0)} />
        <SummaryMetric icon={ClipboardList} label={ui.openWorkOrders} value={String(openWorkOrders)} />
        <SummaryMetric icon={ClipboardCheck} label={ui.activeInspections} value={String(activeInspections)} />
        <SummaryMetric icon={FolderKanban} label={ui.activeProjects} value={String(activeProjects)} />
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <InfoCard title={ui.contactDetails}>
          <InfoRow label={t.clients.email} value={client.email} />
          <InfoRow label={ui.primaryPhone} value={client.primary_phone} />
          <InfoRow label={ui.alternativePhone} value={client.alternative_phone} />
        </InfoCard>
        <InfoCard title={ui.residency}>
          <InfoRow label={ui.country} value={client.residency_country} />
          <InfoRow label={ui.city} value={client.residency_city} />
          <InfoRow label={ui.address} value={client.residency_address} />
        </InfoCard>
        <InfoCard title={ui.preferences}>
          <InfoRow label={ui.language} value={ui.languageValues[client.preferred_language as keyof typeof ui.languageValues] ?? client.preferred_language} />
          <InfoRow label={ui.contactMethod} value={ui.methodValues[client.preferred_contact_method as keyof typeof ui.methodValues] ?? client.preferred_contact_method} />
        </InfoCard>
      </section>
      <section className="rounded-2xl border border-[var(--kram-border)] bg-white p-6">
        <div className="flex items-start justify-between gap-4"><div><h2 className="text-base font-bold text-zinc-950">{ui.trusted}</h2><p className="mt-1 text-xs text-zinc-400">{trustedContact?.relationship || "—"}</p></div></div>
        {trustedContact ? <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoRow label={t.clients.name} value={trustedContact.full_name} />
          <InfoRow label={t.clients.email} value={trustedContact.email} />
          <InfoRow label={ui.primaryPhone} value={trustedContact.primary_phone} />
          <InfoRow label={ui.alternativePhone} value={trustedContact.alternative_phone} />
          <InfoRow label={ui.country} value={trustedContact.residency_country} />
          <InfoRow label={ui.city} value={trustedContact.residency_city} />
          <InfoRow label={ui.address} value={trustedContact.residency_address} />
        </div> : <p className="mt-4 text-sm text-zinc-400">—</p>}
      </section>
      <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-[var(--kram-border)] bg-white">
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
              <div><h2 className="text-base font-bold text-zinc-950">{ui.clientOperations}</h2><p className="mt-1 text-xs text-zinc-400">{ui.clientOperationsDesc}</p></div>
              <Link href={`/${locale}/ops/assets/new`} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--kram-charcoal)] px-2.5 py-1.5 text-[11px] font-bold text-white"><Plus size={13}/> Asset</Link>
            </div>
            {(workOrders?.length || inspections?.length || projects?.length) ? <div className="divide-y divide-zinc-100">
              {(workOrders ?? []).slice(0,4).map((x) => { const a = Array.isArray(x.assets) ? x.assets[0] : x.assets; return <Link key={x.id} href={`/${locale}/ops/work-orders/${x.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-50"><div><p className="text-sm font-semibold text-zinc-800">{x.title}</p><p className="mt-1 text-xs text-zinc-400">{ui.workOrder} · {a?.name ?? ui.asset} · {x.priority}</p></div><span className="text-xs font-semibold capitalize text-zinc-500">{x.status.replaceAll("_"," ")}</span></Link>; })}
              {(inspections ?? []).slice(0,3).map((x) => { const a = Array.isArray(x.assets) ? x.assets[0] : x.assets; return <Link key={x.id} href={`/${locale}/ops/inspections/${x.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-50"><div><p className="text-sm font-semibold capitalize text-zinc-800">{x.inspection_type.replaceAll("_"," ")}</p><p className="mt-1 text-xs text-zinc-400">{ui.inspection} · {a?.name ?? ui.asset}</p></div><span className="text-xs font-semibold capitalize text-zinc-500">{x.status.replaceAll("_"," ")}</span></Link>; })}
              {(projects ?? []).slice(0,3).map((x) => { const a = Array.isArray(x.assets) ? x.assets[0] : x.assets; return <Link key={x.id} href={`/${locale}/ops/projects/${x.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-zinc-50"><div><p className="text-sm font-semibold text-zinc-800">{x.name}</p><p className="mt-1 text-xs text-zinc-400">{ui.project} · {a?.name ?? ui.asset} · {x.progress_percent}%</p></div><span className="text-xs font-semibold capitalize text-zinc-500">{x.status.replaceAll("_"," ")}</span></Link>; })}
            </div> : <div className="min-h-48 flex items-center justify-center text-sm text-zinc-400">{ui.noActivity}</div>}
          </div>

          <div className="rounded-2xl border border-[var(--kram-border)] bg-white">
            <div className="border-b border-zinc-100 px-5 py-4"><h2 className="text-base font-bold">{ui.financial}</h2></div>
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              <Link href={`/${locale}/ops/expenses`} className="rounded-xl border border-zinc-100 p-4 hover:bg-zinc-50"><div className="flex items-center gap-2"><Receipt size={16} className="text-[var(--kram-orange)]"/><span className="text-sm font-bold">{ui.expense}</span></div><p className="mt-2 text-xs text-zinc-400">{expenseSummary}</p></Link>
              <Link href={`/${locale}/ops/reports`} className="rounded-xl border border-zinc-100 p-4 hover:bg-zinc-50"><div className="flex items-center gap-2"><FileText size={16} className="text-[var(--kram-orange)]"/><span className="text-sm font-bold">{ui.reports}</span></div><p className="mt-2 text-xs text-zinc-400">{reports?.length ?? 0} {ui.linkedReports}</p></Link>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-[var(--kram-border)] bg-white">
            <div className="border-b border-zinc-100 px-5 py-4"><h2 className="text-base font-bold text-zinc-950">{ui.assets}</h2><p className="mt-1 text-xs text-zinc-400">{ui.assetsDesc}</p></div>
            {assets?.length ? <div className="divide-y divide-zinc-100">{assets.map((asset) => <Link key={asset.id} href={`/${locale}/ops/assets/${asset.id}`} className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-zinc-50/70"><div className="min-w-0"><p className="truncate text-sm font-bold text-zinc-900">{asset.name}</p><p className="mt-0.5 text-xs text-zinc-400">{asset.reference_code} · {[asset.city,asset.country_code].filter(Boolean).join(", ") || "—"}</p></div><span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold capitalize text-zinc-600">{asset.status}</span></Link>)}</div> : <div className="p-7 text-center"><Building2 size={20} className="mx-auto text-zinc-300"/><p className="mt-3 text-sm font-semibold text-zinc-700">{ui.noAssets}</p><Link href={`/${locale}/ops/assets/new`} className="mt-3 inline-flex text-xs font-bold text-[var(--kram-orange)]">{ui.createAsset}</Link></div>}
          </div>

          <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-6"><div><h2 className="text-base font-bold text-zinc-950">{ui.notes}</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-600">{client.notes || ui.noNotes}</p></div><div className="mt-6 border-t border-zinc-100 pt-5"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">{ui.record}</p><p className="mt-2 text-xs text-zinc-500">{ui.created} {new Date(client.created_at).toLocaleString(locale)}</p><p className="mt-1 text-xs text-zinc-500">{ui.updated} {new Date(client.updated_at).toLocaleString(locale)}</p></div></div>
        </div>
      </section>
    </div>
  );
}


function InfoCard({title,children}:{title:string;children:React.ReactNode}) {
 return <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-5"><h2 className="text-sm font-bold text-zinc-950">{title}</h2><div className="mt-4 space-y-3">{children}</div></div>;
}
function InfoRow({label,value}:{label:string;value:string|null|undefined}) {
 return <div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400">{label}</p><p className="mt-1 text-sm font-semibold text-zinc-800">{value || "—"}</p></div>;
}
function SummaryMetric({icon:Icon,label,value}:{icon:typeof Building2;label:string;value:string}) {
 return <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-5"><Icon size={17} className="text-[var(--kram-orange)]"/><p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">{label}</p><p className="mt-2 text-2xl font-bold text-zinc-950">{value}</p></div>;
}
