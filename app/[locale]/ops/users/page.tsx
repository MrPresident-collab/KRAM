import { notFound, redirect } from "next/navigation";
import { Users, ShieldCheck, Globe2, Building2 } from "lucide-react";
import { isLocale, type Locale, copy } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { StaffForm } from "./staff-form";

const roleLabels = { owner:"Owner", admin:"Administrator", regional_admin:"Regional Admin", operations:"Operations", finance:"Finance", support:"Support", viewer:"Viewer", client:"Client" };

export default async function UsersPage({ params }: { params: Promise<{ locale:string }> }) {
  const { locale }=await params;
  if(!isLocale(locale)) notFound();
  const t=copy[locale as Locale]; const ui = t;
  const supabase=await createClient();
  const { data: claims }=await supabase.auth.getClaims();
  const userId=claims?.claims?.sub;
  if(!userId) redirect(`/${locale}/login`);

  const { data: membership }=await supabase.from("organization_members").select("organization_id,role,scope_level,country_id,branch_id").eq("user_id",userId).order("created_at",{ascending:true}).limit(1).maybeSingle();
  if(!membership) return <div className="rounded-2xl border border-red-200 bg-red-50 p-8"><h1 className="text-lg font-bold text-red-900">{ui.usersPage.accessMissing}</h1><p className="mt-2 text-sm text-red-700">{ui.usersPage.accessMissingDesc}</p></div>;

  const { data: staff }=await supabase.from("organization_members").select("id,user_id,role,scope_level,country_id,branch_id,status,profiles(full_name,work_email,job_title,avatar_url),countries(name),branches(name,city)").eq("organization_id",membership.organization_id).order("created_at",{ascending:true});
  const canCreate=membership.role==="owner"||membership.role==="admin"||membership.role==="regional_admin";

  return <div className="space-y-7">
    <div className="flex items-start justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">{t.users.title}</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-zinc-950">{t.users.title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">{ui.usersPage.staffDescription}</p></div>
      {canCreate&&<StaffForm locale={locale as Locale}/>}
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-5"><Users size={18} className="text-[var(--kram-orange)]"/><p className="mt-4 text-2xl font-bold">{staff?.length??0}</p><p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{ui.usersPage.staffAccounts}</p></div>
      <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-5"><ShieldCheck size={18} className="text-[var(--kram-orange)]"/><p className="mt-4 text-2xl font-bold">{staff?.filter(s=>s.role==="owner"||s.role==="admin"||s.role==="regional_admin").length??0}</p><p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{ui.usersPage.administrators}</p></div>
      <div className="rounded-2xl border border-[var(--kram-border)] bg-white p-5"><Globe2 size={18} className="text-[var(--kram-orange)]"/><p className="mt-4 text-2xl font-bold">{new Set((staff??[]).map(s=>s.country_id).filter(Boolean)).size}</p><p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{ui.usersPage.countries}</p></div>
    </div>
    <div className="overflow-hidden rounded-2xl border border-[var(--kram-border)] bg-white">
      <div className="hidden grid-cols-[2fr_1.5fr_1fr_1.2fr] gap-4 border-b border-zinc-100 bg-zinc-50/70 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400 md:grid"><span>{ui.usersPage.staff}</span><span>{ui.usersPage.function}</span><span>{ui.usersPage.role}</span><span>Scope</span></div>
      <div className="divide-y divide-zinc-100">{(staff??[]).map(member=>{const profile=Array.isArray(member.profiles)?member.profiles[0]:member.profiles;const country=Array.isArray(member.countries)?member.countries[0]:member.countries;const branch=Array.isArray(member.branches)?member.branches[0]:member.branches;const initials=(profile?.full_name??"K").split(/\s+/).filter(Boolean).slice(0,2).map((x:string)=>x[0]).join("").toUpperCase();const scope=member.scope_level==="global"?"Global":member.scope_level==="country"?country?.name??"Country":branch?.name??"Branch";return <div key={member.id} className="grid gap-4 px-5 py-4 md:grid-cols-[2fr_1.5fr_1fr_1.2fr] md:items-center"><div className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--kram-charcoal)] text-xs font-black text-white">{initials}</div><div className="min-w-0"><p className="truncate text-sm font-bold">{profile?.full_name??"Unknown user"}</p><p className="truncate text-xs text-zinc-500">{profile?.work_email??"—"}</p></div></div><p className="text-sm font-semibold text-zinc-800">{profile?.job_title??"—"}</p><div className="flex items-center gap-2"><span className="w-fit rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-[var(--kram-orange)]">{roleLabels[member.role as keyof typeof roleLabels]??member.role}</span><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${member.status==="active"?"bg-emerald-50 text-emerald-700":member.status==="deactivated"?"bg-zinc-100 text-zinc-500":"bg-amber-50 text-amber-700"}`}>{member.status}</span></div><div className="flex items-center gap-2 text-sm text-zinc-600"><Building2 size={14} className="text-zinc-400"/>{scope}</div></div>})}{!staff?.length&&<div className="p-12 text-center text-sm text-zinc-500">{ui.usersPage.noStaff}</div>}</div>
    </div>
  </div>;
}