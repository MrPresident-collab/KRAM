"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const startSchema=z.object({clientId:z.string().uuid(),subject:z.string().trim().min(2).max(200),priority:z.enum(["low","normal","high","urgent"]),body:z.string().trim().min(1).max(10000)});
const messageSchema=z.object({conversationId:z.string().uuid(),body:z.string().trim().min(1).max(10000),visibility:z.enum(["client","internal"])});

async function actor(){
  const s=await createClient();
  const {data:c,error:claimError}=await s.auth.getClaims();
  const uid=c?.claims?.sub;
  if(claimError||!uid)return null;
  const {data:m}=await s.from("organization_members").select("organization_id").eq("user_id",uid).eq("status","active").limit(1).maybeSingle();
  return m?{s,uid,organizationId:m.organization_id}:null;
}

export async function startConversation(fd:FormData){
  const parsed=startSchema.safeParse({clientId:fd.get("clientId"),subject:fd.get("subject"),priority:fd.get("priority")||"normal",body:fd.get("body")});
  if(!parsed.success)return{success:false,message:"Please complete the conversation details."};
  const a=await actor();if(!a)return{success:false,message:"Your session is no longer valid."};
  const {data:client}=await a.s.from("clients").select("id").eq("id",parsed.data.clientId).eq("organization_id",a.organizationId).maybeSingle();
  if(!client)return{success:false,message:"Client not found or outside your organization."};
  const now=new Date().toISOString();
  const {data:conversation,error}=await a.s.from("client_conversations").insert({organization_id:a.organizationId,client_id:client.id,subject:parsed.data.subject,channel:"portal",status:"open",priority:parsed.data.priority,created_by:a.uid,last_message_at:now,updated_at:now}).select("id").single();
  if(error||!conversation){console.error("KRAM conversation insert failed",{code:error?.code,message:error?.message,details:error?.details,hint:error?.hint});return{success:false,message:"The conversation could not be started"+(error?.message?": "+error.message:"")};}
  const {error:messageError}=await a.s.from("client_conversation_messages").insert({organization_id:a.organizationId,conversation_id:conversation.id,sender_user_id:a.uid,body:parsed.data.body,visibility:"client",message_type:"message"});
  if(messageError){console.error("KRAM opening message insert failed",{code:messageError.code,message:messageError.message,details:messageError.details,hint:messageError.hint});await a.s.from("client_conversations").delete().eq("id",conversation.id).eq("organization_id",a.organizationId);return{success:false,message:"The conversation was created but the opening message failed: "+messageError.message};}
  for(const l of["fr","en","pt"])revalidatePath("/"+l+"/ops/communications");
  return{success:true,message:"Conversation started successfully.",conversationId:conversation.id};
}

export async function sendMessage(input:FormData|{conversationId:string;body:string;visibility:"client"|"internal"}){
  const parsed=messageSchema.safeParse(input instanceof FormData?{conversationId:input.get("conversationId"),body:input.get("body"),visibility:input.get("visibility")||"client"}:input);
  if(!parsed.success)return{success:false,message:"Please enter a valid message."};
  const a=await actor();if(!a)return{success:false,message:"Your session is no longer valid."};
  const {data:conversation}=await a.s.from("client_conversations").select("id").eq("id",parsed.data.conversationId).eq("organization_id",a.organizationId).maybeSingle();
  if(!conversation)return{success:false,message:"Conversation not found or outside your organization."};
  const {error}=await a.s.from("client_conversation_messages").insert({organization_id:a.organizationId,conversation_id:conversation.id,sender_user_id:a.uid,body:parsed.data.body,visibility:parsed.data.visibility,message_type:"message"});
  if(error)return{success:false,message:"The message could not be sent."};
  const {error:updateError}=await a.s.from("client_conversations").update({last_message_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq("id",conversation.id).eq("organization_id",a.organizationId);
  if(updateError)return{success:false,message:"The message was sent, but the conversation timestamp could not be updated."};
  for(const l of["fr","en","pt"])revalidatePath("/"+l+"/ops/communications");
  return{success:true,message:"Message sent."};
}
const caseSchema=z.object({conversationId:z.string().uuid(),status:z.enum(["open","assigned","in_progress","escalated","resolved","closed"]),details:z.string().trim().max(4000).optional(),assignedTo:z.string().uuid().nullable().optional()});
export async function updateCase(input:unknown){
 const parsed=caseSchema.safeParse(input);if(!parsed.success)return{success:false,message:"Invalid case update."};
 const a=await actor();if(!a)return{success:false,message:"Your session is no longer valid."};
 const{data:member}=await a.s.from("organization_members").select("role,scope_level,branch_id").eq("user_id",a.uid).eq("organization_id",a.organizationId).eq("status","active").maybeSingle();
 if(!member)return{success:false,message:"Active staff membership required."};
 const{data:current}=await a.s.from("client_conversations").select("id,case_status,client_id,assigned_to").eq("id",parsed.data.conversationId).eq("organization_id",a.organizationId).maybeSingle();
 if(!current)return{success:false,message:"Case not found or inaccessible."};
 const role=member.role as string;const next=parsed.data.status;const privileged=["owner","admin","regional_admin"].includes(role);
 if(next==="closed"&&!privileged)return{success:false,message:"Only an administrator can close a case."};
 if(next==="assigned"&&!["owner","admin","regional_admin","operations"].includes(role))return{success:false,message:"Only Operations or an administrator can assign a case."};
 if(next==="escalated"&&!["support","operations","owner","admin","regional_admin"].includes(role))return{success:false,message:"You cannot escalate cases with your current role."};
 if(next==="resolved"&&!["support","operations","owner","admin","regional_admin"].includes(role))return{success:false,message:"You cannot resolve cases with your current role."};
 if(parsed.data.assignedTo){const{data:target}=await a.s.from("organization_members").select("user_id").eq("user_id",parsed.data.assignedTo).eq("organization_id",a.organizationId).eq("status","active").maybeSingle();if(!target)return{success:false,message:"The assignee is not an active member of this organization."};}
 if(next==="escalated"&&!parsed.data.details?.trim())return{success:false,message:"Add an escalation reason before escalating."};
 if(next==="resolved"&&!parsed.data.details?.trim())return{success:false,message:"Record the resolution before resolving the case."};
 if(next==="closed"&&current.case_status!=="resolved")return{success:false,message:"Resolve the case and record the outcome before closing it."};
 const now=new Date().toISOString();const patch:Record<string,unknown>={case_status:next,status:next==="closed"?"closed":next==="resolved"?"resolved":"open",updated_at:now};
 if(parsed.data.assignedTo){patch.assigned_to=parsed.data.assignedTo;}
 if(next==="escalated"){patch.escalated_by=a.uid;patch.escalated_to=parsed.data.assignedTo??null;patch.escalation_reason=parsed.data.details;patch.assigned_to=parsed.data.assignedTo??current.assigned_to;}
 if(next==="resolved"){patch.resolution_summary=parsed.data.details;patch.resolved_by=a.uid;patch.resolved_at=now;}
 if(next==="closed"){patch.closed_by=a.uid;patch.closed_at=now;}
 if(next==="open"&&current.case_status==="resolved"){patch.resolved_by=null;patch.resolved_at=null;patch.resolution_summary=null;patch.closed_by=null;patch.closed_at=null;}
 const{error:updateError}=await a.s.from("client_conversations").update(patch).eq("id",current.id).eq("organization_id",a.organizationId);
 if(updateError)return{success:false,message:"The case could not be updated."};
 const{error:eventError}=await a.s.from("client_conversation_events").insert({organization_id:a.organizationId,conversation_id:current.id,actor_id:a.uid,event_type:next==="escalated"?"escalated":next==="resolved"?"resolved":next==="closed"?"closed":next==="assigned"?"assigned":current.case_status==="resolved"&&next==="open"?"reopened":"status_changed",from_status:current.case_status,to_status:next,details:parsed.data.details??null,assigned_to:parsed.data.assignedTo??null});
 if(eventError){console.error("KRAM case event insert failed",{code:eventError.code,message:eventError.message});return{success:false,message:"The case changed, but its audit event could not be recorded. Contact an administrator."};}
 for(const l of["fr","en","pt"])revalidatePath("/"+l+"/ops/communications");
 return{success:true,message:"Case updated."};
}
