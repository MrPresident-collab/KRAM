"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  code: z.string().trim().toUpperCase().regex(/^[A-Z0-9-]{2,12}$/),
  city: z.string().trim().min(2).max(100),
  region: z.string().trim().max(100).optional(),
  countryId: z.string().uuid(),
});

export type BranchActionState = { success: boolean; message: string };

export async function createBranch(_previous: BranchActionState, formData: FormData): Promise<BranchActionState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    code: formData.get("code"),
    city: formData.get("city"),
    region: formData.get("region") || undefined,
    countryId: formData.get("countryId"),
  });

  if (!parsed.success) return { success: false, message: "Please provide a valid branch name, code, city and country." };

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return { success: false, message: "Your session is no longer valid. Please sign in again." };

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .eq("scope_level", "global")
    .in("role", ["owner", "admin"])
    .limit(1)
    .maybeSingle();

  if (!membership) return { success: false, message: "You are not authorized to create branches." };

  const { error } = await supabase.from("branches").insert({
    organization_id: membership.organization_id,
    country_id: parsed.data.countryId,
    name: parsed.data.name,
    code: parsed.data.code,
    city: parsed.data.city,
    region: parsed.data.region || null,
  });

  if (error) {
    if (error.code === "23505") return { success: false, message: "A branch with this code already exists." };
    if (error.code === "23503") return { success: false, message: "The selected country is not valid for this organization." };
    return { success: false, message: "The branch could not be created." };
  }

  revalidatePath("/fr/ops/settings/branches");
  revalidatePath("/en/ops/settings/branches");
  revalidatePath("/pt/ops/settings/branches");

  return { success: true, message: "Branch created successfully." };
}

export async function updateBranch(_p:BranchActionState,fd:FormData):Promise<BranchActionState>{const id=String(fd.get("id")||"");const parsed=schema.extend({id:z.string().uuid()}).safeParse({id,name:fd.get("name"),code:fd.get("code"),city:fd.get("city"),region:fd.get("region")||undefined,countryId:fd.get("countryId")});if(!parsed.success)return{success:false,message:"Please provide valid branch details."};const s=await createClient();const{data:c}=await s.auth.getClaims();const uid=c?.claims?.sub;if(!uid)return{success:false,message:"Your session is no longer valid."};const{data:m}=await s.from("organization_members").select("organization_id").eq("user_id",uid).eq("status","active").eq("scope_level","global").in("role",["owner","admin"]).limit(1).maybeSingle();if(!m)return{success:false,message:"You are not authorized to edit branches."};const{error}=await s.from("branches").update({name:parsed.data.name,code:parsed.data.code,city:parsed.data.city,region:parsed.data.region||null,country_id:parsed.data.countryId,updated_at:new Date().toISOString()}).eq("id",id).eq("organization_id",m.organization_id);if(error)return{success:false,message:error.message};for(const l of["fr","en","pt"])revalidatePath("/"+l+"/ops/settings/branches");return{success:true,message:"Branch updated."};}
export async function deleteBranch(_p:BranchActionState,fd:FormData):Promise<BranchActionState>{const id=String(fd.get("id")||"");if(!z.string().uuid().safeParse(id).success)return{success:false,message:"Invalid branch."};const s=await createClient();const{data:c}=await s.auth.getClaims();const uid=c?.claims?.sub;if(!uid)return{success:false,message:"Your session is no longer valid."};const{data:m}=await s.from("organization_members").select("organization_id").eq("user_id",uid).eq("status","active").eq("scope_level","global").in("role",["owner","admin"]).limit(1).maybeSingle();if(!m)return{success:false,message:"You are not authorized to remove branches."};const{error}=await s.from("branches").delete().eq("id",id).eq("organization_id",m.organization_id);if(error)return{success:false,message:"Branch cannot be removed while records still depend on it."};for(const l of["fr","en","pt"])revalidatePath("/"+l+"/ops/settings/branches");return{success:true,message:"Branch removed."};}