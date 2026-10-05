import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: claims, error } = await supabase.auth.getClaims();
  if (error || !claims?.claims?.sub) return NextResponse.json({ notifications: [] }, { status: 401 });

  const [approvals, activity] = await Promise.all([
    supabase.from("approvals").select("id,expense_id,status,created_at").eq("status", "requested").order("created_at", { ascending: false }).limit(8),
    supabase.from("audit_logs").select("id,action,summary,created_at").order("created_at", { ascending: false }).limit(8)
  ]);

  const notifications = [
    ...(approvals.data ?? []).map(x => ({ id: "approval-" + x.id, kind: "approval", title: "Approval required", body: "Expense approval is awaiting a decision.", createdAt: x.created_at, href: "/ops/approvals" })),
    ...(activity.data ?? []).map(x => ({ id: "activity-" + x.id, kind: "activity", title: x.action.replaceAll("_", " "), body: x.summary, createdAt: x.created_at, href: "/ops/activity" }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 12);

  return NextResponse.json({ notifications });
}
