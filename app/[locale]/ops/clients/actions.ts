"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema=z.object({branchId:z.string().uuid(),fullName:z.string().trim().min(2).max(160),email:z.string().trim().email().max(254).optional().or(z.literal("")),phone:z.string().trim().max(40).optional(),notes:z.string().trim().max(2000).optional()});
export type ClientActionState={success:boolean;message:string};
export async function createClientRecord(_prev:ClientActionState,formData:FormData):Promise<ClientActionState>{
 const parsed=schema.safeParse({fullName:formData.get("fullName"),branchId:formData.get("branchId"),email:formData.get("email"),phone:formData.get("phone"),notes:formData.get("notes")});
 if(!parsed.success)return{success:false,message:"Please provide a valid client name and contact details."};
 const supabase=await createClient(); const {data:claims}=await supabase.auth.getClaims(); const userId=claims?.claims?.sub;
 if(!userId)return{success:false,message:"Your session is no longer valid."};
 const {data:membership}=await supabase.from("organization_members").select("organization_id,role,scope_level,country_id,branch_id").eq("user_id",userId).eq("status","active").limit(1).maybeSingle();
 if(!membership)return{success:false,message:"You are not authorized to create clients."};
 if(!["owner","admin","regional_admin"].includes(membership.role))return{success:false,message:"You are not authorized to create clients."};
 const {data:branch}=await supabase.from("branches").select("id,country_id").eq("id",parsed.data.branchId).eq("organization_id",membership.organization_id).maybeSingle();
 if(!branch)return{success:false,message:"The selected branch is not valid."};
 if(membership.scope_level==="country" && branch.country_id!==membership.country_id)return{success:false,message:"You cannot create a client outside your country scope."};
 if(membership.scope_level==="branch" && branch.id!==membership.branch_id)return{success:false,message:"You cannot create a client outside your branch scope."};
 const {error}=await supabase.from("clients").insert({organization_id:membership.organization_id,branch_id:parsed.data.branchId,full_name:parsed.data.fullName,email:parsed.data.email||null,phone:parsed.data.phone||null,notes:parsed.data.notes||null});
 if(error)return{success:false,message:"The client could not be created."};
 revalidatePath("/fr/ops/clients");revalidatePath("/en/ops/clients");revalidatePath("/pt/ops/clients");
 return{success:true,message:"Client created successfully."};
}
