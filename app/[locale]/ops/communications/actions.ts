"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
const schema=z.object({conversationId:z.string().uuid(),body:z.string().trim().min(1).max(10000),visibility:z.enum(["client","internal"])});
export async function sendMessage(formData:FormData){
 const parsed=schema.safeParse({conversationId:formData.get("conversationId"),body:formData.get("body"),visibility:formData.get("visibility")||"client"});
 if(!parsed.success)return;
 const supabase=await createClient();
 const {data:claims}=await supabase.auth.getClaims(); const userId=claims?.claims?.sub;
 if(!userId)return;
 const {data:conversation}=await supabase.from("client_conversations").select("id,organization_id,client_id").eq("id",parsed.data.conversationId).maybeSingle();
 if(!conversation)return;
 const {data:membership}=await supabase.from("organization_members").select("organization_id").eq("user_id",userId).eq("status","active").limit(1).maybeSingle();
 if(!membership || membership.organization_id!==conversation.organization_id)return;
 const {error}=await supabase.from("client_conversation_messages").insert({organization_id:conversation.organization_id,conversation_id:conversation.id,sender_user_id:userId,body:parsed.data.body,visibility:parsed.data.visibility});
 if(error)return;
 await supabase.from("client_conversations").update({last_message_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq("id",conversation.id);
 revalidatePath("/fr/ops/communications");revalidatePath("/en/ops/communications");revalidatePath("/pt/ops/communications");
}