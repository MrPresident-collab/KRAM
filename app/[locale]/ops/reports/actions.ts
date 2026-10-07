"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type ReportActionState={success:boolean;message:string};

const createSchema=z.object({
 title:z.string().trim().min(3).max(200),
 reportType:z.enum(["inspection","project","work_order","asset","operational","other"]),
 summary:z.string().trim().max(5000).optional(),
 sourceType:z.enum(["asset","inspection","project","work_order","none"]),
 sourceId:z.string().uuid().optional().or(z.literal("")),
});

export async function createReport(_prev:ReportActionState,fd:FormData):Promise<ReportActionState>{
 const parsed=createSchema.safeParse({
  title:fd.get("title"),
  reportType:fd.get("reportType"),
  summary:fd.get("summary")||undefined,
  sourceType:fd.get("sourceType"),
  sourceId:fd.get("sourceId")||"",
 });
 if(!parsed.success)return{success:false,message:"Please complete the report fields correctly."};

 const supabase=await createClient();
 const{data:claims}=await supabase.auth.getClaims();
 const uid=claims?.claims?.sub;
 if(!uid)return{success:false,message:"Your session is no longer valid."};

 const{data:m}=await supabase.from("organization_members")
  .select("organization_id,role")
  .eq("user_id",uid).eq("status","active").limit(1).maybeSingle();

 if(!m||!["owner","admin","regional_admin","operations","finance"].includes(m.role))
  return{success:false,message:"You are not authorized to create reports."};

 let source:{asset_id?:string;inspection_id?:string;project_id?:string;work_order_id?:string}={};
 let sourceBranchId:string|null=null;

 if(parsed.data.sourceType!=="none"){
  if(!parsed.data.sourceId)return{success:false,message:"Please select a source record."};

  const tableMap={asset:"assets",inspection:"inspections",project:"projects",work_order:"work_orders"} as const;
  const table=tableMap[parsed.data.sourceType];
  const{data:record}=await supabase.from(table).select("id,organization_id,branch_id").eq("id",parsed.data.sourceId).eq("organization_id",m.organization_id).maybeSingle();
  if(!record)return{success:false,message:"The selected source record is not accessible."};
  sourceBranchId="branch_id" in record ? (record.branch_id as string|null) : null;

  source={
   ...(parsed.data.sourceType==="asset"?{asset_id:record.id}:{}),
   ...(parsed.data.sourceType==="inspection"?{inspection_id:record.id}:{}),
   ...(parsed.data.sourceType==="project"?{project_id:record.id}:{}),
   ...(parsed.data.sourceType==="work_order"?{work_order_id:record.id}:{}),
  };
 }

 const{data:report,error}=await supabase.from("reports").insert({
  organization_id:m.organization_id,
  branch_id:sourceBranchId,
  title:parsed.data.title,
  report_type:parsed.data.reportType,
  summary:parsed.data.summary||null,
  ...source,
  created_by:uid,
 }).select("id").single();

 if(error||!report)return{success:false,message:"The report could not be created."};

 const file=fd.get("file");
 if(file instanceof File && file.size>0){
  const allowed=["application/pdf","image/jpeg","image/png","image/webp","video/mp4"];
  if(!allowed.includes(file.type)){
   await supabase.from("reports").delete().eq("id",report.id).eq("organization_id",m.organization_id);
   return{success:false,message:"Unsupported file type. Use PDF, JPG, PNG, WEBP or MP4."};
  }
  if(file.size>20*1024*1024){
   await supabase.from("reports").delete().eq("id",report.id).eq("organization_id",m.organization_id);
   return{success:false,message:"The file is too large. Maximum size is 20 MB."};
  }

  const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,"-");
  const documentId=crypto.randomUUID();
  const path=m.organization_id+"/global/"+documentId+"/"+safeName;

  const{error:uploadError}=await supabase.storage.from("kram-documents").upload(path,file,{contentType:file.type,upsert:false});
  if(uploadError){
   await supabase.from("reports").delete().eq("id",report.id).eq("organization_id",m.organization_id);
   return{success:false,message:"The report file could not be uploaded."};
  }

  const{error:documentError}=await supabase.from("documents").insert({
   id:documentId,
   organization_id:m.organization_id,
   asset_id:source.asset_id||null,
   inspection_id:source.inspection_id||null,
   project_id:source.project_id||null,
   work_order_id:source.work_order_id||null,
   file_name:file.name,
   storage_path:path,
   mime_type:file.type,
   size_bytes:file.size,
   document_type:"report",
   uploaded_by:uid,
  });

  if(documentError){
   await supabase.storage.from("kram-documents").remove([path]);
   await supabase.from("reports").delete().eq("id",report.id).eq("organization_id",m.organization_id);
   return{success:false,message:"The report document record could not be created."};
  }

  const{error:updateError}=await supabase.from("reports")
   .update({storage_path:path,updated_at:new Date().toISOString()})
   .eq("id",report.id).eq("organization_id",m.organization_id);

  if(updateError)return{success:false,message:"The report was created, but its file reference could not be saved."};
 }

 for(const locale of["fr","en","pt"])revalidatePath("/"+locale+"/ops/reports");
 return{success:true,message:"Report created successfully."};
}


const reportTransitions:Record<string,string[]>={
 draft:["review"],
 review:["published","draft"],
 published:["sent","archived"],
 sent:["archived"],
 archived:[],
};

export async function transitionReport(_prev:ReportActionState,fd:FormData):Promise<ReportActionState>{
 const parsed=z.object({
  reportId:z.string().uuid(),
  status:z.enum(["draft","review","published","sent","archived"]),
 }).safeParse({reportId:fd.get("reportId"),status:fd.get("status")});
 if(!parsed.success)return{success:false,message:"Invalid report transition."};

 const s=await createClient();const{data:claims}=await s.auth.getClaims();const uid=claims?.claims?.sub;
 if(!uid)return{success:false,message:"Your session is no longer valid."};

 const{data:m}=await s.from("organization_members").select("organization_id,role").eq("user_id",uid).limit(1).maybeSingle();
 if(!m||!["owner","admin","regional_admin","operations","finance"].includes(m.role))
  return{success:false,message:"You are not authorized to update reports."};

 const{data:r}=await s.from("reports").select("id,organization_id,branch_id,status").eq("id",parsed.data.reportId).eq("organization_id",m.organization_id).maybeSingle();
 if(!r)return{success:false,message:"Report not found."};

 if(!((reportTransitions[r.status]??[]).includes(parsed.data.status)))
  return{success:false,message:"That report transition is not allowed."};

 const{error}=await s.from("reports").update({
  status:parsed.data.status,
  published_at:parsed.data.status==="published"?new Date().toISOString():undefined,
  updated_at:new Date().toISOString(),
 }).eq("id",r.id).eq("organization_id",r.organization_id);

 if(error)return{success:false,message:"The report could not be updated."};

 for(const l of["fr","en","pt"]){
  revalidatePath("/"+l+"/ops/reports");
  revalidatePath("/"+l+"/ops/reports/"+r.id);
 }
 return{success:true,message:"Report updated successfully."};
}
