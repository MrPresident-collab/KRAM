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
 const{error}=await s.from("expenses").insert({organization_id:m.organization_id,description:parsed.data.description,category:parsed.data.category,amount:parsed.data.amount,currency:parsed.data.currency.toUpperCase(),paid_to:parsed.data.paidTo||null,expense_date:parsed.data.expenseDate,asset_id:parsed.data.assetId||null,work_order_id:parsed.data.workOrderId||null,provider_id:parsed.data.providerId||null,notes:parsed.data.notes||null,created_by:uid});
 if(error)return{success:false,message:"The expense could not be created."};
 for(const l of ["fr","en","pt"])revalidatePath("/"+l+"/ops/expenses");
 return{success:true,message:"Expense created successfully."};
}