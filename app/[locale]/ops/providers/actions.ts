"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type ProviderActionState={success:boolean;message:string};

const schema=z.object({
 name:z.string().trim().min(2).max(160),
 phone:z.string().trim().max(50).optional(),
 email:z.string().trim().email().optional().or(z.literal("")),
 specialty:z.string().trim().min(2).max(100),
 coverage:z.string().trim().max(300).optional(),
 notes:z.string().trim().max(3000).optional(),
 branchId:z.string().uuid().optional().or(z.literal(""))
});

export async function createProvider(_prev:ProviderActionState,fd:FormData):Promise<ProviderActionState>{
 const parsed=schema.safeParse({name:fd.get("name"),phone:fd.get("phone")||undefined,email:fd.get("email")||"",specialty:fd.get("specialty"),coverage:fd.get("coverage")||undefined,notes:fd.get("notes")||undefined,branchId:fd.get("branchId")||""});
 if(!parsed.success)return{success:false,message:"Please complete the required provider fields."};
 const s=await createClient();const{data:c}=await s.auth.getClaims();const uid=c?.claims?.sub;
 if(!uid)return{success:false,message:"Your session is no longer valid."};
 const{data:m}=await s.from("organization_members").select("organization_id,role").eq("user_id",uid).limit(1).maybeSingle();
 if(!m||!["owner","admin","regional_admin","operations"].includes(m.role))return{success:false,message:"You are not authorized to add service providers."};
 let branchId=parsed.data.branchId||null;
 if(branchId){const{data:b}=await s.from("branches").select("id").eq("id",branchId).eq("organization_id",m.organization_id).maybeSingle();if(!b)return{success:false,message:"The selected branch is not accessible."}}
 const{data:p,error}=await s.from("service_providers").insert({organization_id:m.organization_id,branch_id:branchId,name:parsed.data.name,phone:parsed.data.phone||null,email:parsed.data.email||null,coverage:parsed.data.coverage||null,notes:parsed.data.notes||null}).select("id").single();
 if(error||!p)return{success:false,message:"The service provider could not be added."};
 const{error:serviceError}=await s.from("provider_services").insert({provider_id:p.id,organization_id:m.organization_id,service:parsed.data.specialty});
 if(serviceError){await s.from("service_providers").delete().eq("id",p.id);return{success:false,message:"The provider specialty could not be saved."}}
 revalidatePath("/fr/ops/providers");revalidatePath("/en/ops/providers");revalidatePath("/pt/ops/providers");
 return{success:true,message:"Service provider added successfully."};
}