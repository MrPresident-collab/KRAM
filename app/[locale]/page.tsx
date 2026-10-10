import Link from "next/link";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n";
import { KramLogo } from "@/components/brand/kram-logo";

type Copy = {
  nav: { home: string; about: string; services: string; login: string; start: string };
  hero: { title: string; description: string; start: string; note: string };
  intro: { eyebrow: string; title: string; body: string; aside: string };
  care: { eyebrow: string; title: string; body: string; items: { title: string; body: string }[] };
  approach: { eyebrow: string; title: string; steps: { number: string; title: string; body: string }[] };
  closing: { title: string; body: string; cta: string };
  footer: { contact: string; line: string; rights: string };
};

const content: Record<Locale, Copy> = {
  en: {
    nav: { home: "Home", about: "About", services: "Services", login: "Login", start: "Get started" },
    hero: {
      title: "Your property is an asset. We help you care for it.",
      description: "Your property deserves more than occasional attention. KRAM helps property owners at home and abroad oversee their assets through property inspections, maintenance coordination, and clear reporting—giving you better visibility, greater accountability, and confidence in how your property is cared for.",
      start: "Get started", note: "Thoughtful oversight. Clear communication. Care you can account for."
    },
    intro: {
      eyebrow: "A clearer view of what matters",
      title: "Distance should not mean uncertainty.",
      body: "An asset needs attention, informed decisions and people who follow through. When you cannot always be there in person, it helps to have a clear view of its condition, the work being done and the costs involved.",
      aside: "A more considered way to look after what you own."
    },
    care: {
      eyebrow: "Asset care, made clearer",
      title: "From condition to follow-through.",
      body: "KRAM brings the essential parts of asset oversight into a more understandable picture, so you can make decisions with context instead of guesswork.",
      items: [
        { title: "Inspections & condition", body: "Understand the current state of your asset through documented observations and practical findings." },
        { title: "Maintenance coordination", body: "Keep required work organised, with clear context around priorities, progress and next steps." },
        { title: "Reporting & cost visibility", body: "See what has been observed, what has been done and what costs have been recorded." }
      ]
    },
    approach: {
      eyebrow: "A practical approach",
      title: "Know what is happening. Know what comes next.",
      steps: [
        { number: "01", title: "Understand your asset", body: "We start with your asset, your priorities and the level of oversight you need." },
        { number: "02", title: "Coordinate the care", body: "Inspections and maintenance needs are organised around clear priorities and documented work." },
        { number: "03", title: "Keep you informed", body: "Receive clearer reporting so decisions are based on what is known, not what is assumed." }
      ]
    },
    closing: {
      title: "Your asset deserves considered care.",
      body: "Tell us what you need to oversee. We can start with a conversation about your asset and priorities.",
      cta: "Get started"
    },
    footer: { contact: "Contact", line: "Asset oversight with clarity and accountability.", rights: "All rights reserved." }
  },
  fr: {
    nav: { home: "Accueil", about: "À propos", services: "Services", login: "Connexion", start: "Parlons de votre actif" },
    hero: {
      title: "Votre propriété est un actif. Nous vous aidons à en prendre soin.",
      description: "Votre propriété mérite plus qu’une attention occasionnelle. KRAM aide les propriétaires, sur place ou à l’étranger, à suivre leurs actifs grâce aux inspections, à la coordination de la maintenance et à des rapports clairs — pour une meilleure visibilité, davantage de responsabilité et plus de sérénité.",
      start: "Parlons de votre actif", note: "Un suivi attentif. Une communication claire. Des actions traçables."
    },
    intro: {
      eyebrow: "Une vision plus claire de l’essentiel",
      title: "La distance ne devrait pas créer d’incertitude.",
      body: "Un actif demande de l’attention, des décisions éclairées et un suivi réel. Lorsque vous ne pouvez pas être présent, il est essentiel de comprendre son état, les travaux en cours et les coûts engagés.",
      aside: "Une approche plus réfléchie pour prendre soin de ce que vous possédez."
    },
    care: {
      eyebrow: "Le suivi des actifs, en toute clarté",
      title: "De l’état constaté aux actions suivies.",
      body: "KRAM rassemble les éléments essentiels du suivi de vos actifs dans une vision compréhensible, afin de vous aider à décider avec des informations concrètes.",
      items: [
        { title: "Inspections et état", body: "Comprenez l’état de votre actif grâce à des observations documentées et des constats pratiques." },
        { title: "Coordination de la maintenance", body: "Organisez les interventions nécessaires avec une vision claire des priorités, de l’avancement et des prochaines étapes." },
        { title: "Rapports et visibilité des coûts", body: "Consultez les constats, les travaux réalisés et les coûts enregistrés." }
      ]
    },
    approach: {
      eyebrow: "Une méthode concrète",
      title: "Savoir ce qui se passe. Comprendre la suite.",
      steps: [
        { number: "01", title: "Comprendre votre actif", body: "Nous commençons par votre actif, vos priorités et le niveau de suivi dont vous avez besoin." },
        { number: "02", title: "Coordonner le suivi", body: "Les inspections et besoins de maintenance sont organisés selon des priorités claires et des interventions documentées." },
        { number: "03", title: "Vous tenir informé", body: "Des rapports plus clairs vous permettent de décider à partir de faits, et non de suppositions." }
      ]
    },
    closing: {
      title: "Votre actif mérite un suivi attentif.",
      body: "Parlez-nous de vos besoins. Commençons par échanger sur votre actif et vos priorités.",
      cta: "Parlons de votre actif"
    },
    footer: { contact: "Contact", line: "Le suivi des actifs, avec clarté et responsabilité.", rights: "Tous droits réservés." }
  },
  pt: {
    nav: { home: "Início", about: "Sobre", services: "Serviços", login: "Entrar", start: "Vamos conversar" },
    hero: {
      title: "O seu imóvel é um ativo. Ajudamos a cuidar dele.",
      description: "O seu imóvel merece mais do que atenção ocasional. A KRAM ajuda proprietários, em casa ou no estrangeiro, a acompanhar os seus ativos através de inspeções, coordenação de manutenção e relatórios claros — proporcionando maior visibilidade, responsabilidade e confiança no acompanhamento.",
      start: "Vamos conversar", note: "Acompanhamento atento. Comunicação clara. Ações documentadas."
    },
    intro: {
      eyebrow: "Uma visão mais clara do que importa",
      title: "A distância não deve significar incerteza.",
      body: "Um ativo precisa de atenção, decisões informadas e pessoas que acompanhem o trabalho até ao fim. Quando não pode estar presente, é importante perceber o seu estado, os trabalhos em curso e os custos envolvidos.",
      aside: "Uma forma mais cuidada de acompanhar aquilo que é seu."
    },
    care: {
      eyebrow: "Acompanhamento de ativos com clareza",
      title: "Do estado observado ao trabalho acompanhado.",
      body: "A KRAM reúne os elementos essenciais do acompanhamento de ativos numa visão clara, para que possa decidir com contexto e não com suposições.",
      items: [
        { title: "Inspeções e estado", body: "Compreenda o estado atual do seu ativo através de observações documentadas e constatações práticas." },
        { title: "Coordenação da manutenção", body: "Organize os trabalhos necessários com clareza sobre prioridades, progresso e próximos passos." },
        { title: "Relatórios e visibilidade de custos", body: "Consulte o que foi observado, o que foi realizado e os custos registados." }
      ]
    },
    approach: {
      eyebrow: "Uma abordagem prática",
      title: "Saiba o que está a acontecer. Saiba o que vem a seguir.",
      steps: [
        { number: "01", title: "Compreender o seu ativo", body: "Começamos pelo seu ativo, pelas suas prioridades e pelo nível de acompanhamento de que precisa." },
        { number: "02", title: "Coordenar os cuidados", body: "As inspeções e necessidades de manutenção são organizadas com prioridades claras e trabalhos documentados." },
        { number: "03", title: "Manter a informação clara", body: "Relatórios claros ajudam a tomar decisões com base no que se sabe, não no que se presume." }
      ]
    },
    closing: {
      title: "O seu ativo merece acompanhamento atento.",
      body: "Conte-nos o que precisa de acompanhar. Podemos começar por conversar sobre o seu ativo e as suas prioridades.",
      cta: "Vamos conversar"
    },
    footer: { contact: "Contacto", line: "Acompanhamento de ativos com clareza e responsabilidade.", rights: "Todos os direitos reservados." }
  }
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "fr";
  const titles = {
    fr: "KRAM — Le suivi de vos actifs en toute clarté",
    en: "KRAM — Clear, accountable asset oversight",
    pt: "KRAM — Acompanhamento de ativos com clareza"
  };
  return { title: titles[locale], description: content[locale].hero.description };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return null;
  const locale = rawLocale;
  const t = content[locale];

  return (
    <main className="public-home" id="top">
      <header className="site-header">
        <Link href={`/${locale}`} className="brand-mark" aria-label="KRAM home">
          <KramLogo className="site-logo" />
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link className="nav-active" href={`/${locale}`}>{t.nav.home}</Link>
          <Link href={`/${locale}/about`}>{t.nav.about}</Link>
          <Link href={`/${locale}/services`}>{t.nav.services}</Link>
          <Link href={`/${locale}/login`}>{t.nav.login}</Link>
        </nav>
        <div className="header-actions">
          <div className="language-switch" aria-label="Language">
            {(["en", "fr", "pt"] as const).map((language) => (
              <Link key={language} href={`/${language}`} aria-current={locale === language ? "page" : undefined} className={locale === language ? "language-current" : ""}>{language.toUpperCase()}</Link>
            ))}
          </div>
          <a className="button button-small button-orange header-cta" href={`/${locale}/enquiry`}>{t.nav.start}<span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-image" role="img" aria-label="Contemporary, carefully maintained residence surrounded by mature trees" />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow eyebrow-light"><span className="eyebrow-line" />{t.hero.note}</p>
          <h1 id="hero-title">{t.hero.title}</h1>
          <p className="hero-description">{t.hero.description}</p>
          <a className="button button-orange" href={`/${locale}/enquiry`}>{t.hero.start}<span aria-hidden="true">↗</span></a>
          <div className="hero-footnote"><span className="hero-footnote-dot" />{locale === "fr" ? "Une approche centrée sur votre actif" : locale === "pt" ? "Uma abordagem centrada no seu ativo" : "A considered approach to your asset"}</div>
        </div>
        <div className="hero-index" aria-hidden="true"><span>01</span><i /><span>03</span></div>
      </section>

      <section className="intro-section section-shell">
        <div className="intro-heading">
          <p className="eyebrow"><span className="eyebrow-line" />{t.intro.eyebrow}</p>
          <h2>{t.intro.title}</h2>
        </div>
        <div className="intro-copy">
          <p>{t.intro.body}</p>
          <div className="intro-aside"><span className="orange-rule" />{t.intro.aside}</div>
        </div>
      </section>

      <section className="care-section">
        <div className="section-shell care-layout">
          <div className="care-intro">
            <p className="eyebrow"><span className="eyebrow-line" />{t.care.eyebrow}</p>
            <h2>{t.care.title}</h2>
            <p className="section-description">{t.care.body}</p>
            <Link className="text-link" href={`/${locale}/services`}>{t.nav.services}<span aria-hidden="true">↗</span></Link>
          </div>
          <div className="care-list">
            {t.care.items.map((item, index) => (
              <article className="care-item" key={item.title}>
                <span className="care-number">0{index + 1}</span>
                <div><h3>{item.title}</h3><p>{item.body}</p></div>
                <span className="care-arrow" aria-hidden="true">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="approach-section section-shell">
        <div className="approach-top">
          <p className="eyebrow"><span className="eyebrow-line" />{t.approach.eyebrow}</p>
          <h2>{t.approach.title}</h2>
        </div>
        <div className="steps-grid">
          {t.approach.steps.map((step) => (
            <article className="step-item" key={step.number}>
              <span className="step-number">{step.number}</span>
              <div className="step-rule" />
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="closing-section" id="contact">
        <div className="closing-image" role="img" aria-label="Warm natural light across a quiet, well-kept interior" />
        <div className="closing-overlay" />
        <div className="closing-content">
          <p className="eyebrow eyebrow-light"><span className="eyebrow-line" />KRAM</p>
          <h2>{t.closing.title}</h2>
          <p>{t.closing.body}</p>
          <a className="button button-orange" href="#top">{t.closing.cta}<span aria-hidden="true">↑</span></a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-top">
          <Link href={`/${locale}`} className="brand-mark brand-mark-footer" aria-label="KRAM home">
            <KramLogo className="site-logo site-logo-footer" />
          </Link>
          <p>{t.footer.line}</p>
          <div className="footer-contact"><span>{t.footer.contact}</span><a href={`/${locale}/enquiry`}>{t.nav.start} ↗</a></div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} KRAM. {t.footer.rights}</span>
          <div className="footer-links">
            <Link href={`/${locale}`}>{t.nav.home}</Link>
            <Link href={`/${locale}/about`}>{t.nav.about}</Link>
            <Link href={`/${locale}/services`}>{t.nav.services}</Link>
            <Link href={`/${locale}/login`}>{t.nav.login}</Link>
          </div>
          <div className="footer-languages">{(["en", "fr", "pt"] as const).map((language) => <Link key={language} href={`/${language}`}>{language.toUpperCase()}</Link>)}</div>
        </div>
      </footer>
    </main>
  );
}
