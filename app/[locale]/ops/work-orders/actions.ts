"use server";
import {revalidatePath} from "next/cache";import {z} from "zod";import {createClient} from "@/lib/supabase/server";
import {writeAudit} from "@/lib/audit";
const schema=z.object({assetId:z.string().uuid(),title:z.string().trim().min(3).max(180),category:z.string().trim().min(2).max(60),priority:z.enum(["low","normal","high","urgent"]),description:z.string().trim().max(3000).optional(),estimatedCost:z.coerce.number().nonnegative().optional(),clientApproval:z.enum(["not_required","pending","approved","rejected"])});
export type WorkOrderActionState={success:boolean;message:string};
export async function createWorkOrder(_prev:WorkOrderActionState,fd:FormData):Promise<WorkOrderActionState>{
 const parsed=schema.safeParse({assetId:fd.get("assetId"),title:fd.get("title"),category:fd.get("category"),priority:fd.get("priority"),description:fd.get("description"),estimatedCost:fd.get("estimatedCost")||undefined,clientApproval:fd.get("clientApproval")});
 if(!parsed.success)return{success:false,message:"Please complete the required work order fields."};
 const supabase=await createClient();const{data:claims}=await supabase.auth.getClaims();const userId=claims?.claims?.sub;if(!userId)return{success:false,message:"Your session is no longer valid."};
 const{data:membership}=await supabase.from("organization_members").select("organization_id").eq("user_id",userId).eq("status","active").limit(1).maybeSingle();if(!membership)return{success:false,message:"You are not authorized to create work orders."};
 const{data:service}=await supabase.from("service_catalog").select("code").eq("code",parsed.data.category).eq("active",true).maybeSingle();if(!service)return{success:false,message:"Please select a KRAM service from the service catalog."};
 const{data:asset}=await supabase.from("assets").select("id,organization_id,branch_id").eq("id",parsed.data.assetId).eq("organization_id",membership.organization_id).maybeSingle();if(!asset)return{success:false,message:"The selected asset is not accessible."};
 const{error}=await supabase.from("work_orders").insert({organization_id:membership.organization_id,asset_id:asset.id,branch_id:asset.branch_id,title:parsed.data.title,category:parsed.data.category,priority:parsed.data.priority,description:parsed.data.description||null,estimated_cost:parsed.data.estimatedCost??null,client_approval:parsed.data.clientApproval,created_by:userId});
 if(error)return{success:false,message:"The work order could not be created."};
 await writeAudit(supabase,{organizationId:membership.organization_id,branchId:asset.branch_id,actorId:userId,action:"work_order.created",entityType:"work_order",entityId:asset.id,summary:"Work order created",metadata:{title:parsed.data.title,priority:parsed.data.priority}});
 revalidatePath("/fr/ops/work-orders");revalidatePath("/en/ops/work-orders");revalidatePath("/pt/ops/work-orders");revalidatePath("/fr/ops/assets/"+asset.id);revalidatePath("/en/ops/assets/"+asset.id);revalidatePath("/pt/ops/assets/"+asset.id);
 return{success:true,message:"Work order created successfully."};
}


const transitions: Record<string,string[]> = {
  draft: ["pending_approval","approved"],
  pending_approval: ["approved","draft"],
  approved: ["assigned","in_progress"],
  assigned: ["in_progress"],
  in_progress: ["awaiting_evidence","completed"],
  awaiting_evidence: ["completed","in_progress"],
  completed: ["verified","in_progress"],
  verified: ["closed"],
  closed: [],
};

export async function transitionWorkOrder(
  _prev: WorkOrderActionState,
  fd: FormData,
): Promise<WorkOrderActionState> {
  const workOrderId = String(fd.get("workOrderId") ?? "");
  const nextStatus = String(fd.get("status") ?? "");
  const note = String(fd.get("note") ?? "").trim();

  const parsed = z.object({
    workOrderId: z.string().uuid(),
    status: z.enum(["draft","pending_approval","approved","assigned","in_progress","awaiting_evidence","completed","verified","closed"]),
    note: z.string().max(2000),
  }).safeParse({ workOrderId, status: nextStatus, note });

  if (!parsed.success) return { success: false, message: "Invalid status update." };

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return { success: false, message: "Your session is no longer valid." };

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id,role")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (!membership || !["owner","admin","regional_admin","operations"].includes(membership.role)) {
    return { success: false, message: "You are not authorized to update work orders." };
  }

  const { data: current } = await supabase
    .from("work_orders")
    .select("id,organization_id,branch_id,status")
    .eq("id", parsed.data.workOrderId)
    .eq("organization_id", membership.organization_id)
    .maybeSingle();

  if (!current) return { success: false, message: "Work order not found." };

  const allowed = transitions[current.status] ?? [];
  if (!allowed.includes(parsed.data.status)) {
    return { success: false, message: "That status transition is not allowed." };
  }

  const { error: updateError } = await supabase
    .from("work_orders")
    .update({ status: parsed.data.status, updated_at: new Date().toISOString() })
    .eq("id", current.id)
    .eq("organization_id", current.organization_id);

  if (updateError) return { success: false, message: "The work order could not be updated." };

  const { error: historyError } = await supabase
    .from("work_order_updates")
    .insert({
      work_order_id: current.id,
      organization_id: current.organization_id,
      actor_id: userId,
      from_status: current.status,
      to_status: parsed.data.status,
      note: parsed.data.note || null,
    });

  if (historyError) {
    await supabase.from("work_orders").update({ status: current.status, updated_at: new Date().toISOString() }).eq("id", current.id).eq("organization_id", current.organization_id);
    return { success: false, message: "The status change was rolled back because its history could not be recorded." };
  }

  await writeAudit(supabase,{organizationId:current.organization_id,branchId:current.branch_id,actorId:userId,action:"work_order.status_changed",entityType:"work_order",entityId:current.id,summary:`Work order moved from ${current.status} to ${parsed.data.status}`,metadata:{from:current.status,to:parsed.data.status,note:parsed.data.note||null}});

  revalidatePath("/fr/ops/work-orders");
  revalidatePath("/en/ops/work-orders");
  revalidatePath("/pt/ops/work-orders");
  revalidatePath("/fr/ops/work-orders/" + current.id);
  revalidatePath("/en/ops/work-orders/" + current.id);
  revalidatePath("/pt/ops/work-orders/" + current.id);

  return { success: true, message: "Work order updated successfully." };
}


export type EvidenceState={success:boolean;message:string};
export async function uploadWorkOrderEvidence(_p:EvidenceState,fd:FormData):Promise<EvidenceState>{
 const id=String(fd.get("workOrderId")||""),type=String(fd.get("evidenceType")||"other"),caption=String(fd.get("caption")||""),file=fd.get("file");
 if(!id||!(file instanceof File)||file.size===0)return{success:false,message:"Select a file."};
 if(file.size>20*1024*1024)return{success:false,message:"Maximum file size is 20 MB."};
 const allowed=["image/jpeg","image/png","image/webp","video/mp4","application/pdf"];if(!allowed.includes(file.type))return{success:false,message:"Unsupported file type."};
 const s=await createClient();const{data:c}=await s.auth.getClaims();const uid=c?.claims?.sub;if(!uid)return{success:false,message:"Your session is no longer valid."};
 const{data:record}=await s.from("work_orders").select("id,organization_id,branch_id").eq("id",id).maybeSingle();if(!record)return{success:false,message:"Work order not found."};
 const{data:m}=await s.from("organization_members").select("organization_id,role").eq("user_id",uid).eq("organization_id",record.organization_id).eq("status","active").limit(1).maybeSingle();if(!m||!["owner","admin","regional_admin","operations"].includes(m.role))return{success:false,message:"You are not authorized to upload evidence."};
 const documentId=crypto.randomUUID(),safe=file.name.replace(/[^a-zA-Z0-9._-]/g,"-"),path=record.organization_id+"/"+(record.branch_id||"global")+"/"+documentId+"/"+safe;
 const{error:uploadError}=await s.storage.from("kram-documents").upload(path,file,{contentType:file.type,upsert:false});if(uploadError)return{success:false,message:"Upload failed."};
 const{error}=await s.from("work_order_media").insert({id:documentId,work_order_id:id,organization_id:record.organization_id,storage_path:path,file_name:file.name,mime_type:file.type,size_bytes:file.size,evidence_type:type,caption:caption||null,uploaded_by:uid});
 if(error){await s.storage.from("kram-documents").remove([path]);return{success:false,message:"Evidence record could not be created."}};
 for(const l of["fr","en","pt"])revalidatePath("/"+l+"/ops/work-orders/"+id);return{success:true,message:"Evidence uploaded successfully."};
}

export async function moveWorkOrderToBin(_prev:{success:boolean;message:string},fd:FormData){const id=String(fd.get("workOrderId")||"");if(!z.string().uuid().safeParse(id).success)return{success:false,message:"Invalid record."};const s=await createClient();const{data:c}=await s.auth.getClaims();const uid=c?.claims?.sub;if(!uid)return{success:false,message:"Your session is no longer valid."};const{data:m}=await s.from("organization_members").select("organization_id,role").eq("user_id",uid).eq("status","active").limit(1).maybeSingle();if(!m||!["owner","admin","regional_admin","operations"].includes(m.role))return{success:false,message:"You are not authorized to move this record to the bin."};const{error}=await s.from("work_orders").update({deleted_at:new Date().toISOString(),deleted_by:uid,updated_at:new Date().toISOString()}).eq("id",id).eq("organization_id",m.organization_id);if(error)return{success:false,message:error.message};for(const l of["fr","en","pt"])revalidatePath("/"+l+"/ops/work-orders");return{success:true,message:"Moved to bin."};}

export async function updateWorkOrderRecord(_prev:WorkOrderActionState,fd:FormData):Promise<WorkOrderActionState>{
 const parsed=schema.extend({workOrderId:z.string().uuid()}).safeParse({workOrderId:fd.get("workOrderId"),assetId:fd.get("assetId"),title:fd.get("title"),category:fd.get("category"),priority:fd.get("priority"),description:fd.get("description"),estimatedCost:fd.get("estimatedCost")||undefined,clientApproval:fd.get("clientApproval")});
 if(!parsed.success)return{success:false,message:"Please complete the required work order fields."};
 const s=await createClient();const{data:claims}=await s.auth.getClaims();const uid=claims?.claims?.sub;if(!uid)return{success:false,message:"Your session is no longer valid."};
 const{data:m}=await s.from("organization_members").select("organization_id,role,scope_level,branch_id").eq("user_id",uid).eq("status","active").limit(1).maybeSingle();if(!m||!["owner","admin","regional_admin","operations"].includes(m.role))return{success:false,message:"You are not authorized to edit work orders."};
 const{data:current}=await s.from("work_orders").select("id,organization_id,branch_id,status,asset_id").eq("id",parsed.data.workOrderId).eq("organization_id",m.organization_id).is("deleted_at",null).maybeSingle();if(!current)return{success:false,message:"Work order not found."};if(m.scope_level==="branch"&&current.branch_id!==m.branch_id)return{success:false,message:"This work order is outside your branch scope."};if(["closed","verified"].includes(current.status))return{success:false,message:"Closed or verified work orders cannot be edited."};
 const{data:service}=await s.from("service_catalog").select("code").eq("code",parsed.data.category).eq("active",true).maybeSingle();if(!service)return{success:false,message:"Please select a KRAM service from the service catalog."};
 let asset:{id:string;organization_id:string;branch_id:string|null}|null=null;if(parsed.data.assetId===current.asset_id){asset={id:current.asset_id,organization_id:current.organization_id,branch_id:current.branch_id};}else{const{data:selectedAsset}=await s.from("assets").select("id,organization_id,branch_id").eq("id",parsed.data.assetId).eq("organization_id",m.organization_id).is("deleted_at",null).maybeSingle();asset=selectedAsset;}if(!asset)return{success:false,message:"The selected asset is not accessible. Choose another active asset or keep the existing asset."};if(m.scope_level==="branch"&&asset.branch_id!==m.branch_id)return{success:false,message:"The selected asset is outside your branch scope."};
 const{error}=await s.from("work_orders").update({asset_id:asset.id,branch_id:asset.branch_id,title:parsed.data.title,category:parsed.data.category,priority:parsed.data.priority,description:parsed.data.description||null,estimated_cost:parsed.data.estimatedCost??null,client_approval:parsed.data.clientApproval,updated_at:new Date().toISOString()}).eq("id",current.id).eq("organization_id",m.organization_id);if(error)return{success:false,message:"The work order could not be updated."};
 await writeAudit(s,{organizationId:m.organization_id,branchId:asset.branch_id,actorId:uid,action:"work_order.updated",entityType:"work_order",entityId:current.id,summary:"Work order details updated",metadata:{title:parsed.data.title,category:parsed.data.category,priority:parsed.data.priority}});
 for(const l of ["fr","en","pt"]){revalidatePath("/"+l+"/ops/work-orders");revalidatePath("/"+l+"/ops/work-orders/"+current.id);}return{success:true,message:"Work order updated successfully."};
}
