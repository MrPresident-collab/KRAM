"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
export type ExpenseActionState={success:boolean;message:string};
const schema=z.object({description:z.string().trim().min(2).max(200),category:z.string().trim().min(2).max(80),amount:z.coerce.number().nonnegative(),currency:z.string().length(3),paidTo:z.string().trim().max(160).optional(),expenseDate:z.string().min(10),assetId:z.string().uuid().optional().or(z.literal("")),workOrderId:z.string().uuid().optional().or(z.literal("")),providerId:z.string().uuid().optional().or(z.literal("")),notes:z.string().trim().max(3000).optional()});
export async function createExpense(_prev:ExpenseActionState,fd:FormData):Promise<ExpenseActionState>{
 const parsed=schema.safeParse({description:fd.get("description"),category:fd.get("category"),amount:fd.get("amount"),currency:fd.get("currency"),paidTo:fd.get("paidTo")||undefined,expenseDate:fd.get("expenseDate"),assetId:fd.get("assetId")||"",workOrderId:fd.get("workOrderId")||"",providerId:fd.get("providerId")||"",notes:fd.get("notes")||undefined});
 if(!parsed.success)return{success:false,message:"Please complete the expense fields correctly."};
 const s=await createClient();const{data:c}=await s.auth.getClaims();const uid=c?.claims?.sub;if(!uid)return{success:false,message:"Your session is no longer valid."};
 const{data:m}=await s.from("organization_members").select("organization_id,role").eq("user_id",uid).limit(1).maybeSingle();
 if(!m||!["owner","admin","regional_admin","operations","finance"].includes(m.role))return{success:false,message:"You are not authorized to create expenses."};
 const{data:expense,error}=await s.from("expenses").insert({organization_id:m.organization_id,description:parsed.data.description,category:parsed.data.category,amount:parsed.data.amount,currency:parsed.data.currency.toUpperCase(),paid_to:parsed.data.paidTo||null,expense_date:parsed.data.expenseDate,asset_id:parsed.data.assetId||null,work_order_id:parsed.data.workOrderId||null,provider_id:parsed.data.providerId||null,notes:parsed.data.notes||null,created_by:uid}).select("id").single();
 if(error||!expense)return{success:false,message:"The expense could not be created."};
 const {error:approvalError}=await s.from("approvals").insert({
   organization_id:m.organization_id,
   expense_id:expense.id,
   status:"pending",
   requested_by:uid,
 });
 if(approvalError){
   await s.from("expenses").delete().eq("id",expense.id).eq("organization_id",m.organization_id);
   return{success:false,message:"The expense approval request could not be created."};
 }
 for(const l of ["fr","en","pt"])revalidatePath("/"+l+"/ops/expenses");
 return{success:true,message:"Expense created successfully."};
}

const expenseTransitions: Record<string,string[]> = {
 requested:["approved","rejected"],
 approved:["paid"],
 paid:["verified"],
 verified:[],
 rejected:[],
};

export async function transitionExpense(
 _prev: ExpenseActionState,
 fd: FormData,
): Promise<ExpenseActionState> {
 const parsed=z.object({
   expenseId:z.string().uuid(),
   status:z.enum(["approved","paid","verified","rejected"]),
   note:z.string().trim().max(2000).optional(),
 }).safeParse({
   expenseId:fd.get("expenseId"),
   status:fd.get("status"),
   note:fd.get("note")||undefined,
 });
 if(!parsed.success)return{success:false,message:"Invalid expense transition."};

 const s=await createClient();
 const{data:c}=await s.auth.getClaims();
 const uid=c?.claims?.sub;
 if(!uid)return{success:false,message:"Your session is no longer valid."};

 const{data:m}=await s.from("organization_members")
   .select("organization_id,role")
   .eq("user_id",uid).limit(1).maybeSingle();

 if(!m||!["owner","admin","regional_admin","finance"].includes(m.role))
   return{success:false,message:"You are not authorized to approve or verify expenses."};

 const{data:e}=await s.from("expenses")
   .select("id,organization_id,status")
   .eq("id",parsed.data.expenseId)
   .eq("organization_id",m.organization_id).maybeSingle();

 if(!e)return{success:false,message:"Expense not found."};

 const allowed=expenseTransitions[e.status]??[];
 if(!allowed.includes(parsed.data.status))
   return{success:false,message:"That expense transition is not allowed."};

 const{error:updateError}=await s.from("expenses")
   .update({
     status:parsed.data.status,
     ...(parsed.data.status==="approved"?{approved_by:uid}:{ }),
     ...(parsed.data.status==="verified"?{verified_by:uid}:{ }),
     updated_at:new Date().toISOString(),
   })
   .eq("id",e.id).eq("organization_id",e.organization_id);

 if(updateError)return{success:false,message:"The expense could not be updated."};

 if(["approved","rejected"].includes(parsed.data.status)){
   await s.from("approvals")
     .update({
       status:parsed.data.status,
       decided_by:uid,
       decision_note:parsed.data.note||null,
       decided_at:new Date().toISOString(),
     })
     .eq("expense_id",e.id)
     .eq("organization_id",e.organization_id)
     .eq("status","pending");
 }

 for(const l of ["fr","en","pt"]){
   revalidatePath("/"+l+"/ops/expenses");
   revalidatePath("/"+l+"/ops/expenses/"+e.id);
   revalidatePath("/"+l+"/ops/approvals");
 }
 return{success:true,message:"Expense updated successfully."};
}
