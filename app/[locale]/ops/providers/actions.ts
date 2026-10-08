"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { INTERNATIONAL_PHONE_REGEX } from "@/lib/validation";
import { createClient } from "@/lib/supabase/server";

export type ProviderActionState={success:boolean;message:string};
const schema=z.object({name:z.string().trim().min(2).max(160),phone:z.string().trim().optional().or(z.literal("")),email:z.string().trim().email().optional().or(z.literal("")),specialties:z.array(z.string().trim().min(2).max(100)).min(1,"Select at least one specialty."),coverage:z.string().trim().max(300).optional(),notes:z.string().trim().max(3000).optional(),branchId:z.string().uuid().optional().or(z.literal(""))});
function normalizePhone(value:string){return value.replace(/[\s().-]/g,"");}
export async function createProvider(_prev:ProviderActionState,fd:FormData):Promise<ProviderActionState>{
 const phone=normalizePhone(String(fd.get("phone")??"").trim());
 if(phone&&!INTERNATIONAL_PHONE_REGEX.test(phone))return{success:false,message:"Please check phone: use international format, e.g. +244912345678."};
 const parsed=schema.safeParse({name:fd.get("name"),phone,email:fd.get("email")||"",specialties:fd.getAll("specialties").map(String),coverage:fd.get("coverage")||undefined,notes:fd.get("notes")||undefined,branchId:fd.get("branchId")||""});
 if(!parsed.success){const i=parsed.error.issues[0];return{success:false,message:"Please check "+i.path.join(".")+": "+i.message+"."}}
 const s=await createClient();const{data:c}=await s.auth.getClaims();const uid=c?.claims?.sub;if(!uid)return{success:false,message:"Your session is no longer valid."};
 const{data:m}=await s.from("organization_members").select("organization_id,role").eq("user_id",uid).eq("status","active").limit(1).maybeSingle();
 if(!m||!["owner","admin","regional_admin","operations"].includes(m.role))return{success:false,message:"You are not authorized to add service providers."};
 const{data:services}=await s.from("service_catalog").select("code").in("code",parsed.data.specialties).eq("active",true);
 if(!services||services.length!==new Set(parsed.data.specialties).size)return{success:false,message:"One or more selected specialties are not available in the KRAM service catalog."};
 const branchId=parsed.data.branchId||null;
 if(branchId){const{data:b}=await s.from("branches").select("id").eq("id",branchId).eq("organization_id",m.organization_id).maybeSingle();if(!b)return{success:false,message:"The selected branch is not accessible."}}
 const{data:p,error}=await s.from("service_providers").insert({organization_id:m.organization_id,branch_id:branchId,name:parsed.data.name,phone:phone||null,email:parsed.data.email||null,coverage:parsed.data.coverage||null,notes:parsed.data.notes||null}).select("id").single();
 if(error||!p)return{success:false,message:"The service provider could not be added: "+(error?.message||"unknown database error")};
 const{error:serviceError}=await s.from("provider_services").insert(parsed.data.specialties.map(service=>({provider_id:p.id,organization_id:m.organization_id,service})));
 if(serviceError){await s.from("service_providers").delete().eq("id",p.id);return{success:false,message:"The provider specialties could not be saved: "+serviceError.message}}
 for(const l of["fr","en","pt"])revalidatePath("/"+l+"/ops/providers");
 return{success:true,message:"Service provider added successfully."};
}


export async function updateProviderVerification(_prev: ProviderActionState, fd: FormData): Promise<ProviderActionState> {
 const providerId=String(fd.get("providerId")??"");
 const verificationStatus=String(fd.get("verificationStatus")??"");
 if(!providerId || !["pending","verified","rejected"].includes(verificationStatus)) return {success:false,message:"Invalid verification details."};
 const s=await createClient();
 const {data:claims}=await s.auth.getClaims();
 const uid=claims?.claims?.sub;
 if(!uid) return {success:false,message:"Your session is no longer valid."};
 const {data:m}=await s.from("organization_members").select("organization_id,role").eq("user_id",uid).eq("status","active").limit(1).maybeSingle();
 if(!m || !["owner","admin","regional_admin","operations"].includes(m.role)) return {success:false,message:"You are not authorized to update provider verification."};
 const {data:provider}=await s.from("service_providers").select("id").eq("id",providerId).eq("organization_id",m.organization_id).maybeSingle();
 if(!provider) return {success:false,message:"Service provider not found or outside your organization."};
 const {error}=await s.from("service_providers").update({verification_status:verificationStatus,updated_at:new Date().toISOString()}).eq("id",providerId).eq("organization_id",m.organization_id);
 if(error) return {success:false,message:"Verification could not be updated: "+error.message};
 for(const l of ["fr","en","pt"]) revalidatePath("/"+l+"/ops/providers/"+providerId);
 return {success:true,message:"Provider verification updated successfully."};
}