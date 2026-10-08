import { PerformancePanel } from "./components/performance-panel";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

export default async function OpsDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;

  const { data: membership } = userId
    ? await supabase
        .from("organization_members")
        .select("organization_id,scope_level,country_id,branch_id")
        .eq("user_id", userId)
        .eq("status", "active")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle()
    : { data: null };

  let contextLabel =
    locale === "fr" ? "Vue globale" : locale === "pt" ? "Visão global" : "Global Overview";

  if (membership?.scope_level === "country" && membership.country_id) {
    const { data } = await supabase
      .from("countries")
      .select("name")
      .eq("id", membership.country_id)
      .maybeSingle();

    if (data?.name) {
      contextLabel =
        data.name +
        (locale === "fr" ? " — Vue d’ensemble" : locale === "pt" ? " — Visão geral" : " — Overview");
    }
  } else if (membership?.scope_level === "branch" && membership.branch_id) {
    const { data } = await supabase
      .from("branches")
      .select("name")
      .eq("id", membership.branch_id)
      .maybeSingle();

    if (data?.name) {
      contextLabel =
        data.name +
        (locale === "fr" ? " — Vue d’ensemble" : locale === "pt" ? " — Visão geral" : " — Overview");
    }
  }

  const periodStart = new Date();
  periodStart.setHours(0, 0, 0, 0);
  periodStart.setDate(periodStart.getDate() - 29);

  const { data: organization } = membership?.organization_id
    ? await supabase.from("organizations").select("default_currency").eq("id", membership.organization_id).maybeSingle()
    : { data: null };
  const defaultCurrency = String(organization?.default_currency || "USD").toUpperCase();

  const [
    { data: assetRows },
    { data: attentionRows },
    { data: workOrders },
    { data: expenseRows },
    { data: branchRows },
    { data: clientsRows },
    { data: providerRows },
  ] = await Promise.all([
    supabase
      .from("assets")
      .select("id,name,reference_code,status,branch_id,city,region")
      .order("name"),
    supabase
      .from("assets")
      .select("id,name,reference_code,status,branch_id,city,region")
      .eq("status", "attention")
      .order("updated_at", { ascending: false })
      .limit(8),
    supabase
      .from("work_orders")
      .select("id,status,created_at")
      .is("deleted_at", null),
    supabase
      .from("expenses")
      .select("asset_id,amount,currency,status,expense_date")
      .is("deleted_at", null)
      .gte("expense_date", periodStart.toISOString().slice(0, 10))
      .in("status", ["approved", "paid", "verified"]),
    supabase
      .from("branches")
      .select("id,name,code")
      .eq("is_active", true)
      .order("name"),
    supabase
      .from("clients")
      .select("id")
      .eq("status", "active"),
    supabase
      .from("service_providers")
      .select("id")
      .eq("status", "active")
      .eq("verification_status", "verified"),
  ]);

  const assets = assetRows ?? [];
  const orders = workOrders ?? [];
  const expenses = expenseRows ?? [];

  const assetsTotal = assets.length;
  const assetsActive = assets.filter((row) => row.status === "active").length;
  const attentionAssets = attentionRows?.length ?? 0;
  const openOrders = orders.filter(
    (row) => !["completed", "verified", "closed"].includes(row.status),
  ).length;
  const completedOrders = orders.filter((row) =>
    ["completed", "verified", "closed"].includes(row.status),
  ).length;

  const maintenanceSpend = expenses
    .filter((row) => String(row.currency || "").trim().toUpperCase() === defaultCurrency)
    .reduce((total, row) => total + Number(row.amount || 0), 0);

  const branchNames = new Map((branchRows ?? []).map((row) => [row.id, row.name]));
  const sites = (branchRows ?? [])
    .map((branch) => {
      const siteAssets = assets.filter((asset) => asset.branch_id === branch.id);
      const healthy = siteAssets.filter((asset) => asset.status === "active").length;

      return {
        name: branch.name,
        total: siteAssets.length,
        healthy,
        percent: siteAssets.length ? Math.round((healthy / siteAssets.length) * 100) : 0,
      };
    })
    .filter((site) => site.total > 0);

  const unassignedAssets = assets.filter((asset) => !asset.branch_id);
  if (unassignedAssets.length) {
    const healthy = unassignedAssets.filter((asset) => asset.status === "active").length;
    sites.push({
      name: locale === "fr" ? "Sans agence" : locale === "pt" ? "Sem filial" : "Unassigned",
      total: unassignedAssets.length,
      healthy,
      percent: Math.round((healthy / unassignedAssets.length) * 100),
    });
  }

  return (
    <div className="space-y-6 pb-10">
      <PerformancePanel
        locale={locale}
        contextLabel={contextLabel}
        assetsTotal={assetsTotal}
        assetsActive={assetsActive}
        attentionAssets={attentionAssets}
        maintenanceSpend={maintenanceSpend}
        defaultCurrency={defaultCurrency}
        openOrders={openOrders}
        completedOrders={completedOrders}
        providers={providerRows?.length ?? 0}
        clients={clientsRows?.length ?? 0}
        attentionRows={(attentionRows ?? []).map((row) => ({
          ...row,
          site: row.branch_id
            ? branchNames.get(row.branch_id) ?? row.city ?? row.region ?? ""
            : row.city ?? row.region ?? "",
        }))}
        sites={sites}
      />
    </div>
  );
}
