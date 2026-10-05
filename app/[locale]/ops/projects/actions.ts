"use server";
import{revalidatePath}from"next/cache";import{z}from"zod";import{createClient}from"@/lib/supabase/server";
import {writeAudit} from "@/lib/audit";
export type ProjectActionState={success:boolean;message:string};
const messages={fr:{required:"Veuillez compléter les champs obligatoires du projet.",session:"Votre session n’est plus valide.",unauthorizedCreate:"Vous n’êtes pas autorisé à créer des projets.",asset:"L’actif sélectionné n’est pas accessible.",createError:"Le projet n’a pas pu être créé.",created:"Projet créé avec succès.",updateRequired:"Veuillez compléter la mise à jour du projet.",unauthorizedUpdate:"Vous n’êtes pas autorisé à mettre à jour les projets.",notFound:"Projet introuvable.",updateError:"La mise à jour du projet n’a pas pu être enregistrée.",updated:"Mise à jour du projet enregistrée.",milestoneRequired:"Veuillez compléter les champs du jalon.",unauthorizedMilestone:"Vous n’êtes pas autorisé à gérer les jalons.",milestoneError:"Le jalon n’a pas pu être créé.",milestoneCreated:"Jalon créé avec succès.",invalidMilestone:"Mise à jour du jalon invalide.",milestoneUpdateUnauthorized:"Vous n’êtes pas autorisé à modifier les jalons.",milestoneUpdateError:"Le jalon n’a pas pu être mis à jour.",milestoneUpdated:"Jalon mis à jour avec succès."},en:{required:"Please complete the required project fields.",session:"Your session is no longer valid.",unauthorizedCreate:"You are not authorized to create projects.",asset:"The selected asset is not accessible.",createError:"The project could not be created.",created:"Project created successfully.",updateRequired:"Please complete the project update.",unauthorizedUpdate:"You are not authorized to update projects.",notFound:"Project not found.",updateError:"The project update could not be recorded.",updated:"Project update recorded.",milestoneRequired:"Please complete the milestone fields.",unauthorizedMilestone:"You are not authorized to manage milestones.",milestoneError:"The milestone could not be created.",milestoneCreated:"Milestone created successfully.",invalidMilestone:"Invalid milestone update.",milestoneUpdateUnauthorized:"You are not authorized to update milestones.",milestoneUpdateError:"The milestone could not be updated.",milestoneUpdated:"Milestone updated successfully."},pt:{required:"Preencha os campos obrigatórios do projeto.",session:"A sua sessão já não é válida.",unauthorizedCreate:"Não tem autorização para criar projetos.",asset:"O ativo selecionado não está acessível.",createError:"Não foi possível criar o projeto.",created:"Projeto criado com sucesso.",updateRequired:"Preencha a atualização do projeto.",unauthorizedUpdate:"Não tem autorização para atualizar projetos.",notFound:"Projeto não encontrado.",updateError:"Não foi possível registar a atualização do projeto.",updated:"Atualização do projeto registada.",milestoneRequired:"Preencha os campos do marco.",unauthorizedMilestone:"Não tem autorização para gerir marcos.",milestoneError:"Não foi possível criar o marco.",milestoneCreated:"Marco criado com sucesso.",invalidMilestone:"Atualização do marco inválida.",milestoneUpdateUnauthorized:"Não tem autorização para atualizar marcos.",milestoneUpdateError:"Não foi possível atualizar o marco.",milestoneUpdated:"Marco atualizado com sucesso."}} as const;
const getMessages=(value:FormDataEntryValue|null)=>messages[(typeof value==="string"&&value in messages?value:"en") as keyof typeof messages];
const schema=z.object({locale:z.enum(["fr","en","pt"]).default("en"),assetId:z.string().uuid(),name:z.string().trim().min(3).max(180),projectType:z.enum(["construction","renovation","fit_out","maintenance_program","other"]),startDate:z.string().optional(),targetEndDate:z.string().optional(),budget:z.coerce.number().nonnegative().optional(),description:z.string().trim().max(4000).optional()});
export async function createProject(_prev:ProjectActionState,fd:FormData):Promise<ProjectActionState>{const parsed=schema.safeParse({locale:fd.get("locale"),assetId:fd.get("assetId"),name:fd.get("name"),projectType:fd.get("projectType"),startDate:fd.get("startDate")||undefined,targetEndDate:fd.get("targetEndDate")||undefined,budget:fd.get("budget")||undefined,description:fd.get("description")||undefined});if(!parsed.success)return{success:false,message:getMessages(fd.get("locale")).required};const s=await createClient();const{data:c}=await s.auth.getClaims();const uid=c?.claims?.sub;if(!uid)return{success:false,message:getMessages(parsed.data.locale).session};const{data:m}=await s.from("organization_members").select("organization_id,role").eq("user_id",uid).limit(1).maybeSingle();if(!m||!["owner","admin","regional_admin","operations"].includes(m.role))return{success:false,message:getMessages(parsed.data.locale).unauthorizedCreate};const{data:a}=await s.from("assets").select("id,organization_id,branch_id").eq("id",parsed.data.assetId).eq("organization_id",m.organization_id).maybeSingle();if(!a)return{success:false,message:getMessages(parsed.data.locale).asset};const{data:p,error}=await s.from("projects").insert({organization_id:m.organization_id,asset_id:a.id,branch_id:a.branch_id,name:parsed.data.name,project_type:parsed.data.projectType,start_date:parsed.data.startDate||null,target_end_date:parsed.data.targetEndDate||null,budget:parsed.data.budget??null,description:parsed.data.description||null,created_by:uid}).select("id").single();if(error||!p)return{success:false,message:getMessages(parsed.data.locale).createError};
 await writeAudit(s,{organizationId:m.organization_id,branchId:a.branch_id,actorId:uid,action:"project.created",entityType:"project",entityId:p.id,summary:"Project created",metadata:{name:parsed.data.name,projectType:parsed.data.projectType}});revalidatePath("/fr/ops/projects");revalidatePath("/en/ops/projects");revalidatePath("/pt/ops/projects");return{success:true,message:getMessages(parsed.data.locale).created};}
export async function addProjectUpdate(_prev:ProjectActionState,fd:FormData):Promise<ProjectActionState>{const parsed=z.object({locale:z.enum(["fr","en","pt"]).default("en"),projectId:z.string().uuid(),title:z.string().trim().min(2).max(180),summary:z.string().trim().max(3000).optional(),progress:z.coerce.number().int().min(0).max(100),issue:z.string().trim().max(2000).optional()}).safeParse({locale:fd.get("locale"),projectId:fd.get("projectId"),title:fd.get("title"),summary:fd.get("summary")||undefined,progress:fd.get("progress"),issue:fd.get("issue")||undefined});if(!parsed.success)return{success:false,message:getMessages(fd.get("locale")).updateRequired};const s=await createClient();const{data:c}=await s.auth.getClaims();const uid=c?.claims?.sub;if(!uid)return{success:false,message:"Your session is no longer valid."};const{data:m}=await s.from("organization_members").select("organization_id,role").eq("user_id",uid).limit(1).maybeSingle();if(!m||!["owner","admin","regional_admin","operations"].includes(m.role))return{success:false,message:getMessages(parsed.data.locale).unauthorizedUpdate};const{data:p}=await s.from("projects").select("id,organization_id,branch_id").eq("id",parsed.data.projectId).eq("organization_id",m.organization_id).maybeSingle();if(!p)return{success:false,message:getMessages(parsed.data.locale).notFound};const{error}=await s.from("project_updates").insert({project_id:p.id,organization_id:p.organization_id,actor_id:uid,title:parsed.data.title,summary:parsed.data.summary||null,progress_percent:parsed.data.progress,issue:parsed.data.issue||null});if(error)return{success:false,message:getMessages(parsed.data.locale).updateError};
 await writeAudit(s,{organizationId:p.organization_id,branchId:p.branch_id,actorId:uid,action:"project.updated",entityType:"project",entityId:p.id,summary:"Project update recorded",metadata:{progress:parsed.data.progress,title:parsed.data.title}});await s.from("projects").update({progress_percent:parsed.data.progress,updated_at:new Date().toISOString()}).eq("id",p.id).eq("organization_id",p.organization_id);revalidatePath("/fr/ops/projects/"+p.id);revalidatePath("/en/ops/projects/"+p.id);revalidatePath("/pt/ops/projects/"+p.id);revalidatePath("/fr/ops/projects");revalidatePath("/en/ops/projects");revalidatePath("/pt/ops/projects");return{success:true,message:getMessages(parsed.data.locale).updated};}


const milestoneSchema=z.object({
 locale:z.enum(["fr","en","pt"]).default("en"),
 projectId:z.string().uuid(),
 name:z.string().trim().min(2).max(180),
 dueDate:z.string().optional(),
 progress:z.coerce.number().int().min(0).max(100),
 status:z.enum(["pending","in_progress","completed","blocked"]),
 notes:z.string().trim().max(2000).optional(),
});

export async function createProjectMilestone(_prev:ProjectActionState,fd:FormData):Promise<ProjectActionState>{
 const parsed=milestoneSchema.safeParse({
  projectId:fd.get("projectId"),
  name:fd.get("name"),
  dueDate:fd.get("dueDate")||undefined,
  progress:fd.get("progress")||0,
  status:fd.get("status")||"pending",
  notes:fd.get("notes")||undefined,
 });
 if(!parsed.success)return{success:false,message:getMessages(fd.get("locale")).milestoneRequired};

 const s=await createClient();
 const{data:c}=await s.auth.getClaims();const uid=c?.claims?.sub;
 if(!uid)return{success:false,message:"Your session is no longer valid."};

 const{data:m}=await s.from("organization_members").select("organization_id,role").eq("user_id",uid).limit(1).maybeSingle();
 if(!m||!["owner","admin","regional_admin","operations"].includes(m.role))
  return{success:false,message:getMessages(parsed.data.locale).unauthorizedMilestone};

 const{data:p}=await s.from("projects").select("id,organization_id,branch_id").eq("id",parsed.data.projectId).eq("organization_id",m.organization_id).maybeSingle();
 if(!p)return{success:false,message:"Project not found."};

 const{error}=await s.from("project_milestones").insert({
  project_id:p.id,
  organization_id:p.organization_id,
  name:parsed.data.name,
  due_date:parsed.data.dueDate||null,
  progress_percent:parsed.data.progress,
  status:parsed.data.status,
  notes:parsed.data.notes||null,
 });
 if(error)return{success:false,message:getMessages(parsed.data.locale).milestoneError};
 await writeAudit(s,{organizationId:p.organization_id,branchId:p.branch_id,actorId:uid,action:"project.milestone_created",entityType:"project_milestone",entityId:parsed.data.projectId,summary:"Project milestone created",metadata:{name:parsed.data.name,status:parsed.data.status}});

 revalidatePath("/fr/ops/projects/"+p.id);revalidatePath("/en/ops/projects/"+p.id);revalidatePath("/pt/ops/projects/"+p.id);
 return{success:true,message:getMessages(parsed.data.locale).milestoneCreated};
}

export async function updateProjectMilestone(_prev:ProjectActionState,fd:FormData):Promise<ProjectActionState>{
 const parsed=z.object({
  milestoneId:z.string().uuid(),
  projectId:z.string().uuid(),
  status:z.enum(["pending","in_progress","completed","blocked"]),
  progress:z.coerce.number().int().min(0).max(100),
  notes:z.string().trim().max(2000).optional(),
 }).safeParse({
  milestoneId:fd.get("milestoneId"),
  projectId:fd.get("projectId"),
  status:fd.get("status"),
  progress:fd.get("progress"),
  notes:fd.get("notes")||undefined,
 });
 if(!parsed.success)return{success:false,message:getMessages(fd.get("locale")).invalidMilestone};

 const s=await createClient();const{data:c}=await s.auth.getClaims();const uid=c?.claims?.sub;
 if(!uid)return{success:false,message:"Your session is no longer valid."};

 const{data:m}=await s.from("organization_members").select("organization_id,role").eq("user_id",uid).limit(1).maybeSingle();
 if(!m||!["owner","admin","regional_admin","operations"].includes(m.role))
  return{success:false,message:getMessages(parsed.data.locale).milestoneUpdateUnauthorized};

 const{data:project}=await s.from("projects").select("id,organization_id,branch_id").eq("id",parsed.data.projectId).eq("organization_id",m.organization_id).maybeSingle();
 if(!project)return{success:false,message:"Project not found."};

 const{error}=await s.from("project_milestones").update({
  status:parsed.data.status,
  progress_percent:parsed.data.progress,
  notes:parsed.data.notes||null,
  updated_at:new Date().toISOString(),
 }).eq("id",parsed.data.milestoneId).eq("project_id",project.id).eq("organization_id",project.organization_id);

 if(error)return{success:false,message:getMessages(parsed.data.locale).milestoneUpdateError};

 revalidatePath("/fr/ops/projects/"+project.id);revalidatePath("/en/ops/projects/"+project.id);revalidatePath("/pt/ops/projects/"+project.id);
 return{success:true,message:getMessages(parsed.data.locale).milestoneUpdated};
}
