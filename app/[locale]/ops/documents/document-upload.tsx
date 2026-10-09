"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { saveDocumentMetadata } from "./actions";

const labels = {
  fr: { upload:"Téléverser un document", type:"Type de document", description:"Description (facultatif)", choose:"Choisir un fichier", save:"Téléverser", busy:"Téléversement…", success:"Document téléversé.", error:"Échec du téléversement.", types:{evidence:"Preuve",report:"Rapport",invoice:"Facture",contract:"Contrat",photo:"Photo",inspection:"Inspection",maintenance:"Maintenance",other:"Autre"} },
  en: { upload:"Upload document", type:"Document type", description:"Description (optional)", choose:"Choose a file", save:"Upload document", busy:"Uploading…", success:"Document uploaded.", error:"Upload failed.", types:{evidence:"Evidence",report:"Report",invoice:"Invoice",contract:"Contract",photo:"Photo",inspection:"Inspection",maintenance:"Maintenance",other:"Other"} },
  pt: { upload:"Carregar documento", type:"Tipo de documento", description:"Descrição (opcional)", choose:"Escolher ficheiro", save:"Carregar documento", busy:"A carregar…", success:"Documento carregado.", error:"Falha ao carregar.", types:{evidence:"Comprovativo",report:"Relatório",invoice:"Fatura",contract:"Contrato",photo:"Fotografia",inspection:"Inspeção",maintenance:"Manutenção",other:"Outro"} },
} as const;

const allowed = new Set(["application/pdf","image/jpeg","image/png","image/webp","text/plain","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]);
type Props = { locale:"fr"|"en"|"pt"; organizationId:string; branchId:string|null };
export function DocumentUpload({locale,organizationId,branchId}:Props) {
  const t=labels[locale]; const router=useRouter(); const input=useRef<HTMLInputElement>(null);
  const [type,setType]=useState<keyof typeof t.types>("other"); const [description,setDescription]=useState(""); const [busy,setBusy]=useState(false); const [message,setMessage]=useState(""); const [error,setError]=useState(false);
  async function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const file=input.current?.files?.[0]; if(!file)return;
    setBusy(true);setMessage("");setError(false);
    if(file.size>20*1024*1024||!allowed.has(file.type)){setError(true);setMessage("Choose a supported file up to 20 MB.");setBusy(false);return;}
    const supabase=createClient();const id=crypto.randomUUID();const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,"_");const folder=branchId??"shared";const path=`${organizationId}/${folder}/${id}-${safeName}`;
    const {error:uploadError}=await supabase.storage.from("kram-documents").upload(path,file,{contentType:file.type,upsert:false});
    if(uploadError){setError(true);setMessage(uploadError.message);setBusy(false);return;}
    const result=await saveDocumentMetadata({fileName:file.name,storagePath:path,mimeType:file.type,sizeBytes:file.size,documentType:type,description});
    if(!result.success){await supabase.storage.from("kram-documents").remove([path]);setError(true);setMessage(result.message);setBusy(false);return;}
    setMessage(t.success);setDescription("");setType("other");if(input.current)input.current.value="";setBusy(false);router.refresh();
  }
  return <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-[var(--kram-border)] bg-white p-4 md:grid-cols-[1fr_1fr_1.4fr_auto] md:items-end">
    <label className="block"><span className="mb-1.5 block text-xs font-semibold">{t.type}</span><select value={type} onChange={e=>setType(e.target.value as keyof typeof t.types)} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm">{Object.entries(t.types).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
    <label className="block"><span className="mb-1.5 block text-xs font-semibold">{t.description}</span><input value={description} onChange={e=>setDescription(e.target.value)} maxLength={1000} className="w-full rounded-xl border border-zinc-200 px-3 py-3 text-sm"/></label>
    <label className="block"><span className="mb-1.5 block text-xs font-semibold">{t.choose}</span><input ref={input} type="file" required accept=".pdf,.jpg,.jpeg,.png,.webp,.txt,.doc,.docx,.xls,.xlsx" className="block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:font-semibold"/></label>
    <button disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--kram-charcoal)] px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{busy?<Loader2 size={16} className="animate-spin"/>:<FileUp size={16} />}{busy?t.busy:t.save}</button>
    {message&&<p role="status" className={`text-xs md:col-span-4 ${error?"text-red-600":"text-emerald-700"}`}>{message}</p>}
  </form>;
}
