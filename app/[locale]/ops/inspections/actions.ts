"use server";
import {revalidatePath} from"next/cache";import{z}from"zod";import{createClient}from"@/lib/supabase/server";
import {writeAudit} from "@/lib/audit";
const schema=z.object({assetId:z.string().uuid(),inspectionType:z.enum(["initial","routine","technical","pre_handover","emergency","other"]),scheduledFor:z.string().optional(),inspectorName:z.string().trim().max(120).optional(),inspectorPhone:z.string().trim().max(40).optional(),summary:z.string().trim().max(3000).optional(),recommendations:z.string().trim().max(3000).optional()});
export type InspectionActionState={success:boolean;message:string};

const checklistTemplate=[
 ["Electrical","Main electrical supply"],
 ["Electrical","Sockets and switches"],
 ["Electrical","Lighting and visible fixtures"],
 ["Water","Water supply"],
 ["Water","Water pressure / storage"],
 ["Plumbing","Visible leaks"],
 ["Plumbing","Drains and wastewater flow"],
 ["Plumbing","Taps and sanitary fixtures"],
 ["Structure","Walls and ceilings"],
 ["Structure","Roof / visible water ingress"],
 ["Structure","Doors and windows"],
 ["Security","Main gate and locks"],
 ["Security","Perimeter security"],
 ["Security","Cameras / alarms if present"],
 ["Exterior","Facade and exterior surfaces"],
 ["Exterior","Driveway / walkways / drainage"],
 ["Garden","Grounds and landscaping"],
 ["Garden","Irrigation / outdoor water points"],
] as const;
export async function createInspection(_prev:InspectionActionState,fd:FormData):Promise<InspectionActionState>{
 const parsed=schema.safeParse({assetId:fd.get("assetId"),inspectionType:fd.get("inspectionType"),scheduledFor:fd.get("scheduledFor")||undefined,inspectorName:fd.get("inspectorName")||undefined,inspectorPhone:fd.get("inspectorPhone")||undefined,summary:fd.get("summary")||undefined,recommendations:fd.get("recommendations")||undefined});
 if(!parsed.success)return{success:false,message:"Please complete the required inspection fields."};
 const supabase=await createClient();const{data:claims}=await supabase.auth.getClaims();const userId=claims?.claims?.sub;if(!userId)return{success:false,message:"Your session is no longer valid."};
 const{data:m}=await supabase.from("organization_members").select("organization_id,role").eq("user_id",userId).limit(1).maybeSingle();if(!m||!["owner","admin","regional_admin","operations"].includes(m.role))return{success:false,message:"You are not authorized to create inspections."};
 const{data:a}=await supabase.from("assets").select("id,organization_id,branch_id").eq("id",parsed.data.assetId).eq("organization_id",m.organization_id).maybeSingle();if(!a)return{success:false,message:"The selected asset is not accessible."};
 const{data:i,error}=await supabase.from("inspections").insert({organization_id:m.organization_id,asset_id:a.id,branch_id:a.branch_id,inspection_type:parsed.data.inspectionType,scheduled_for:parsed.data.scheduledFor?new Date(parsed.data.scheduledFor).toISOString():null,inspector_name:parsed.data.inspectorName||null,inspector_phone:parsed.data.inspectorPhone||null,summary:parsed.data.summary||null,recommendations:parsed.data.recommendations||null,created_by:userId}).select("id").single();
 if(error||!i)return{success:false,message:"The inspection could not be created."};
 await writeAudit(supabase,{organizationId:m.organization_id,branchId:a.branch_id,actorId:userId,action:"inspection.created",entityType:"inspection",entityId:i.id,summary:"Inspection created",metadata:{inspectionType:parsed.data.inspectionType}});

 const { error: checklistError } = await supabase.from("inspection_items").insert(
   checklistTemplate.map(([category,item])=>({
     inspection_id:i.id,
     organization_id:m.organization_id,
     category,
     item,
     status:"pending",
   }))
 );
 if(checklistError){
   await supabase.from("inspections").delete().eq("id",i.id).eq("organization_id",m.organization_id);
   return{success:false,message:"The inspection checklist could not be initialized."};
 }
 revalidatePath("/fr/ops/inspections");revalidatePath("/en/ops/inspections");revalidatePath("/pt/ops/inspections");return{success:true,message:"Inspection created successfully."};
}


export async function updateInspectionItem(fd: FormData): Promise<InspectionActionState> {
 const parsed=z.object({
   itemId:z.string().uuid(),
   status:z.enum(["pending","pass","attention","fail","not_applicable"]),
   notes:z.string().trim().max(2000).optional(),
 }).safeParse({
   itemId:fd.get("itemId"),
   status:fd.get("status"),
   notes:fd.get("notes")||undefined,
 });
 if(!parsed.success)return{success:false,message:"Invalid checklist update."};

 const supabase=await createClient();
 const{data:claims}=await supabase.auth.getClaims();
 const userId=claims?.claims?.sub;
 if(!userId)return{success:false,message:"Your session is no longer valid."};

 const{data:m}=await supabase.from("organization_members")
   .select("organization_id,role")
   .eq("user_id",userId)
   .limit(1).maybeSingle();
 if(!m||!["owner","admin","regional_admin","operations"].includes(m.role))
   return{success:false,message:"You are not authorized to update inspections."};

 const{data:item}=await supabase.from("inspection_items")
   .select("id,inspection_id,organization_id")
   .eq("id",parsed.data.itemId)
   .eq("organization_id",m.organization_id)
   .maybeSingle();
 if(!item)return{success:false,message:"Checklist item not found."};

 const{error}=await supabase.from("inspection_items")
   .update({status:parsed.data.status,notes:parsed.data.notes||null,updated_at:new Date().toISOString()})
   .eq("id",item.id)
   .eq("organization_id",m.organization_id);

 if(error)return{success:false,message:"The checklist item could not be updated."};
 await writeAudit(supabase,{organizationId:m.organization_id,actorId:userId,action:"inspection.item_updated",entityType:"inspection_item",entityId:item.id,summary:"Inspection checklist item updated",metadata:{status:parsed.data.status}});

 revalidatePath("/fr/ops/inspections/"+item.inspection_id);
 revalidatePath("/en/ops/inspections/"+item.inspection_id);
 revalidatePath("/pt/ops/inspections/"+item.inspection_id);

 return{success:true,message:"Checklist item updated."};
}


export type EvidenceState={success:boolean;message:string};
async function uploadEvidence(kind:"inspection"|"work_order",fd:FormData):Promise<EvidenceState>{
 const id=String(fd.get(kind==="inspection"?"inspectionId":"workOrderId")||"");
 const file=fd.get("file");const type=String(fd.get("evidenceType")||"other");const caption=String(fd.get("caption")||"");
 if(!id||!(file instanceof File)||file.size===0)return{success:false,message:"Select a file."};
 if(file.size>20*1024*1024)return{success:false,message:"Maximum file size is 20 MB."};
 const allowed=["image/jpeg","image/png","image/webp","video/mp4","application/pdf"];if(!allowed.includes(file.type))return{success:false,message:"Unsupported file type."};
 const s=await createClient();const{data:c}=await s.auth.getClaims();const uid=c?.claims?.sub;if(!uid)return{success:false,message:"Your session is no longer valid."};
 const table=kind==="inspection"?"inspections":"work_orders";const{data:record}=await s.from(table).select("id,organization_id,branch_id").eq("id",id).maybeSingle();if(!record)return{success:false,message:"Record not found."};
 const{data:m}=await s.from("organization_members").select("organization_id,role").eq("user_id",uid).eq("organization_id",record.organization_id).limit(1).maybeSingle();if(!m||!["owner","admin","regional_admin","operations"].includes(m.role))return{success:false,message:"You are not authorized to upload evidence."};
 const documentId=crypto.randomUUID();const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,"-");const path=record.organization_id+"/"+(record.branch_id||"global")+"/"+documentId+"/"+safe;
 const{error:uploadError}=await s.storage.from("kram-documents").upload(path,file,{contentType:file.type,upsert:false});if(uploadError)return{success:false,message:"Upload failed."};
 const table2=kind==="inspection"?"inspection_media":"work_order_media";
 const payload=kind==="inspection"?{id:documentId,inspection_id:id,organization_id:record.organization_id,storage_path:path,caption:caption||null,media_type:file.type.startsWith("video/")?"video":file.type.startsWith("image/")?"image":"document",evidence_type:type,uploaded_by:uid}:{id:documentId,work_order_id:id,organization_id:record.organization_id,storage_path:path,file_name:file.name,mime_type:file.type,size_bytes:file.size,evidence_type:type,caption:caption||null,uploaded_by:uid};
 const{error}=await s.from(table2).insert(payload);if(error){await s.storage.from("kram-documents").remove([path]);return{success:false,message:"Evidence record could not be created."}};
 for(const l of["fr","en","pt"])revalidatePath("/"+l+"/ops/"+(kind==="inspection"?"inspections":"work-orders")+"/"+id);return{success:true,message:"Evidence uploaded successfully."};
}
export async function uploadInspectionEvidence(_p:EvidenceState,fd:FormData){return uploadEvidence("inspection",fd)}
