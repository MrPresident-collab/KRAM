import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { writeAudit } from "@/lib/audit";

const schema = z.object({
  fullName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  jobTitle: z.string().trim().min(2).max(160),
  role: z.enum(["owner","admin","regional_admin","operations","finance","support","viewer"]),
  scopeLevel: z.enum(["global","country","branch"]),
  countryId: z.string().uuid().nullable().optional(),
  branchId: z.string().uuid().nullable().optional(),
});

type Membership = {
  organization_id: string;
  role: string;
  scope_level: "global"|"country"|"branch";
  country_id: string|null;
  branch_id: string|null;
};

function canCreateRole(actor: Membership, targetRole: string) {
  if (actor.role === "owner") return true;
  if (actor.role === "admin") return targetRole !== "owner";
  if (actor.role === "regional_admin") return ["operations","finance","support","viewer"].includes(targetRole);
  return false;
}

function scopeAllowed(actor: Membership, targetScope: "global"|"country"|"branch", countryId: string|null, branchId: string|null, branchCountryId?: string|null) {
  if (actor.scope_level === "global") return true;
  if (actor.scope_level === "country") {
    if (targetScope === "global") return false;
    if (!actor.country_id) return false;
    if (targetScope === "country") return countryId === actor.country_id;
    return branchCountryId === actor.country_id;
  }
  return targetScope === "branch" && !!actor.branch_id && branchId === actor.branch_id;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid staff account details." }, { status: 400 });

  const { data: actor, error: actorError } = await supabase
    .from("organization_members")
    .select("organization_id,role,scope_level,country_id,branch_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle<Membership>();

  if (actorError || !actor) return NextResponse.json({ error: "You are not authorized to manage staff." }, { status: 403 });
  if (!["owner","admin","regional_admin"].includes(actor.role)) return NextResponse.json({ error: "You are not authorized to create staff." }, { status: 403 });
  if (!canCreateRole(actor, parsed.data.role)) return NextResponse.json({ error: "You cannot assign that KRAM role." }, { status: 403 });

  let branchCountryId: string|null = null;
  if (parsed.data.countryId) {
    const { data: country } = await supabase.from("countries").select("id").eq("id", parsed.data.countryId).eq("organization_id", actor.organization_id).maybeSingle();
    if (!country) return NextResponse.json({ error: "Selected country is outside your KRAM organization." }, { status: 403 });
  }
  if (parsed.data.branchId) {
    const { data: branch } = await supabase.from("branches").select("id,country_id").eq("id", parsed.data.branchId).eq("organization_id", actor.organization_id).maybeSingle();
    if (!branch) return NextResponse.json({ error: "Selected branch is outside your KRAM organization." }, { status: 403 });
    branchCountryId = branch.country_id;
  }

  const targetCountryId = parsed.data.scopeLevel === "country" ? parsed.data.countryId ?? null : null;
  const targetBranchId = parsed.data.scopeLevel === "branch" ? parsed.data.branchId ?? null : null;
  if (parsed.data.scopeLevel === "country" && !targetCountryId) return NextResponse.json({ error: "A country scope is required." }, { status: 400 });
  if (parsed.data.scopeLevel === "branch" && !targetBranchId) return NextResponse.json({ error: "A branch scope is required." }, { status: 400 });
  if (parsed.data.scopeLevel === "global" && (targetCountryId || targetBranchId)) return NextResponse.json({ error: "Global scope cannot include a country or branch." }, { status: 400 });
  if (!scopeAllowed(actor, parsed.data.scopeLevel, targetCountryId, targetBranchId, branchCountryId)) return NextResponse.json({ error: "The selected scope is outside your authorization." }, { status: 403 });
  if (actor.scope_level === "branch" && actor.role === "admin" && parsed.data.role === "admin" && targetBranchId !== actor.branch_id) return NextResponse.json({ error: "You cannot assign an administrator outside your branch." }, { status: 403 });

  const rate = await supabase.rpc("consume_api_rate_limit", { p_bucket_key: `${userId}:user:staff-invite`, p_limit: 10, p_window_seconds: 60 });
  if (rate.error) return NextResponse.json({ error: `Staff invitation rate-limit check failed: ${rate.error.message}` }, { status: 500 });
  const rateRow = Array.isArray(rate.data) ? rate.data[0] : rate.data;
  if (!rateRow?.allowed) return NextResponse.json({ error: "Too many staff invitations. Please try again shortly." }, { status: 429 });

  const admin = createAdminClient();
  const appUrl = process.env.KRAM_APP_URL || new URL(request.url).origin;
  const redirectTo = `${appUrl.replace(/\/$/, "")}/fr/accept-invite`;

  const { data: invite, error: inviteError } = await admin.auth.admin.inviteUserByEmail(parsed.data.email, {
    redirectTo,
    data: { full_name: parsed.data.fullName },
  });
  if (inviteError || !invite.user) return NextResponse.json({ error: inviteError?.message || "The invitation could not be sent." }, { status: 400 });

  const newUserId = invite.user.id;
  const { error: profileError } = await admin.from("profiles").upsert({
    id: newUserId,
    full_name: parsed.data.fullName,
    work_email: parsed.data.email,
    job_title: parsed.data.jobTitle,
  });
  if (profileError) {
    await admin.auth.admin.deleteUser(newUserId);
    return NextResponse.json({ error: `The staff profile could not be created: ${profileError.message}` }, { status: 500 });
  }

  const { error: membershipError } = await admin.from("organization_members").insert({
    organization_id: actor.organization_id,
    user_id: newUserId,
    role: parsed.data.role,
    scope_level: parsed.data.scopeLevel,
    country_id: targetCountryId,
    branch_id: targetBranchId,
    status: "invited",
  });
  if (membershipError) {
    await admin.auth.admin.deleteUser(newUserId);
    return NextResponse.json({ error: `The staff authorization could not be created: ${membershipError.message}` }, { status: 500 });
  }

  await writeAudit(admin, {
    organizationId: actor.organization_id,
    branchId: targetBranchId,
    actorId: userId,
    action: "staff.invited",
    entityType: "organization_member",
    entityId: newUserId,
    summary: `Staff invitation sent to ${parsed.data.email}`,
    metadata: { role: parsed.data.role, scope_level: parsed.data.scopeLevel, country_id: targetCountryId, branch_id: targetBranchId },
  });

  return NextResponse.json({ success: true });
}
