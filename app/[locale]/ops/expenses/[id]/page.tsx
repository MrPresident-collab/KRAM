import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Receipt } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { copy, isLocale, type Locale } from "@/lib/i18n";
import { ExpenseActions } from "./actions-ui";
import { ExpenseEditForm } from "./edit-form";

export default async function ExpenseDetail({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();

  const t = copy[locale as Locale];
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub ?? "";
  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();
  const { data: organization } = membership?.organization_id
    ? await supabase
        .from("organizations")
        .select("default_currency")
        .eq("id", membership.organization_id)
        .maybeSingle()
    : { data: null };
  const defaultCurrency = String(organization?.default_currency || "USD").toUpperCase();

  const { data: expense } = await supabase
    .from("expenses")
    .select(
      "id,description,category,amount,currency,status,paid_to,payment_method,paid_at,expense_date,evidence_url,notes,created_at,assets(id,name,reference_code),work_orders(id,title,status),projects(id,name,status),service_providers(id,name),profiles!expenses_created_by_fkey(full_name)",
    )
    .eq("id", id)
    .maybeSingle();

  if (!expense) notFound();

  const { data: lastEdit } = await supabase
    .from("audit_logs")
    .select("created_at,actor_id")
    .eq("organization_id", membership?.organization_id ?? "")
    .eq("entity_type", "expense")
    .eq("entity_id", id)
    .eq("action", "expense.updated")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data: lastEditor } = lastEdit?.actor_id
    ? await supabase.from("profiles").select("full_name").eq("id", lastEdit.actor_id).maybeSingle()
    : { data: null };

  const paymentMethod = expense.payment_method
    ? String(expense.payment_method).replace(/_/g, " ")
    : "Not recorded";
  const asset = Array.isArray(expense.assets) ? expense.assets[0] : expense.assets;
  const project = Array.isArray(expense.projects) ? expense.projects[0] : expense.projects;
  const workOrder = Array.isArray(expense.work_orders)
    ? expense.work_orders[0]
    : expense.work_orders;
  const provider = Array.isArray(expense.service_providers)
    ? expense.service_providers[0]
    : expense.service_providers;

  return (
    <div className="space-y-7">
      <Link
        href={`/${locale}/ops/expenses`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500"
      >
        <ArrowLeft size={15} />
        {t.common.back}
      </Link>

      <section className="rounded-2xl border border-[var(--kram-border)] bg-white">
        <div className="flex flex-col justify-between gap-5 border-b border-zinc-100 px-6 py-6 md:flex-row md:items-start">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--kram-charcoal)] text-white">
              <Receipt size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">
                Finance
              </p>
              <h1 className="mt-1 text-2xl font-bold text-zinc-950">{expense.description}</h1>
              <p className="mt-1 text-xs text-zinc-400">
                {expense.category} · {expense.expense_date}
              </p>
            </div>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-bold capitalize">
            <CheckCircle2
              size={14}
              className={expense.status === "verified" ? "text-emerald-600" : "text-zinc-400"}
            />
            {expense.status}
          </span>
        </div>

        <div className="grid md:grid-cols-3">
          <div className="border-b border-zinc-100 p-6 md:border-b-0 md:border-r">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Amount</p>
            <p className="mt-2 text-2xl font-bold text-zinc-950">
              {new Intl.NumberFormat(locale, {
                style: "currency",
                currency: expense.currency || defaultCurrency,
                maximumFractionDigits: 2,
              }).format(Number(expense.amount))}
            </p>
          </div>
          <div className="border-b border-zinc-100 p-6 md:border-b-0 md:border-r">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Paid to</p>
            <p className="mt-2 text-sm font-semibold text-zinc-800">
              {expense.paid_to || "Not recorded"}
            </p>
          </div>
          <div className="p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Provider</p>
            <p className="mt-2 text-sm font-semibold text-zinc-800">{provider?.name || "Not linked"}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.7fr]">
        <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-6">
          <h2 className="text-base font-bold">Operational context</h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Asset</dt>
              <dd className="mt-1 text-sm font-semibold">{asset?.name || "Not linked"}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Work Order</dt>
              <dd className="mt-1 text-sm font-semibold">{workOrder?.title || "Not linked"}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Project</dt>
              <dd className="mt-1 text-sm font-semibold">{project?.name || "Not linked"}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Payment Method</dt>
              <dd className="mt-1 text-sm font-semibold capitalize">{paymentMethod}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Paid At</dt>
              <dd className="mt-1 text-sm font-semibold">
                {expense.paid_at ? new Date(expense.paid_at).toLocaleString(locale) : "Not paid yet"}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Created</dt>
              <dd className="mt-1 text-sm font-semibold">{new Date(expense.created_at).toLocaleString(locale)}</dd>
            </div>
            {lastEdit && <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Last edited</dt>
              <dd className="mt-1 text-sm font-semibold">{new Date(lastEdit.created_at).toLocaleString(locale)}</dd>
              <dd className="mt-1 text-xs text-zinc-500">{lastEditor?.full_name || "Staff member"}</dd>
            </div>}
          </dl>
          <div className="mt-6 border-t border-zinc-100 pt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">Notes</p>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{expense.notes || "No notes recorded."}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-6">
          <h2 className="text-base font-bold">Workflow</h2>
          <p className="mt-2 text-sm text-zinc-500">Move this expense through KRAM’s financial control states.</p>
          <div className="mt-5">
            <ExpenseActions expenseId={expense.id} status={expense.status} />
          </div>
        </div>
      </section>

      <ExpenseEditForm expense={expense} />
    </div>
  );
}
