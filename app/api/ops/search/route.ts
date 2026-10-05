import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const WINDOW_SECONDS = 60;
const LIMIT = 30;

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: claims, error: claimsError } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (claimsError || !userId) return NextResponse.json({ results: [] }, { status: 401 });

  const { data: limitResult } = await supabase.rpc("consume_api_rate_limit", {
    p_bucket_key: "ops-search:user:" + userId,
    p_limit: LIMIT,
    p_window_seconds: WINDOW_SECONDS,
  });
  const rate = Array.isArray(limitResult) ? limitResult[0] : limitResult;
  if (rate && rate.allowed === false) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, {
      status: 429,
      headers: { "Retry-After": String(rate.retry_after_seconds ?? WINDOW_SECONDS) }
    });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() || "";
  if (q.length < 2 || q.length > 100) return NextResponse.json({ results: [] });

  const pattern = "%" + q.replace(/[%_]/g, "\$&") + "%";
  const [assets, clients, workOrders, projects, inspections, providers, reports, documents] = await Promise.all([
    supabase.from("assets").select("id,name,reference_code").or("name.ilike." + pattern + ",reference_code.ilike." + pattern).limit(6),
    supabase.from("clients").select("id,full_name,email").or("full_name.ilike." + pattern + ",email.ilike." + pattern).limit(6),
    supabase.from("work_orders").select("id,title,category,status").or("title.ilike." + pattern + ",category.ilike." + pattern).limit(6),
    supabase.from("projects").select("id,name,status").ilike("name", pattern).limit(6),
    supabase.from("inspections").select("id,inspection_type,status,summary").or("inspection_type.ilike." + pattern + ",summary.ilike." + pattern).limit(6),
    supabase.from("service_providers").select("id,name,phone,verification_status").or("name.ilike." + pattern + ",phone.ilike." + pattern).limit(6),
    supabase.from("reports").select("id,title,status,report_type").or("title.ilike." + pattern + ",report_type.ilike." + pattern).limit(6),
    supabase.from("documents").select("id,file_name,document_type").or("file_name.ilike." + pattern + ",document_type.ilike." + pattern).limit(6),
  ]);

  const results = [
    ...(assets.data ?? []).map(x => ({ type: "Asset", title: x.name, meta: x.reference_code, href: "/ops/assets/" + x.id })),
    ...(clients.data ?? []).map(x => ({ type: "Client", title: x.full_name, meta: x.email, href: "/ops/clients/" + x.id })),
    ...(workOrders.data ?? []).map(x => ({ type: "Work order", title: x.title, meta: x.status, href: "/ops/work-orders/" + x.id })),
    ...(projects.data ?? []).map(x => ({ type: "Project", title: x.name, meta: x.status, href: "/ops/projects/" + x.id })),
    ...(inspections.data ?? []).map(x => ({ type: "Inspection", title: x.inspection_type, meta: x.status, href: "/ops/inspections/" + x.id })),
    ...(providers.data ?? []).map(x => ({ type: "Provider", title: x.name, meta: x.verification_status, href: "/ops/providers/" + x.id })),
    ...(reports.data ?? []).map(x => ({ type: "Report", title: x.title, meta: x.status, href: "/ops/reports/" + x.id })),
    ...(documents.data ?? []).map(x => ({ type: "Document", title: x.file_name, meta: x.document_type, href: "/ops/documents" })),
  ].slice(0, 30);

  return NextResponse.json({ results }, { headers: { "Cache-Control": "private, no-store" } });
}
