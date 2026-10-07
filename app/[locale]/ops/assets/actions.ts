"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  name: z.string().trim().min(2).max(160),
  type: z.enum(["residential","commercial","construction","retail","warehouse","land","hospitality","other"]),
  countryId: z.string().uuid(),
  branchId: z.string().uuid().optional().or(z.literal("")),
  city: z.string().trim().min(2).max(100),
  address: z.string().trim().max(300).optional(),
  description: z.string().trim().max(2000).optional(),
  clientId: z.string().uuid().optional().or(z.literal("")),
});

export type AssetActionState = { success: boolean; message: string };

export async function createAssetRecord(_prev: AssetActionState, formData: FormData): Promise<AssetActionState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    countryId: formData.get("countryId"),
    branchId: formData.get("branchId"),
    city: formData.get("city"),
    address: formData.get("address"),
    description: formData.get("description"),
    clientId: formData.get("clientId"),
  });
  if (!parsed.success) return { success: false, message: "Please complete the required asset fields." };

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return { success: false, message: "Your session is no longer valid." };

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id,role,scope_level,country_id,branch_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!membership) return { success: false, message: "You are not authorized to create assets." };

  const { data: country } = await supabase
    .from("countries")
    .select("id,code")
    .eq("id", parsed.data.countryId)
    .eq("organization_id", membership.organization_id)
    .maybeSingle();

  if (!country) return { success: false, message: "The selected country is not available to your KRAM scope." };

  if (membership.scope_level === "branch" && parsed.data.branchId !== membership.branch_id) return { success: false, message: "The selected branch is outside your scope." };
  if (membership.scope_level === "country" && country.id !== membership.country_id) return { success: false, message: "The selected country is outside your scope." };

  const branchId: string | null = parsed.data.branchId || null;
  if (branchId) {
    const { data: branch } = await supabase
      .from("branches")
      .select("id,country_id")
      .eq("id", branchId)
      .eq("organization_id", membership.organization_id)
      .maybeSingle();

    if (!branch || branch.country_id !== country.id) return { success: false, message: "The selected branch does not belong to that country." };
  }

  const referenceCode = `${country.code.toUpperCase()}-${crypto.randomUUID().replaceAll("-", "").slice(0, 4).toUpperCase()}`;

  const { error } = await supabase.from("assets").insert({
    organization_id: membership.organization_id,
    name: parsed.data.name,
    reference_code: referenceCode,
    type: parsed.data.type,
    country_code: country.code.toUpperCase(),
    branch_id: branchId,
    city: parsed.data.city,
    address: parsed.data.address || null,
    description: parsed.data.description || null,
    client_id: parsed.data.clientId || null,
  });

  if (error) {
    if (error.code === "23505") return { success: false, message: "KRAM could not generate a unique reference. Please try again." };
    return { success: false, message: `The asset could not be created: ${error.message}` };
  }

  revalidatePath("/fr/ops/assets");
  revalidatePath("/en/ops/assets");
  revalidatePath("/pt/ops/assets");
  return { success: true, message: `Asset created successfully — ${referenceCode}.` };
}
