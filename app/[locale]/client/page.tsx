import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, ArrowUpRight, FileText, MessageCircle, ShieldCheck, Building2, Clock3 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isLocale, type Locale } from "@/lib/i18n";
import { KramLogo } from "@/components/brand/kram-logo";

const words = {
  en: {
    eyebrow:"CLIENT SPACE", title:"Your assets, in view.", intro:"A clearer picture of the assets you’ve entrusted to KRAM, and the conversations and updates connected to them.",
    assets:"Your assets", conversations:"Your conversations", reports:"Published reports", view:"View all", emptyAssets:"Your assets will appear here once they have been registered to your client account.",
    emptyChats:"No conversations yet. If you need help with an asset or service, our team is here to listen.",
    emptyReports:"Published reports for your assets will appear here when they are ready.",
    chat:"Talk to KRAM", chatDesc:"Tell our team what help you need. This is a direct client-to-KRAM conversation, separate from internal operations.",
    newChat:"Start a conversation", private:"Private by design", privateDesc:"You can only access the assets, published reports and client-visible messages associated with your own account.",
    status:"Status", updated:"Last activity", back:"KRAM home", login:"Client access"
  },
  fr: {
    eyebrow:"ESPACE CLIENT", title:"Vos actifs, en toute visibilité.", intro:"Une vision plus claire des actifs confiés à KRAM, ainsi que des échanges et des informations qui s’y rapportent.",
    assets:"Vos actifs", conversations:"Vos conversations", reports:"Rapports publiés", view:"Tout voir", emptyAssets:"Vos actifs apparaîtront ici lorsqu’ils auront été enregistrés dans votre dossier client.",
    emptyChats:"Aucune conversation pour le moment. Si vous avez besoin d’aide concernant un actif ou un service, notre équipe est à votre écoute.",
    emptyReports:"Les rapports publiés concernant vos actifs apparaîtront ici dès qu’ils seront disponibles.",
    chat:"Échanger avec KRAM", chatDesc:"Expliquez à notre équipe l’aide dont vous avez besoin. Cet échange est réservé à la relation client-KRAM, séparément des opérations internes.",
    newChat:"Démarrer une conversation", private:"La confidentialité avant tout", privateDesc:"Vous accédez uniquement à vos actifs, aux rapports publiés et aux messages destinés à votre compte.",
    status:"Statut", updated:"Dernière activité", back:"Accueil KRAM", login:"Accès client"
  },
  pt: {
    eyebrow:"ÁREA DO CLIENTE", title:"Os seus ativos, com clareza.", intro:"Uma visão mais clara dos ativos confiados à KRAM e das conversas e atualizações relacionadas.",
    assets:"Os seus ativos", conversations:"As suas conversas", reports:"Relatórios publicados", view:"Ver todos", emptyAssets:"Os seus ativos aparecerão aqui quando forem registados na sua conta de cliente.",
    emptyChats:"Ainda não existem conversas. Se precisar de ajuda com um ativo ou serviço, a nossa equipa está disponível para ouvir.",
    emptyReports:"Os relatórios publicados dos seus ativos aparecerão aqui quando estiverem disponíveis.",
    chat:"Falar com a KRAM", chatDesc:"Diga à nossa equipa de que ajuda precisa. Esta conversa é exclusivamente entre o cliente e a KRAM, separada das operações internas.",
    newChat:"Iniciar conversa", private:"Privacidade desde a conceção", privateDesc:"Só pode aceder aos ativos, relatórios publicados e mensagens destinadas à sua própria conta.",
    status:"Estado", updated:"Atividade recente", back:"Página inicial KRAM", login:"Acesso de cliente"
  }
} as const;

function formatDate(value: string | null, locale: Locale) {
  if (!value) return "—";
  try { return new Intl.DateTimeFormat(locale, { dateStyle:"medium" }).format(new Date(value)); }
  catch { return "—"; }
}

export default async function ClientOverviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const route = await params;
  const locale: Locale = isLocale(route.locale) ? route.locale : "fr";
  const t = words[locale];
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/" + locale + "/client-login");

  const { data: clientId, error: clientError } = await supabase.rpc("current_kram_client_id");
  if (clientError || !clientId) redirect("/" + locale + "/client-login");

  const [assetsResult, chatsResult, reportsResult] = await Promise.all([
    supabase.from("assets").select("id,name,reference_code,type,status,city,country_code,updated_at", { count:"exact" }).eq("client_id", clientId).order("updated_at", { ascending:false }).limit(6),
    supabase.from("client_conversations").select("id,subject,status,last_message_at,created_at", { count:"exact" }).eq("client_id", clientId).order("last_message_at", { ascending:false, nullsFirst:false }).limit(5),
    supabase.from("reports").select("id,title,summary,published_at,asset_id", { count:"exact" }).eq("status","published").is("deleted_at",null).order("published_at",{ascending:false}).limit(5)
  ]);
  const assets = assetsResult.data ?? [];
  const chats = chatsResult.data ?? [];
  const reports = reportsResult.data ?? [];
  const statusLabel = (value: string) => value.replaceAll("_"," ").replace(/\b\w/g, c => c.toUpperCase());

  return <main className="client-portal">
    <header className="client-portal-header">
      <Link href={"/"+locale} aria-label="KRAM home"><KramLogo className="client-portal-logo" /></Link>
      <nav aria-label="Client navigation"><Link href={"/"+locale+"/client"} className="client-nav-active">{t.eyebrow}</Link><Link href={"/"+locale+"/client-login"}>{t.login}</Link><Link href={"/"+locale}>{t.back}</Link></nav>
    </header>
    <div className="client-portal-main">
      <section className="client-portal-welcome">
        <div><p className="eyebrow"><span className="eyebrow-line"/>{t.eyebrow}</p><h1>{t.title}</h1><p className="client-portal-lead">{t.intro}</p></div>
        <div className="client-portal-welcome-mark"><Building2 size={31} strokeWidth={1.25}/><span>KRAM</span></div>
      </section>
      <section className="client-portal-grid" aria-label="Your account summary">
        <article className="client-portal-stat"><span>{t.assets}</span><strong>{assetsResult.count ?? assets.length}</strong><small>{assets.length===1?"asset":"assets"}</small></article>
        <article className="client-portal-stat"><span>{t.conversations}</span><strong>{chatsResult.count ?? chats.length}</strong><small>{chats.filter((c:any)=>!["closed","resolved"].includes(c.status)).length} active</small></article>
        <article className="client-portal-stat"><span>{t.reports}</span><strong>{reportsResult.count ?? reports.length}</strong><small>Available to you</small></article>
      </section>
      <section className="client-portal-chat-banner">
        <div className="client-portal-chat-icon"><MessageCircle size={23}/></div>
        <div className="client-portal-chat-copy"><p className="eyebrow">{t.chat}</p><h2>{t.chatDesc}</h2></div>
        <Link className="button button-orange" href={"/"+locale+"/client/chat/new"}>{t.newChat}<ArrowRight size={16}/></Link>
      </section>
      <div className="client-portal-columns">
        <section className="client-portal-panel">
          <div className="client-portal-panel-heading"><div><p className="eyebrow">01 / KRAM</p><h2>{t.assets}</h2></div><span>{assets.length.toString().padStart(2,"0")}</span></div>
          {assets.length ? <div className="client-portal-list">{assets.map((asset:any)=><Link className="client-portal-list-row" href={"/"+locale+"/client/assets/"+asset.id} key={asset.id}><span className="client-portal-row-icon"><Building2 size={17}/></span><span className="client-portal-row-main"><strong>{asset.name}</strong><small>{[asset.city,asset.country_code,asset.reference_code].filter(Boolean).join(" · ")}</small></span><span className="client-portal-status">{statusLabel(asset.status)}</span><ArrowUpRight size={16}/></Link>)}</div> : <p className="client-portal-empty">{t.emptyAssets}</p>}
        </section>
        <section className="client-portal-panel">
          <div className="client-portal-panel-heading"><div><p className="eyebrow">02 / SUPPORT</p><h2>{t.conversations}</h2></div><MessageCircle size={20}/></div>
          {chats.length ? <div className="client-portal-list">{chats.map((chat:any)=><Link className="client-portal-list-row" href={"/"+locale+"/client/chat/"+chat.id} key={chat.id}><span className="client-portal-row-icon"><MessageCircle size={17}/></span><span className="client-portal-row-main"><strong>{chat.subject}</strong><small><Clock3 size={12}/>{formatDate(chat.last_message_at ?? chat.created_at,locale)}</small></span><span className="client-portal-status">{statusLabel(chat.status)}</span><ArrowUpRight size={16}/></Link>)}</div> : <p className="client-portal-empty">{t.emptyChats}</p>}
        </section>
      </div>
      <section className="client-portal-panel client-portal-reports">
        <div className="client-portal-panel-heading"><div><p className="eyebrow">03 / RECORDS</p><h2>{t.reports}</h2></div><FileText size={20}/></div>
        {reports.length ? <div className="client-portal-list">{reports.map((report:any)=><article className="client-portal-list-row" key={report.id}><span className="client-portal-row-icon"><FileText size={17}/></span><span className="client-portal-row-main"><strong>{report.title}</strong><small>{report.summary || formatDate(report.published_at,locale)}</small></span><span className="client-portal-status">{formatDate(report.published_at,locale)}</span></article>)}</div> : <p className="client-portal-empty">{t.emptyReports}</p>}
      </section>
      <aside className="client-portal-privacy"><ShieldCheck size={19}/><div><strong>{t.private}</strong><p>{t.privateDesc}</p></div></aside>
    </div>
    <footer className="client-portal-footer"><span>© KRAM</span><span>{t.private}</span><Link href={"/"+locale}>{t.back}</Link></footer>
  </main>;
}
