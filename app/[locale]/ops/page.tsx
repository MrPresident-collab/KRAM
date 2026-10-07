
import { PerformancePanel } from "./components/performance-panel";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

type CountFilter =
  | { column: string; operator: "eq"; value: string }
  | { column: string; operator: "not"; value: string };

async function countRows(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: string,
  filter?: CountFilter,
) {
  let query = supabase.from(table).select("id", { count: "exact", head: true });
  if (filter?.operator === "eq") query = query.eq(filter.column, filter.value);
  if (filter?.operator === "not") query = query.not(filter.column, "in", filter.value);
  const { count } = await query;
  return count ?? 0;
}

export default async function OpsDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;

  const [{ data: membership }] = await Promise.all([
    userId ? supabase.from("organization_members").select("scope_level,country_id,branch_id").eq("user_id", userId).limit(1).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  let contextLabel = locale === "fr" ? "Vue globale" : locale === "pt" ? "Visão global" : "Global Overview";
  if (membership?.scope_level === "country" && membership.country_id) {
    const { data } = await supabase.from("countries").select("name").eq("id", membership.country_id).maybeSingle();
    if (data?.name) contextLabel = data.name + (locale === "fr" ? " — Vue d’ensemble" : locale === "pt" ? " — Visão geral" : " — Overview");
  } else if (membership?.scope_level === "branch" && membership.branch_id) {
    const { data } = await supabase.from("branches").select("name").eq("id", membership.branch_id).maybeSingle();
    if (data?.name) contextLabel = data.name + (locale === "fr" ? " — Vue d’ensemble" : locale === "pt" ? " — Visão geral" : " — Overview");
  }


  const periodStart = new Date();
  periodStart.setHours(0, 0, 0, 0);
  periodStart.setDate(periodStart.getDate() - 29);

  const [
    { data: assetRows },
    { data: attentionRows },
    { data: workOrders },
    { data: expenseRows },
    { data: branchRows },
    { data: clientsRows },
    { data: providerRows },
  ] = await Promise.all([
    supabase.from("assets").select("id,name,reference_code,status,branch_id,city,region").order("name"),
    supabase.from("assets").select("id,name,reference_code,status,branch_id,city,region").eq("status", "attention").order("updated_at", { ascending: false }).limit(8),
    supabase.from("work_orders").select("id,status,created_at").is("deleted_at", null),
    supabase.from("expenses").select("asset_id,amount,currency,status,expense_date").is("deleted_at", null).gte("expense_date", periodStart.toISOString().slice(0, 10)).in("status", ["approved", "paid", "verified"]),
    supabase.from("branches").select("id,name,code").eq("is_active", true).order("name"),
    supabase.from("clients").select("id").eq("status", "active"),
    supabase.from("service_providers").select("id").eq("status", "active").eq("verification_status", "verified"),
  ]);

  const assetsTotal = assetRows?.length ?? 0;
  const assetsActive = assetRows?.filter(row => row.status === "active").length ?? 0;
  const attentionAssets = attentionRows?.length ?? 0;
  const openOrders = workOrders?.filter(row => !["completed", "verified", "closed"].includes(row.status)).length ?? 0;
  const completedOrders = workOrders?.filter(row => ["completed", "verified", "closed"].includes(row.status)).length ?? 0;
  const maintenanceSpend = (expenseRows ?? []).reduce((sum, row) => sum + Number(row.amount || 0), 0);

  const branchNames = new Map((branchRows ?? []).map(row => [row.id, row.name]));
  const sites = (branchRows ?? []).map(branch => {
    const siteAssets = (assetRows ?? []).filter(asset => asset.branch_id === branch.id);
    const healthy = siteAssets.filter(asset => asset.status === "active").length;
    return {
      name: branch.name,
      total: siteAssets.length,
      healthy,
      percent: siteAssets.length ? Math.round((healthy / siteAssets.length) * 100) : 0,
    };
  }).filter(site => site.total > 0);

  return <div className="space-y-6 pb-10">
    <PerformancePanel
      locale={locale}
      contextLabel={contextLabel}
      assetsTotal={assetsTotal}
      assetsActive={assetsActive}
      attentionAssets={attentionAssets}
      maintenanceSpend={maintenanceSpend}
      openOrders={openOrders}
      completedOrders={completedOrders}
      providers={providerRows?.length ?? 0}
      clients={clientsRows?.length ?? 0}
      attentionRows={(attentionRows ?? []).map(row => ({ ...row, site: row.branch_id ? (branchNames.get(row.branch_id) ?? row.city ?? row.region ?? "") : (row.city ?? row.region ?? "") }))}
      sites={sites}
    />
  </div>;
}
