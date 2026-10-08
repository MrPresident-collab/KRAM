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
  if(error||!conversation)return{success:false,message:"The conversation could not be started."};
  const {error:messageError}=await a.s.from("client_conversation_messages").insert({organization_id:a.organizationId,conversation_id:conversation.id,sender_user_id:a.uid,body:parsed.data.body,visibility:"client",message_type:"message"});
  if(messageError){await a.s.from("client_conversations").delete().eq("id",conversation.id).eq("organization_id",a.organizationId);return{success:false,message:"The conversation could not be completed. Please try again."};}
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