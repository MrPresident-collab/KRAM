"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Clock3, MapPin, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export type ClientApproval = {
  work_order_id: string;
  asset_id: string;
  asset_name: string;
  work_order_title: string;
  estimated_cost: number | string | null;
  approval_status: string;
  work_order_status: string;
  requested_at: string;
};

export function ClientApprovalsList({ initialItems, locale, copy }: {
  initialItems: ClientApproval[];
  locale: string;
  copy: { approve: string; decline: string; pending: string; noRequests: string; privacy: string; success: string; failed: string; cost: string; requested: string; asset: string };
}) {
  const [items,setItems]=useState(initialItems);
  const [busy,setBusy]=useState<string|null>(null);
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");

  async function decide(id:string,decision:"approved"|"rejected"){
    if(busy)return;
    setBusy(id);setError("");setNotice("");
    const supabase=createClient();
    const {error:rpcError}=await supabase.rpc("respond_to_client_approval",{p_work_order_id:id,p_decision:decision});
    if(rpcError){setError(copy.failed);setBusy(null);return;}
    setItems(current=>current.filter(item=>item.work_order_id!==id));
    setNotice(copy.success);setBusy(null);
  }

  if(!items.length)return <section className="client-approval-empty"><Clock3 size={25}/><p>{copy.noRequests}</p></section>;
  return <div className="client-approval-list">
    {notice&&<p role="status" className="client-approval-notice">{notice}</p>}
    {error&&<p role="alert" className="client-access-error">{error}</p>}
    {items.map(item=><article className="client-approval-card" key={item.work_order_id}>
      <div className="client-approval-card-top"><span className="client-approval-icon"><Clock3 size={19}/></span><span className="client-portal-status">{copy.pending}</span></div>
      <h2>{item.work_order_title}</h2>
      <p className="client-approval-asset"><MapPin size={14}/>{copy.asset}: <Link href={"/"+locale+"/client/assets/"+item.asset_id}>{item.asset_name}</Link></p>
      <div className="client-approval-meta"><span>{copy.requested}</span><strong>{new Intl.DateTimeFormat(locale,{dateStyle:"medium"}).format(new Date(item.requested_at))}</strong></div>
      {item.estimated_cost!==null&&<div className="client-approval-meta"><span>{copy.cost}</span><strong>{Number(item.estimated_cost).toLocaleString(locale,{maximumFractionDigits:2})}</strong></div>}
      <div className="client-approval-actions"><button type="button" onClick={()=>decide(item.work_order_id,"rejected")} disabled={busy!==null} className="client-approval-decline"><X size={15}/>{busy===item.work_order_id?"…":copy.decline}</button><button type="button" onClick={()=>decide(item.work_order_id,"approved")} disabled={busy!==null} className="button button-orange"><Check size={15}/>{busy===item.work_order_id?"…":copy.approve}<ArrowRight size={14}/></button></div>
    </article>)}
    <p className="client-approval-privacy">{copy.privacy}</p>
  </div>;
}
