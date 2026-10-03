"use client";

import { ChevronDown, LogOut, Mail, ShieldCheck, Briefcase } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/i18n";
import { copy } from "@/lib/i18n";

type UserIdentity = { name: string; email: string; role: string; scope: string; jobTitle?: string | null; avatarUrl?: string | null };

const roleLabels = {
  fr: { owner: "Propriétaire", admin: "Administrateur", operations: "Opérations", finance: "Finance", support: "Support", viewer: "Lecteur", client: "Client", regional_admin: "Administrateur régional" },
  en: { owner: "Owner", admin: "Administrator", operations: "Operations", finance: "Finance", support: "Support", viewer: "Viewer", client: "Client", regional_admin: "Regional Admin" },
  pt: { owner: "Proprietário", admin: "Administrador", operations: "Operações", finance: "Finanças", support: "Suporte", viewer: "Leitor", client: "Cliente", regional_admin: "Administrador regional" },
} as const;
const scopeLabels = { fr: { global: "Global", country: "Pays", branch: "Agence" }, en: { global: "Global", country: "Country", branch: "Branch" }, pt: { global: "Global", country: "País", branch: "Filial" } } as const;

export function UserMenu({ locale, user }: { locale: Locale; user: UserIdentity }) {
  const t = copy[locale];
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const roleMap = roleLabels[locale];
  const scopeMap = scopeLabels[locale];
  const role = roleMap[user.role as keyof typeof roleMap] ?? user.role;
  const scope = scopeMap[user.scope as keyof typeof scopeMap] ?? user.scope;
  const initials = user.name.split(/s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || user.email.slice(0, 1).toUpperCase();

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/" + locale + "/login");
    router.refresh();
  }

  return <div className="relative">
    <button type="button" onClick={() => setOpen((value) => !value)} className="flex items-center gap-2 rounded-xl border border-[var(--kram-border)] bg-white px-2 py-1.5 text-left transition hover:bg-zinc-50" aria-expanded={open}>
      <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-[var(--kram-charcoal)] text-[11px] font-black text-white">{user.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" /> : initials}</span>
      <span className="hidden min-w-0 md:block">
        <span className="block max-w-36 truncate text-xs font-bold text-zinc-900">{user.name}</span>
        <span className="block max-w-40 truncate text-[10px] font-semibold text-[var(--kram-metal)]">{user.jobTitle || role} · {scope}</span>
      </span>
      <ChevronDown size={14} className="text-zinc-400" />
    </button>

    {open && <><button className="fixed inset-0 z-40 cursor-default" aria-label="Close account menu" onClick={() => setOpen(false)} /><div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-[var(--kram-border)] bg-white p-2 shadow-xl">
      <div className="rounded-xl bg-[var(--kram-background)] p-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-[var(--kram-charcoal)] text-xs font-black text-white">{user.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" /> : initials}</span>
          <div className="min-w-0"><p className="truncate text-sm font-bold text-zinc-900">{user.name}</p><p className="truncate text-xs text-zinc-500">{user.email}</p></div>
        </div>
      </div>
      <div className="space-y-1 p-2">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2"><Briefcase size={15} className="text-[var(--kram-orange)]" /><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400">Function</p><p className="text-xs font-semibold text-zinc-800">{user.jobTitle || "—"}</p></div></div>
        <div className="flex items-center gap-3 rounded-lg px-2 py-2"><ShieldCheck size={15} className="text-[var(--kram-orange)]" /><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400">KRAM role</p><p className="text-xs font-semibold text-zinc-800">{role} · {scope}</p></div></div>
        <div className="flex items-center gap-3 rounded-lg px-2 py-2"><Mail size={15} className="text-[var(--kram-metal)]" /><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400">Work email</p><p className="truncate text-xs font-semibold text-zinc-800">{user.email}</p></div></div>
      </div>
      <button type="button" onClick={signOut} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"><LogOut size={15} /> {t.common.signOut ?? "Sign out"}</button>
    </div></>}
  </div>;
}
