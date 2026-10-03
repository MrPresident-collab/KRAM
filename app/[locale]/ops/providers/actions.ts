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
	 const branchId=parsed.data.branchId||null;
 if(branchId){const{data:b}=await s.from("branches").select("id").eq("id",branchId).eq("organization_id",m.organization_id).maybeSingle();if(!b)return{success:false,message:"The selected branch is not accessible."}}
 const{data:p,error}=await s.from("service_providers").insert({organization_id:m.organization_id,branch_id:branchId,name:parsed.data.name,phone:parsed.data.phone||null,email:parsed.data.email||null,coverage:parsed.data.coverage||null,notes:parsed.data.notes||null}).select("id").single();
 if(error||!p)return{success:false,message:"The service provider could not be added."};
 const{error:serviceError}=await s.from("provider_services").insert({provider_id:p.id,organization_id:m.organization_id,service:parsed.data.specialty});
 if(serviceError){await s.from("service_providers").delete().eq("id",p.id);return{success:false,message:"The provider specialty could not be saved."}}
 revalidatePath("/fr/ops/providers");revalidatePath("/en/ops/providers");revalidatePath("/pt/ops/providers");
 return{success:true,message:"Service provider added successfully."};
}
export async function updateProviderVerification(
  _prev: ProviderActionState,
  fd: FormData,
): Promise<ProviderActionState> {
  const providerId = String(fd.get("providerId") ?? "");
  const verificationStatus = String(fd.get("verificationStatus") ?? "");

  const parsed = z.object({
    providerId: z.string().uuid(),
    verificationStatus: z.enum(["pending","verified","rejected"]),
  }).safeParse({ providerId, verificationStatus });

  if (!parsed.success) return { success:false, message:"Invalid verification update." };

  const s=await createClient();
  const {data:claims}=await s.auth.getClaims();
  const uid=claims?.claims?.sub;
  if(!uid) return {success:false,message:"Your session is no longer valid."};

  const {data:m}=await s.from("organization_members")
    .select("organization_id,role")
    .eq("user_id",uid)
    .limit(1).maybeSingle();

  if(!m || !["owner","admin","regional_admin","operations"].includes(m.role))
    return {success:false,message:"You are not authorized to verify providers."};

  const {data:p}=await s.from("service_providers")
    .select("id,organization_id,status")
    .eq("id",parsed.data.providerId)
    .eq("organization_id",m.organization_id)
    .maybeSingle();

  if(!p)return{success:false,message:"Provider not found."};

  const nextStatus = parsed.data.verificationStatus==="verified" ? "active" : p.status;

  const {error}=await s.from("service_providers")
    .update({
      verification_status:parsed.data.verificationStatus,
      status: nextStatus,
      updated_at:new Date().toISOString(),
    })
    .eq("id",p.id)
    .eq("organization_id",m.organization_id);

  if(error)return{success:false,message:"Provider verification could not be updated."};

  revalidatePath("/fr/ops/providers");
  revalidatePath("/en/ops/providers");
  revalidatePath("/pt/ops/providers");
  revalidatePath("/fr/ops/providers/"+p.id);
  revalidatePath("/en/ops/providers/"+p.id);
  revalidatePath("/pt/ops/providers/"+p.id);

  return{success:true,message:"Provider verification updated."};
}

export async function assignProviderToWorkOrder(
  _prev: ProviderActionState,
  fd: FormData,
): Promise<ProviderActionState> {
  const providerId=String(fd.get("providerId")??"");
  const workOrderId=String(fd.get("workOrderId")??"");
  const parsed=z.object({
    providerId:z.string().uuid(),
    workOrderId:z.string().uuid(),
  }).safeParse({providerId,workOrderId});

  if(!parsed.success)return{success:false,message:"Invalid provider assignment."};

  const s=await createClient();
  const{data:claims}=await s.auth.getClaims();
  const uid=claims?.claims?.sub;
  if(!uid)return{success:false,message:"Your session is no longer valid."};

  const{data:m}=await s.from("organization_members")
    .select("organization_id,role")
    .eq("user_id",uid)
    .limit(1).maybeSingle();

  if(!m||!["owner","admin","regional_admin","operations"].includes(m.role))
    return{success:false,message:"You are not authorized to assign providers."};

  const [{data:p},{data:wo}]=await Promise.all([
    s.from("service_providers")
      .select("id,organization_id,branch_id,verification_status")
      .eq("id",parsed.data.providerId)
      .eq("organization_id",m.organization_id)
      .maybeSingle(),
    s.from("work_orders")
      .select("id,organization_id,branch_id,status")
      .eq("id",parsed.data.workOrderId)
      .eq("organization_id",m.organization_id)
      .maybeSingle(),
  ]);

  if(!p||!wo)return{success:false,message:"Provider or work order not found."};
  if(p.verification_status!=="verified")
    return{success:false,message:"Only verified providers can be assigned to work orders."};
  if(p.branch_id && wo.branch_id && p.branch_id!==wo.branch_id)
    return{success:false,message:"Provider and work order belong to different branches."};

  const {error:assignError}=await s.from("work_orders")
    .update({
      assigned_provider_id:p.id,
      updated_at:new Date().toISOString(),
    })
    .eq("id",wo.id)
    .eq("organization_id",m.organization_id);

  if(assignError)return{success:false,message:"The provider could not be assigned to the work order."};

  const {error:jobError}=await s.from("provider_jobs").insert({
    provider_id:p.id,
    work_order_id:wo.id,
    organization_id:m.organization_id,
    status:"assigned",
  });

  if(jobError){
    await s.from("work_orders")
      .update({assigned_provider_id:null,updated_at:new Date().toISOString()})
      .eq("id",wo.id)
      .eq("organization_id",m.organization_id);
    return{success:false,message:"The provider assignment record could not be created."};
  }

  revalidatePath("/fr/ops/providers/"+p.id);
  revalidatePath("/en/ops/providers/"+p.id);
  revalidatePath("/pt/ops/providers/"+p.id);
  revalidatePath("/fr/ops/work-orders/"+wo.id);
  revalidatePath("/en/ops/work-orders/"+wo.id);
  revalidatePath("/pt/ops/work-orders/"+wo.id);
  revalidatePath("/fr/ops/work-orders");
  revalidatePath("/en/ops/work-orders");
  revalidatePath("/pt/ops/work-orders");

  return{success:true,message:"Provider assigned to work order."};
}
