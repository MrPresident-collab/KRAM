import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ArrowLeft, CheckCircle2, Settings2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isLocale, type Locale } from "@/lib/i18n";
import { KramLogo } from "@/components/brand/kram-logo";
import { ClientSignOut } from "@/components/client-portal-sign-out";

const copy = {
  en: { eyebrow:"CLIENT PREFERENCES", title:"Account preferences", intro:"Choose the default currency you prefer to see throughout your KRAM client experience. Each financial report will still identify the currency used for that service.", currency:"Default currency", save:"Save preference", saved:"Your default currency has been updated.", back:"Your overview", finances:"Expenses & reports", privacy:"Your preference changes the default display choice. It does not rewrite approved budgets or historical financial records.", failed:"We couldn't save that preference. Please try again.", currencies:[["USD","US Dollar (USD)"],["EUR","Euro (EUR)"],["GBP","British Pound (GBP)"],["AOA","Angolan Kwanza (AOA)"],["CDF","Congolese Franc (CDF)"],["ZAR","South African Rand (ZAR)"],["CAD","Canadian Dollar (CAD)"],["CHF","Swiss Franc (CHF)"],["AUD","Australian Dollar (AUD)"],["BRL","Brazilian Real (BRL)"],["XAF","Central African CFA Franc (XAF)"],["XOF","West African CFA Franc (XOF)"]] as string[][] },
  fr: { eyebrow:"PRÉFÉRENCES CLIENT", title:"Préférences du compte", intro:"Choisissez la devise par défaut que vous préférez dans votre espace client KRAM. Chaque rapport financier indiquera toujours la devise utilisée pour la prestation.", currency:"Devise par défaut", save:"Enregistrer", saved:"Votre devise par défaut a été mise à jour.", back:"Votre espace", finances:"Dépenses et rapports", privacy:"Cette préférence définit la devise d’affichage par défaut. Elle ne modifie pas les budgets approuvés ni les documents financiers historiques.", failed:"Impossible d’enregistrer ce choix. Veuillez réessayer.", currencies:[["USD","Dollar américain (USD)"],["EUR","Euro (EUR)"],["GBP","Livre sterling (GBP)"],["AOA","Kwanza angolais (AOA)"],["CDF","Franc congolais (CDF)"],["ZAR","Rand sud-africain (ZAR)"],["CAD","Dollar canadien (CAD)"],["CHF","Franc suisse (CHF)"],["AUD","Dollar australien (AUD)"],["BRL","Réal brésilien (BRL)"],["XAF","Franc CFA d’Afrique centrale (XAF)"],["XOF","Franc CFA d’Afrique de l’Ouest (XOF)"]] as string[][] },
  pt: { eyebrow:"PREFERÊNCIAS DO CLIENTE", title:"Preferências da conta", intro:"Escolha a moeda padrão que prefere utilizar na sua área de cliente KRAM. Cada relatório financeiro continuará a indicar a moeda utilizada nesse serviço.", currency:"Moeda padrão", save:"Guardar preferência", saved:"A sua moeda padrão foi atualizada.", back:"A sua área", finances:"Despesas e relatórios", privacy:"Esta preferência define a moeda de apresentação padrão. Não altera orçamentos aprovados nem registos financeiros históricos.", failed:"Não foi possível guardar a preferência. Tente novamente.", currencies:[["USD","Dólar americano (USD)"],["EUR","Euro (EUR)"],["GBP","Libra esterlina (GBP)"],["AOA","Kwanza angolano (AOA)"],["CDF","Franco congolês (CDF)"],["ZAR","Rand sul-africano (ZAR)"],["CAD","Dólar canadiano (CAD)"],["CHF","Franco suíço (CHF)"],["AUD","Dólar australiano (AUD)"],["BRL","Real brasileiro (BRL)"],["XAF","Franco CFA da África Central (XAF)"],["XOF","Franco CFA da África Ocidental (XOF)"]] as string[][] }
} as const;

export default async function ClientSettingsPage({params, searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<{saved?:string;error?:string}>}) {
  const route = await params;
  const query = await searchParams;
  const locale: Locale = isLocale(route.locale) ? route.locale : "fr";
  const t = copy[locale];
  const supabase = await createClient();
  const {data:{user}} = await supabase.auth.getUser();
  if (!user) redirect("/"+locale+"/client-login");
  const {data:clientId,error:clientError} = await supabase.rpc("current_kram_client_id");
  if (clientError || !clientId) redirect("/"+locale+"/client-login");
  const {data:client} = await supabase.from("clients").select("default_currency").eq("id",clientId).maybeSingle();
  const current = String(client?.default_currency ?? "USD").trim();

  async function saveCurrency(formData:FormData) {
    "use server";
    const chosen = String(formData.get("currency") ?? "").trim().toUpperCase();
    const {isLocale} = await import("@/lib/i18n");
    const routeLocale = isLocale(locale) ? locale : "fr";
    const valid = ["USD","EUR","GBP","AOA","CDF","ZAR","CAD","CHF","AUD","BRL","XAF","XOF"];
    if (!valid.includes(chosen)) redirect("/"+routeLocale+"/client/settings?error=1");
    const db = await createClient();
    const {data:{user:sessionUser}} = await db.auth.getUser();
    if (!sessionUser) redirect("/"+routeLocale+"/client-login");
    const {error} = await db.rpc("set_client_default_currency",{p_currency:chosen});
    if (error) redirect("/"+routeLocale+"/client/settings?error=1");
    revalidatePath("/"+routeLocale+"/client");
    revalidatePath("/"+routeLocale+"/client/settings");
    revalidatePath("/"+routeLocale+"/client/financial-reports");
    redirect("/"+routeLocale+"/client/settings?saved=1");
  }

  return <main className="client-portal">
    <header className="client-portal-header"><Link href={"/"+locale} aria-label="KRAM home"><KramLogo className="client-portal-logo"/></Link><nav aria-label="Client navigation"><Link href={"/"+locale+"/client"}>{t.back}</Link><Link href={"/"+locale+"/client/financial-reports"}>{t.finances}</Link><ClientSignOut locale={locale} label={locale==="fr"?"Se déconnecter":locale==="pt"?"Terminar sessão":"Sign out"}/></nav></header>
    <div className="client-portal-main">
      <Link className="client-form-back" href={"/"+locale+"/client"}><ArrowLeft size={15}/>{t.back}</Link>
      <section className="client-portal-welcome"><div><p className="eyebrow"><span className="eyebrow-line"/>{t.eyebrow}</p><h1>{t.title}</h1><p className="client-portal-lead">{t.intro}</p></div><div className="client-portal-welcome-mark"><Settings2 size={31} strokeWidth={1.25}/><span>KRAM</span></div></section>
      <section className="client-portal-panel max-w-2xl">
        <div className="client-portal-panel-heading"><div><p className="eyebrow">01 / PREFERENCES</p><h2>{t.currency}</h2></div><Settings2 size={20}/></div>
        {query.saved==="1" && <p role="status" className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"><CheckCircle2 size={17}/>{t.saved}</p>}
        {query.error==="1" && <p role="alert" className="mb-4 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800">{t.failed}</p>}
        <form action={saveCurrency} className="space-y-4">
          <label htmlFor="currency" className="block text-sm font-semibold text-zinc-800">{t.currency}</label>
          <select id="currency" name="currency" defaultValue={current} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100">
            {t.currencies.map(([code,label])=><option key={code} value={code}>{label}</option>)}
            {!t.currencies.some(([code])=>code===current) && <option value={current}>{current}</option>}
          </select>
          <p className="text-sm leading-6 text-zinc-500">{t.privacy}</p>
          <button type="submit" className="button button-orange">{t.save}</button>
        </form>
      </section>
    </div>
    <footer className="client-portal-footer"><span>© KRAM</span><span>{t.eyebrow}</span><Link href={"/"+locale}>{locale==="fr"?"Accueil KRAM":locale==="pt"?"Página inicial KRAM":"KRAM home"}</Link></footer>
  </main>;
}
