"use server";
import {revalidatePath} from "next/cache"; import {z} from "zod"; import {createClient} from "@/lib/supabase/server";
const schema=z.object({name:z.string().trim().min(2).max(160),reference:z.string().trim().min(2).max(60),type:z.enum(["residential","commercial","construction","retail","warehouse","land","hospitality","other"]),countryCode:z.string().trim().toUpperCase().length(2),city:z.string().trim().min(2).max(100),address:z.string().trim().max(300).optional(),description:z.string().trim().max(2000).optional(),clientId:z.string().uuid().optional().or(z.literal(""))});
export type AssetActionState={success:boolean;message:string};
export async function createAssetRecord(_prev:AssetActionState,formData:FormData):Promise<AssetActionState>{
 const parsed=schema.safeParse({name:formData.get("name"),reference:formData.get("reference"),type:formData.get("type"),countryCode:formData.get("countryCode"),city:formData.get("city"),address:formData.get("address"),description:formData.get("description"),clientId:formData.get("clientId")});
 if(!parsed.success)return{success:false,message:"Please complete the required asset fields."};
 const supabase=await createClient();const{data:claims}=await supabase.auth.getClaims();const userId=claims?.claims?.sub;if(!userId)return{success:false,message:"Your session is no longer valid."};
 const{data:membership}=await supabase.from("organization_members").select("organization_id").eq("user_id",userId).limit(1).maybeSingle();if(!membership)return{success:false,message:"You are not authorized to create assets."};
 const{error}=await supabase.from("assets").insert({organization_id:membership.organization_id,name:parsed.data.name,reference_code:parsed.data.reference,type:parsed.data.type,country_code:parsed.data.countryCode,city:parsed.data.city,address:parsed.data.address||null,description:parsed.data.description||null,client_id:parsed.data.clientId||null});
 if(error){if(error.code==="23505")return{success:false,message:"That asset reference already exists."};return{success:false,message:"The asset could not be created."}}
 revalidatePath("/fr/ops/assets");revalidatePath("/en/ops/assets");revalidatePath("/pt/ops/assets");return{success:true,message:"Asset created successfully."};
}
