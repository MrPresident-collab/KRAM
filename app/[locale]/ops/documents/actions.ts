"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  fileName: z.string().trim().min(1).max(255),
  storagePath: z.string().min(1).max(1024),
  mimeType: z.string().max(160).optional().nullable(),
  sizeBytes: z.number().int().positive().max(20 * 1024 * 1024),
  documentType: z.enum(["evidence","report","invoice","contract","photo","inspection","maintenance","other"]),
  description: z.string().trim().max(1000).optional(),
});

export async function saveDocumentMetadata(input: unknown) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Please check the document details and file size." };
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return { success: false, message: "Your session has expired. Sign in again." };
  const { data: member } = await supabase.from("organization_members").select("organization_id,role,scope_level,branch_id,status").eq("user_id", userId).eq("status", "active").order("created_at", { ascending: true }).limit(1).maybeSingle();
  if (!member || !["owner","admin","regional_admin","operations","finance"].includes(member.role)) return { success: false, message: "You are not authorized to upload documents." };
  const expectedPrefix = member.branch_id ? `${member.organization_id}/${member.branch_id}/` : `${member.organization_id}/shared/`;
  if (!parsed.data.storagePath.startsWith(expectedPrefix)) return { success: false, message: "The document storage path is outside your authorized scope." };
  const { error } = await supabase.from("documents").insert({
    organization_id: member.organization_id,
    branch_id: member.branch_id,
    file_name: parsed.data.fileName,
    storage_path: parsed.data.storagePath,
    mime_type: parsed.data.mimeType ?? null,
    size_bytes: parsed.data.sizeBytes,
    document_type: parsed.data.documentType,
    description: parsed.data.description || null,
    uploaded_by: userId,
  });
  if (error) {
    console.error("KRAM document metadata insert failed", { code: error.code, message: error.message });
    return { success: false, message: "The file uploaded, but its document record could not be saved. Remove the upload and try again." };
  }
  for (const locale of ["fr","en","pt"]) revalidatePath(`/${locale}/ops/documents`);
  return { success: true, message: "Document uploaded successfully." };
}
