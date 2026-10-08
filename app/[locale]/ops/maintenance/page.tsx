import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, CalendarClock, ClipboardList, Plus, Wrench } from "lucide-react";
import { isLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

const maintenanceCategories = ["preventive_maintenance", "corrective_maintenance"];

export default async function MaintenancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;

  const { data: membership } = userId
    ? await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", userId)
        .eq("status", "active")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle()
    : { data: null };

  const organizationId = membership?.organization_id ?? null;

  const { data: maintenanceOrders } = organizationId
    ? await supabase
        .from("work_orders")
        .select("id,title,status,priority,category,asset_id,created_at,updated_at,assets(id,name,reference_code)")
        .eq("organization_id", organizationId)
        .is("deleted_at", null)
        .in("category", maintenanceCategories)
        .order("created_at", { ascending: false })
    : { data: [] };

  const orders = maintenanceOrders ?? [];
  const terminal = ["completed", "verified", "closed"];
  const activeOrders = orders.filter((order) => !terminal.includes(order.status));
  const preventiveOrders = orders.filter((order) => order.category === "preventive_maintenance" && !terminal.includes(order.status));
  const attentionOrders = orders.filter(
    (order) => !terminal.includes(order.status) && ["high", "urgent", "awaiting_evidence"].includes(order.priority === "high" || order.priority === "urgent" ? order.priority : order.status),
  );

  const labels =
    locale === "fr"
      ? {
          eyebrow: "Opérations",
          title: "Maintenance",
          description: "Suivez les interventions préventives et correctives liées aux actifs gérés.",
          create: "Créer une tâche de maintenance",
          active: "Interventions actives",
          preventive: "Maintenance préventive",
          attention: "À surveiller",
          queue: "File de maintenance",
          queueDesc: "Interventions de maintenance actuellement ouvertes.",
          empty: "Aucune intervention de maintenance active.",
          open: "Ouvrir",
          priority: "Priorité",
          status: "Statut",
          asset: "Actif",
        }
      : locale === "pt"
        ? {
            eyebrow: "Operações",
            title: "Manutenção",
            description: "Acompanhe as intervenções preventivas e corretivas ligadas aos ativos geridos.",
            create: "Criar tarefa de manutenção",
            active: "Intervenções ativas",
            preventive: "Manutenção preventiva",
            attention: "A vigiar",
            queue: "Fila de manutenção",
            queueDesc: "Intervenções de manutenção atualmente abertas.",
            empty: "Nenhuma intervenção de manutenção ativa.",
            open: "Abrir",
            priority: "Prioridade",
            status: "Estado",
            asset: "Ativo",
          }
        : {
            eyebrow: "Operations",
            title: "Maintenance",
            description: "Track preventive and corrective interventions connected to managed assets.",
            create: "Create maintenance task",
            active: "Active interventions",
            preventive: "Preventive maintenance",
            attention: "Needs attention",
            queue: "Maintenance queue",
            queueDesc: "Maintenance interventions currently requiring action.",
            empty: "No active maintenance interventions.",
            open: "Open",
            priority: "Priority",
            status: "Status",
            asset: "Asset",
          };

  return (
    <div className="space-y-7 pb-8">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--kram-orange)]">{labels.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.06em] text-[var(--kram-deep)] md:text-4xl">{labels.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--kram-metal)]">{labels.description}</p>
        </div>
        <Link
          href={`/${locale}/ops/work-orders/new`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--kram-charcoal)] px-4 py-2.5 text-sm font-bold text-white"
        >
          <Plus size={16} /> {labels.create}
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Metric icon={Wrench} label={labels.active} value={activeOrders.length} />
        <Metric icon={CalendarClock} label={labels.preventive} value={preventiveOrders.length} />
        <Metric icon={AlertTriangle} label={labels.attention} value={attentionOrders.length} />
      </section>

      <section className="rounded-3xl border border-[var(--kram-border)] bg-white">
        <div className="flex items-center gap-3 border-b border-[var(--kram-border)] px-5 py-4 md:px-6">
          <ClipboardList size={17} className="text-[var(--kram-orange)]" />
          <div>
            <h2 className="text-base font-black tracking-[-0.03em] text-[var(--kram-deep)]">{labels.queue}</h2>
            <p className="mt-1 text-xs text-[var(--kram-metal)]">{labels.queueDesc}</p>
          </div>
        </div>

        {activeOrders.length ? (
          <div className="divide-y divide-[var(--kram-border)]">
            {activeOrders.slice(0, 20).map((order) => {
              const asset = Array.isArray(order.assets) ? order.assets[0] : order.assets;
              return (
                <Link
                  key={order.id}
                  href={`/${locale}/ops/work-orders/${order.id}`}
                  className="grid gap-3 px-5 py-4 transition hover:bg-[var(--kram-bg)] md:grid-cols-[1.6fr_1fr_auto_auto] md:items-center md:px-6"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[var(--kram-deep)]">{order.title}</p>
                    <p className="mt-1 truncate text-xs text-[var(--kram-metal)]">
                      {labels.asset}: {asset?.name ?? "—"}{asset?.reference_code ? ` · ${asset.reference_code}` : ""}
                    </p>
                  </div>
                  <span className="text-xs font-semibold capitalize text-[var(--kram-metal)]">{order.status.replaceAll("_", " ")}</span>
                  <span className="rounded-full border border-[var(--kram-border)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--kram-metal)]">
                    {order.priority}
                  </span>
                  <span className="text-xs font-bold text-[var(--kram-charcoal)]">{labels.open} →</span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[220px] items-center justify-center px-6 py-10 text-center text-sm text-[var(--kram-metal)]">{labels.empty}</div>
        )}
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Wrench; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-5">
      <Icon size={18} className="text-[var(--kram-orange)]" />
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kram-metal)]">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-[-0.06em] text-[var(--kram-deep)]">{value}</p>
    </div>
  );
}
