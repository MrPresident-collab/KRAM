"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type BinActionState = { success: boolean; message: string };

export async function emptyKramBin(
  _previous: BinActionState,
  _formData: FormData,
): Promise<BinActionState> {
  void _previous;
  void _formData;

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;

  if (!userId) {
    return { success: false, message: "Your session is no longer valid." };
  }

  const { data: membership, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id,role,scope_level")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (
    membershipError ||
    !membership ||
    !["owner", "admin", "regional_admin"].includes(membership.role) ||
    !["global", "country"].includes(membership.scope_level)
  ) {
    return {
      success: false,
      message: "Only Global and Regional administrators can empty the bin.",
    };
  }

  const admin = createAdminClient();
  const tables = ["expenses", "work_orders", "inspections", "projects", "reports"] as const;

  for (const table of tables) {
    const { error } = await admin
      .from(table)
      .delete()
      .eq("organization_id", membership.organization_id)
      .not("deleted_at", "is", null);

    if (error) {
      return {
        success: false,
        message: "The bin could not be emptied: " + error.message,
      };
    }
  }

  for (const locale of ["fr", "en", "pt"]) {
    revalidatePath("/" + locale + "/ops/expenses/bin");
    revalidatePath("/" + locale + "/ops/expenses");
    revalidatePath("/" + locale + "/ops/work-orders");
    revalidatePath("/" + locale + "/ops/inspections");
    revalidatePath("/" + locale + "/ops/projects");
    revalidatePath("/" + locale + "/ops/reports");
  }

  return { success: true, message: "KRAM bin emptied successfully." };
}

export async function restoreBinItem(
  _previous: BinActionState,
  fd: FormData,
): Promise<BinActionState> {
  void _previous;

  const id = String(fd.get("id") || "");
  const type = String(fd.get("type") || "");
  const supportedTypes = ["expense", "work_order", "inspection", "project", "report"] as const;

  if (!id || !supportedTypes.includes(type as (typeof supportedTypes)[number])) {
    return { success: false, message: "Invalid bin record." };
  }

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;

  if (!userId) {
    return { success: false, message: "Your session is no longer valid." };
  }

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id,role")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (
    !membership ||
    !["owner", "admin", "regional_admin", "operations", "finance"].includes(membership.role)
  ) {
    return {
      success: false,
      message: "You are not authorized to restore this record.",
    };
  }

  const updatedAt = new Date().toISOString();
  let error: { message: string } | null = null;

  if (type === "expense") {
    error = (
      await supabase
        .from("expenses")
        .update({ deleted_at: null, updated_at: updatedAt })
        .eq("id", id)
        .eq("organization_id", membership.organization_id)
        .not("deleted_at", "is", null)
    ).error;
  } else if (type === "work_order") {
    error = (
      await supabase
        .from("work_orders")
        .update({ deleted_at: null, updated_at: updatedAt })
        .eq("id", id)
        .eq("organization_id", membership.organization_id)
        .not("deleted_at", "is", null)
    ).error;
  } else if (type === "inspection") {
    error = (
      await supabase
        .from("inspections")
        .update({ deleted_at: null, updated_at: updatedAt })
        .eq("id", id)
        .eq("organization_id", membership.organization_id)
        .not("deleted_at", "is", null)
    ).error;
  } else if (type === "project") {
    error = (
      await supabase
        .from("projects")
        .update({ deleted_at: null, updated_at: updatedAt })
        .eq("id", id)
        .eq("organization_id", membership.organization_id)
        .not("deleted_at", "is", null)
    ).error;
  } else {
    error = (
      await supabase
        .from("reports")
        .update({ deleted_at: null, updated_at: updatedAt })
        .eq("id", id)
        .eq("organization_id", membership.organization_id)
        .not("deleted_at", "is", null)
    ).error;
  }

  if (error) {
    return {
      success: false,
      message: "The record could not be restored: " + error.message,
    };
  }

  for (const locale of ["fr", "en", "pt"]) {
    revalidatePath("/" + locale + "/ops/expenses/bin");
    revalidatePath("/" + locale + "/ops/expenses");
    revalidatePath("/" + locale + "/ops/work-orders");
    revalidatePath("/" + locale + "/ops/inspections");
    revalidatePath("/" + locale + "/ops/projects");
    revalidatePath("/" + locale + "/ops/reports");
  }

  return { success: true, message: "Record restored successfully." };
}
