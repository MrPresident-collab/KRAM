"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const countrySchema = z.object({
  name: z.string().trim().min(2).max(100),
  code: z.string().trim().toLowerCase().regex(/^[a-z]{2,3}$/, "Country code must contain 2 or 3 lowercase letters.")
});

export type CountryActionState = { success: boolean; message: string };

export async function createCountry(_previousState: CountryActionState, formData: FormData): Promise<CountryActionState> {
  const parsed = countrySchema.safeParse({ name: formData.get("name"), code: formData.get("code") });
  if (!parsed.success) return { success: false, message: "Enter a country name and a 2–3 letter lowercase code, for example drc or rsa." };

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) return { success: false, message: "Your session is no longer valid. Please sign in again." };

  const { data: membership, error: membershipError } = await supabase.from("organization_members")
    .select("organization_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .eq("role", "owner")
    .eq("scope_level", "global")
    .limit(1)
    .maybeSingle();

  if (membershipError || !membership) return { success: false, message: "You are not authorized to create countries." };

  const { error } = await supabase.from("countries").insert({
    organization_id: membership.organization_id,
    name: parsed.data.name,
    code: parsed.data.code
  });

  if (error) {
    if (error.code === "23505") return { success: false, message: "A country with this code already exists." };
    return { success: false, message: "The country could not be created: " + error.message };
  }

  revalidatePath("/fr/ops/settings/countries");
  revalidatePath("/en/ops/settings/countries");
  revalidatePath("/pt/ops/settings/countries");
  return { success: true, message: "Country created successfully." };
}
