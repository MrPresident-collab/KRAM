import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const WINDOW_SECONDS = 60;
const LIMIT = 60;

export async function GET() {
  const supabase = await createClient();
  const { data: claims, error } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (error || !userId) return NextResponse.json({ notifications: [] }, { status: 401 });

  const { data: limitResult } = await supabase.rpc("consume_api_rate_limit", {
    p_bucket_key: userId + ":ops-notifications",
    p_limit: LIMIT,
    p_window_seconds: WINDOW_SECONDS,
  });
  const rate = Array.isArray(limitResult) ? limitResult[0] : limitResult;
  if (rate && rate.allowed === false) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429, headers: { "Retry-After": String(rate.retry_after_seconds ?? WINDOW_SECONDS) } });
  }

  const [approvals, activity] = await Promise.all([
    supabase.from("approvals").select("id,expense_id,status,created_at").eq("status", "pending").order("created_at", { ascending: false }).limit(8),
    supabase.from("audit_logs").select("id,action,summary,created_at").order("created_at", { ascending: false }).limit(8)
  ]);

  const notifications = [
    ...(approvals.data ?? []).map(x => ({ id: "approval-" + x.id, kind: "approval", title: "Approval required", body: "Expense approval is awaiting a decision.", createdAt: x.created_at, href: "/ops/approvals" })),
    ...(activity.data ?? []).map(x => ({ id: "activity-" + x.id, kind: "activity", title: x.action.replaceAll("_", " "), body: x.summary, createdAt: x.created_at, href: "/ops/activity" }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 12);

  return NextResponse.json({ notifications }, { headers: { "Cache-Control": "private, no-store" } });
}
