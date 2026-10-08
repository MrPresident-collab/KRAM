import { notFound } from "next/navigation";
import { Activity, AlertTriangle, CalendarClock, Gauge, Plus, Wrench } from "lucide-react";
import { isLocale, type Locale, copy } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

export default async function MaintenancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = copy[locale as Locale];
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;

  let organizationId: string | null = null;
  if (userId) {
    const { data: membership } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    organizationId = membership?.organization_id ?? null;
  }

  const [{ data: workOrders }, { data: activeMaintenance }, { data: dueSoon }] = await Promise.all([
    organizationId
      ? supabase
          .from("work_orders")
          .select("id,title,status,priority,asset_id,created_at,updated_at")
          .eq("organization_id", organizationId)
          .is("deleted_at", null)
          .order("created_at", { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [] }),
    organizationId
      ? supabase
          .from("work_orders")
          .select("id", { count: "exact", head: true })
          .eq("organization_id", organizationId)
          .is("deleted_at", null)
          .in("status", ["open", "pending", "in_progress"])
      : Promise.resolve({ count: 0 }),
    organizationId
      ? supabase
          .from("work_orders")
          .select("id", { count: "exact", head: true })
          .eq("organization_id", organizationId)
          .is("deleted_at", null)
          .in("status", ["overdue", "scheduled", "awaiting_parts"])
      : Promise.resolve({ count: 0 }),
  ]);

  const openCount = (workOrders ?? []).filter((row) => !["closed", "completed", "verified"].includes(row.status ?? "")).length;
  const overdueCount = (workOrders ?? []).filter((row) => ["overdue", "scheduled", "awaiting_parts"].includes(row.status ?? "")).length;
  const plannedCount = (workOrders ?? []).filter((row) => ["open", "pending", "in_progress"].includes(row.status ?? "")).length;

  return (
    <div className="space-y-7 pb-8">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--kram-orange)]">Operations</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.06em] text-[var(--kram-deep)] md:text-4xl">Maintenance</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--kram-metal)]">
            Preventive, corrective and scheduled interventions across managed assets and operational sites.
          </p>
        </div>
        <a
          href={`/${locale}/ops/work-orders/new`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--kram-charcoal)] px-4 py-2.5 text-sm font-bold text-white"
        >
          <Plus size={16} /> Create maintenance task
        </a>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Open interventions", value: openCount, hint: "Active work currently requiring action.", icon: Wrench },
          { label: "Planned maintenance", value: plannedCount, hint: "Scheduled or in progress work orders.", icon: CalendarClock },
          { label: "Overdue