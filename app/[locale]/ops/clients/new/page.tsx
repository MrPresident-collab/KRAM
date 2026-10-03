import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isLocale,type Locale,copy } from "@/lib/i18n";
import { ClientCreateForm } from "../client-create-form";
export default async function NewClientPage({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();const t=copy[locale as Locale];
 return <div className="mx-auto max-w-3xl space-y-7">
  <Link href={`/${locale}/ops/clients`} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900"><ArrowLeft size={15}/>{t.common.back}</Link>
  <section><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--kram-orange)]">{t.nav.clients}</p><h1 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-zinc-950">{t.clients.formTitle}</h1><p className="mt-2 text-sm text-zinc-500">{t.clients.formDescription}</p></section>
  <ClientCreateForm locale={locale as Locale}/>
 </div>;
}
