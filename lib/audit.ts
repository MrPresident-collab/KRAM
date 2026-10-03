import { SupabaseClient } from "@supabase/supabase-js";

type AuditInput={
 organizationId:string;
 branchId?:string|null;
 actorId?:string|null;
 action:string;
 entityType:string;
 entityId?:string|null;
 summary:string;
 metadata?:Record<string,unknown>;
};

export async function writeAudit(supabase:SupabaseClient,input:AuditInput){
 const {error}=await supabase.from("audit_logs").insert({
  organization_id:input.organizationId,
  branch_id:input.branchId??null,
  actor_id:input.actorId??null,
  action:input.action,
  entity_type:input.entityType,
  entity_id:input.entityId??null,
  summary:input.summary,
  metadata:input.metadata??{},
 });
 return {error};
}
