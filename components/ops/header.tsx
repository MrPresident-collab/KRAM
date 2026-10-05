"use client";

import { Bell, Search, Command, ArrowUpRight, Clock3 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { UserMenu } from "@/components/ops/user-menu";

type User = { name:string; email:string; role:string; scope:string; jobTitle?:string|null; avatarUrl?:string|null };
type Result = { type:string; title:string; meta?:string|null; href:string };
type Notification = { id:string; title:string; body:string; createdAt:string; href:string };

export function OpsHeader({ locale, user, workspaceLabel, collapsed=false, onToggleSidebar, onOpenMobile }: {
  locale:Locale; user:User; workspaceLabel?:string; collapsed?:boolean; onToggleSidebar?:()=>void; onOpenMobile?:()=>void;
}) {
  const [searchOpen,setSearchOpen]=useState(false);
  const [query,setQuery]=useState("");
  const [results,setResults]=useState<Result[]>([]);
  const [notificationsOpen,setNotificationsOpen]=useState(false);
  const [notifications,setNotifications]=useState<Notification[]>([]);
  const inputRef=useRef<HTMLInputElement>(null);

  useEffect(()=>{ if(!searchOpen)return; inputRef.current?.focus(); const timer=window.setTimeout(async()=>{ if(query.trim().length<2){setResults([]);return;} const r=await fetch("/api/ops/search?q="+encodeURIComponent(query.trim())); if(r.ok){const data=await r.json();setResults(data.results??[]);} },180); return()=>window.clearTimeout(timer); },[query,searchOpen]);
  useEffect(()=>{ if(!notificationsOpen)return; fetch("/api/ops/notifications").then(r=>r.ok?r.json():{notifications:[]}).then(data=>setNotifications(data.notifications??[])); },[notificationsOpen]);
  useEffect(()=>{ const key=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();setSearchOpen(true);} if(e.key==="Escape"){setSearchOpen(false);setNotificationsOpen(false);}}; window.addEventListener("keydown",key); return()=>window.removeEventListener("keydown",key); },[]);

  const placeholder=locale==="fr"?"Rechercher dans KRAM...":locale==="pt"?"Pesquisar no KRAM...":"Search KRAM operations...";
  const context=workspaceLabel||(locale==="fr"?"Vue globale":locale==="pt"?"Visão global":"Global Overview");

  return <>
    <header className="sticky top-0 z-30 flex h-[68px] items-center gap-3 border-b border-[var(--kram-border)] bg-[rgba(243,243,240,.96)] px-4 backdrop-blur-xl lg:px-6">
      <button type="button" onClick={onOpenMobile} className="rounded-lg p-2 text-[var(--kram-metal)] hover:bg-white lg:hidden" aria-label="Open navigation">☰</button>
      {onToggleSidebar&&<button type="button" onClick={onToggleSidebar} className="hidden rounded-lg p-2 text-[var(--kram-metal)] hover:bg-white lg:block" aria-label="Toggle sidebar">{collapsed?"→":"←"}</button>}
      <div className="hidden min-w-0 items-center gap-2 xl:flex"><span className="text-[11px] font-bold uppercase tracking-[.16em] text-[var(--kram-soft-metal)]">KRAM</span><span className="text-zinc-300">/</span><span className="max-w-[220px] truncate text-xs font-semibold text-[var(--kram-ink)]">{context}</span></div>
      <button type="button" onClick={()=>setSearchOpen(true)} className="ml-1 flex h-10 min-w-0 flex-1 items-center gap-3 rounded-lg border border-[var(--kram-border)] bg-white px-3.5 text-left transition hover:border-[var(--kram-soft-metal)] xl:max-w-[640px]"><Search size={17} className="text-[var(--kram-metal)]"/><span className="truncate text-[13px] text-[var(--kram-metal)]">{placeholder}</span><span className="ml-auto hidden items-center gap-1 rounded-md border border-[var(--kram-border)] bg-[var(--kram-bg)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--kram-metal)] sm:flex"><Command size={10}/>K</span></button>
      <div className="ml-auto flex items-center gap-2"><div className="relative"><button type="button" onClick={()=>setNotificationsOpen(v=>!v)} aria-label="Notifications" className="relative rounded-lg border border-[var(--kram-border)] bg-white p-2.5 text-[var(--kram-charcoal)] hover:bg-[var(--kram-bg)]"><Bell size={17}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--kram-orange)]"/></button>
      {notificationsOpen&&<div className="absolute right-0 top-full z-50 mt-2 w-[360px] overflow-hidden rounded-xl border border-[var(--kram-border)] bg-white shadow-2xl"><div className="border-b border-[var(--kram-border)] px-4 py-3"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[var(--kram-soft-metal)]">Notifications</p><p className="mt-0.5 text-sm font-bold text-zinc-950">{notifications.length?"Active notifications":"No new activity"}</p></div><div className="max-h-[420px] overflow-y-auto">{notifications.length?notifications.map(n=><Link key={n.id} href={"/"+locale+n.href} onClick={()=>setNotificationsOpen(false)} className="block border-b border-zinc-100 px-4 py-3 hover:bg-zinc-50"><div className="flex gap-3"><Clock3 size={15} className="mt-0.5 text-[var(--kram-orange)]"/><div className="min-w-0"><p className="text-xs font-bold text-zinc-900">{n.title}</p><p className="mt-1 text-xs leading-5 text-zinc-500">{n.body}</p><p className="mt-1 text-[10px] text-zinc-400">{new Date(n.createdAt).toLocaleString(locale)}</p></div><ArrowUpRight size={14} className="ml-auto text-zinc-300"/></div></Link>):<div className="px-4 py-10 text-center text-xs text-zinc-500">Nothing requires attention right now.</div>}</div></div>}</div><UserMenu locale={locale} user={user}/></div>
    </header>
    {searchOpen&&<div className="fixed inset-0 z-[70] bg-black/25 p-4 backdrop-blur-[2px]" onMouseDown={()=>setSearchOpen(false)}><div className="mx-auto mt-[8vh] max-w-2xl overflow-hidden rounded-2xl border border-[var(--kram-border)] bg-white shadow-2xl" onMouseDown={e=>e.stopPropagation()}><div className="flex items-center gap-3 border-b border-[var(--kram-border)] px-4 py-3"><Search size={18} className="text-[var(--kram-metal)]"/><input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-sm outline-none"/><kbd className="rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-400">ESC</kbd></div><div className="max-h-[55vh] overflow-y-auto">{query.length<2?<div className="px-5 py-12 text-center text-sm text-zinc-500">Search assets, clients, work orders, projects, inspections, providers, reports or documents.</div>:results.length?results.map(r=><Link key={r.type+r.href} href={"/"+locale+r.href} onClick={()=>setSearchOpen(false)} className="flex items-center gap-4 border-b border-zinc-100 px-5 py-3 hover:bg-zinc-50"><span className="w-24 text-[10px] font-bold uppercase tracking-[.12em] text-[var(--kram-soft-metal)]">{r.type}</span><span className="min-w-0 flex-1 truncate text-sm font-semibold text-zinc-900">{r.title}</span><span className="max-w-40 truncate text-xs text-zinc-400">{r.meta}</span><ArrowUpRight size={15} className="text-zinc-300"/></Link>):<div className="px-5 py-12 text-center text-sm text-zinc-500">No matching KRAM records.</div>}</div></div></div>}
  </>;
}
