"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const countrySchema = z.object({
  name: z.string().trim().min(2).max(100),
  code: z.string().trim().toUpperCase().regex(/^[A-Z]{2,3}$/, "Country code must contain 2 or 3 letters.")
});

export type CountryActionState = { success: boolean; message: string };

export async function createCountry(_previousState: CountryActionState, formData: FormData): Promise<CountryActionState> {
  const parsed = countrySchema.safeParse({ name: formData.get("name"), code: formData.get("code") });
  if (!parsed.success) return { success: false, message: "Enter a country name and a 2–3 letter country code, for example DRC or RSA." };

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) return { success: false, message: "Your session is no longer valid. Please sign in again." };

  const { data: membership, error: membershipError } = await supabase.from("organization_members")
    .select("organization_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .in("role", ["owner", "admin"])
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

export async function updateCountry(_p:CountryActionState,fd:FormData):Promise<CountryActionState>{const id=String(fd.get("id")||"");const parsed=countrySchema.extend({id:z.string().uuid()}).safeParse({id,name:fd.get("name"),code:fd.get("code")});if(!parsed.success)return{success:false,message:"Please provide a valid country name and code."};const s=await createClient();const{data:c}=await s.auth.getClaims();const uid=c?.claims?.sub;if(!uid)return{success:false,message:"Your session is no longer valid."};const{data:m}=await s.from("organization_members").select("organization_id").eq("user_id",uid).eq("status","active").eq("scope_level","global").in("role",["owner","admin"]).limit(1).maybeSingle();if(!m)return{success:false,message:"You are not authorized to edit countries."};const{error}=await s.from("countries").update({name:parsed.data.name,code:parsed.data.code,updated_at:new Date().toISOString()}).eq("id",id).eq("organization_id",m.organization_id);if(error)return{success:false,message:error.message};for(const l of["fr","en","pt"])revalidatePath("/"+l+"/ops/settings/countries");return{success:true,message:"Country updated."};}
export async function deleteCountry(_p:CountryActionState,fd:FormData):Promise<CountryActionState>{const id=String(fd.get("id")||"");if(!z.string().uuid().safeParse(id).success)return{success:false,message:"Invalid country."};const s=await createClient();const{data:c}=await s.auth.getClaims();const uid=c?.claims?.sub;if(!uid)return{success:false,message:"Your session is no longer valid."};const{data:m}=await s.from("organization_members").select("organization_id").eq("user_id",uid).eq("status","active").in("role",["owner","admin"]).eq("scope_level","global").limit(1).maybeSingle();if(!m)return{success:false,message:"You are not authorized to remove countries."};const{error}=await s.from("countries").delete().eq("id",id).eq("organization_id",m.organization_id);if(error)return{success:false,message:"Country cannot be removed while branches or records depend on it."};for(const l of["fr","en","pt"])revalidatePath("/"+l+"/ops/settings/countries");return{success:true,message:"Country removed."};}