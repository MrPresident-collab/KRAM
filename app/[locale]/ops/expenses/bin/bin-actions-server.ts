"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type BinActionState = { success: boolean; message: string };

export async function emptyKramBin(
  _previous: BinActionState,
  _formData: FormData,
): Promise<BinActionState> {
  void _previous;
  void _formData;

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;

  if (!userId) {
    return { success: false, message: "Your session is no longer valid." };
  }

  const { data: membership, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id,role,scope_level")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (
    membershipError ||
    !membership ||
    !["owner", "admin", "regional_admin"].includes(membership.role) ||
    !["global", "country"].includes(membership.scope_level)
  ) {
    return {
      success: false,
      message: "Only Global and Regional administrators can empty the bin.",
    };
  }

  const admin = createAdminClient();
  const tables = ["expenses", "work_orders", "inspections", "projects", "reports"] as const;

  for (const table of tables) {
    const { error } = await admin
      .from(table)
      .delete()
      .eq("organization_id", membership.organization_id)
      .not("deleted_at", "is", null);

    if (error) {
      return {
        success: false,
        message: "The bin could not be emptied: " + error.message,
      };
    }
  }

  for (const locale of ["fr", "en", "pt"]) {
    revalidatePath("/" + locale + "/ops/expenses/bin");
    revalidatePath("/" + locale + "/ops/expenses");
    revalidatePath("/" + locale + "/ops/work-orders");
    revalidatePath("/" + locale + "/ops/inspections");
    revalidatePath("/" + locale + "/ops/projects");
    revalidatePath("/" + locale + "/ops/reports");
  }

  return { success: true, message: "KRAM bin emptied successfully." };
}


export async function restoreBinItem(_previous: BinActionState, fd: FormData): Promise<BinActionState> {
 const id=String(fd.get("id")||""); const type=String(fd.get("type")||"");
 if(!id || !["expense","work_order","inspection","project","report"].includes(type)) return {success:false,message:"Invalid bin record."};
 const s=await createClient(); const {data:claims}=await s.auth.getClaims(); const uid=claims?.claims?.sub;
 if(!uid)return{success:false,message:"Your session is no longer valid."};
 const {data:m}=await s.from("organization_members").select("organization_id,role").eq("user_id",uid).eq("status","active").limit(1).maybeSingle();
 if(!m||!["owner","admin","regional_admin","operations","finance"].includes(m.role))return{success:false,message:"You are not authorized to restore this record."};
 let error:any=null;
 if(type==="expense")({error}=await s.from("expenses").update({deleted_at:null,updated_at:new Date().toISOString()}).eq("id",id).eq("organization_id",m.organization_id).not("deleted_at","is",null));
 if(type==="work_order")({error}=await s.from("work_orders").update({deleted_at:null,updated_at:new Date().toISOString()}).eq("id",id).eq("organization_id",m.organization_id).not("deleted_at","is",null));
 if(type==="inspection")({error}=await s.from("inspections").update({deleted_at:null,updated_at:new Date().toISOString()}).eq("id",id).eq("organization_id",m.organization_id).not("deleted_at","is",null));
 if(type==="project")({error}=await s.from("projects").update({deleted_at:null,updated_at:new Date().toISOString()}).eq("id",id).eq("organization_id",m.organization_id).not("deleted_at","is",null));
 if(type==="report")({error}=await s.from("reports").update({deleted_at:null,updated_at:new Date().toISOString()}).eq("id",id).eq("organization_id",m.organization_id).not("deleted_at","is",null));
 if(error)return{success:false,message:"The record could not be restored: "+error.message};
 for(const l of ["fr","en","pt"]){revalidatePath("/"+l+"/ops/expenses/bin");revalidatePath("/"+l+"/ops/expenses");revalidatePath("/"+l+"/ops/work-orders");revalidatePath("/"+l+"/ops/inspections");revalidatePath("/"+l+"/ops/projects");revalidatePath("/"+l+"/ops/reports");}
 return{success:true,message:"Record restored successfully."};
}
