import Link from "next/link";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n";
import { KramBrand } from "@/components/brand/kram-brand";
import { footerLabels, publicFooter } from "@/lib/public-footer";

const copy = {
  en: {
    nav: { home: "Home", about: "About", services: "Services", login: "Login", start: "Get started" },
    title: "KRAM Services — Asset oversight, maintenance and reporting",
    description: "Explore KRAM's asset oversight services, from inspections and maintenance coordination to project follow-up and clear reporting.",
    eyebrow: "Services",
    headline: "Your asset deserves more than someone checking in.",
    hero: "From understanding its condition to coordinating the work that keeps it cared for, KRAM helps make asset oversight clearer, more organised and easier to account for.",
    cta: "Tell us what you need",
    note: "A considered approach. Clear communication. Work that can be followed through.",
    introEyebrow: "What we help with",
    introTitle: "The right attention, at the right time.",
    introBody: "Every asset has its own condition, history and priorities. We help owners build a clearer picture, coordinate practical next steps and keep the information around that work together.",
    services: [
      { n: "01", title: "Asset inspections", tag: "Understand the condition", body: "Arrange on-site checks and record what is observed, what needs attention and where further assessment may be needed. Clear observations help owners make more informed decisions.", detail: "Condition notes · Findings · Supporting records" },
      { n: "02", title: "Maintenance coordination", tag: "Move from issue to action", body: "Help organise maintenance needs, coordinate with relevant local service professionals and keep track of progress. The aim is to reduce uncertainty between identifying a need and understanding what happened next.", detail: "Work coordination · Progress follow-up · Closure records" },
      { n: "03", title: "Project oversight", tag: "Keep work in view", body: "For larger repairs, improvements or ongoing projects, help keep key updates, records and outstanding actions visible so owners can follow progress from a distance.", detail: "Milestone updates · Open actions · Project records" },
      { n: "04", title: "Expense and cost visibility", tag: "Know what the work involves", body: "Keep recorded costs connected to the relevant asset and work, with supporting information where available. Clear records help owners review spending and understand what a cost relates to.", detail: "Expense records · Supporting evidence · Review trail" },
      { n: "05", title: "Reporting and documentation", tag: "Decisions with context", body: "Bring observations, work updates, documents and recorded costs into a clearer account of what has been reported and what has been done, helping owners stay informed without being on site.", detail: "Status updates · Documents · Activity history" }
    ],
    trustEyebrow: "How we work",
    trustTitle: "A process you can follow—not a promise you have to take on faith.",
    trustBody: "Good oversight depends on useful information and clear follow-through. Our approach is designed to keep the steps visible, from the first observation to the recorded outcome.",
    stages: [
      { n: "01", title: "Understand", body: "We start with your asset, your concerns and what you need visibility over." },
      { n: "02", title: "Coordinate", body: "Relevant checks and work are organised around the need, with communication as things progress." },
      { n: "03", title: "Document", body: "Findings, updates and available records are brought together so you can review what happened and what may need attention next." }
    ],
    fitEyebrow: "Designed around your situation",
    fitTitle: "Not every asset needs the same kind of attention.",
    fitBody: "You may need a condition check, help coordinating a repair, oversight of a project or a more consistent way to stay informed. Start with the situation; we can discuss the appropriate scope from there.",
    fitPoints: ["An asset you cannot visit regularly", "A maintenance issue that needs local coordination", "Work in progress that you want to follow", "Clearer records of reported work and costs"],
    finalTitle: "Tell us what you need to keep an eye on.",
    finalBody: "Share a little about your asset and the support you are looking for. We can start with a conversation about your priorities and the right next step.",
    finalCta: "Tell us what you need",
    footerLine: "Asset oversight with clarity and accountability.",
    contact: "Contact", rights: "All rights reserved."
  },
  fr: {
    nav: { home: "Accueil", about: "À propos", services: "Services", login: "Connexion", start: "Parlons de votre actif" },
    title: "Services KRAM — Suivi, maintenance et rapports sur vos actifs",
    description: "Découvrez les services KRAM : inspections, coordination de maintenance, suivi de projets et rapports clairs.",
    eyebrow: "Services",
    headline: "Votre actif mérite mieux qu’une simple visite de contrôle.",
    hero: "De l’évaluation de son état à la coordination des interventions nécessaires, KRAM aide à rendre le suivi des actifs plus clair, mieux organisé et plus facile à vérifier.",
    cta: "Parlez-nous de vos besoins",
    note: "Une approche réfléchie. Une communication claire. Un suivi concret.",
    introEyebrow: "Notre accompagnement",
    introTitle: "La bonne attention, au bon moment.",
    introBody: "Chaque actif a son état, son historique et ses priorités. Nous aidons les propriétaires à mieux comprendre la situation, à coordonner les prochaines étapes et à rassembler les informations liées aux interventions.",
    services: [
      { n: "01", title: "Inspections des actifs", tag: "Comprendre l’état", body: "Organiser des visites sur place et consigner les observations, les points nécessitant une attention et les éléments qui peuvent demander une évaluation complémentaire. Des constats clairs facilitent les décisions.", detail: "Constats d’état · Observations · Pièces justificatives" },
      { n: "02", title: "Coordination de maintenance", tag: "Passer du constat à l’action", body: "Aider à organiser les besoins de maintenance, à coordonner les professionnels locaux concernés et à suivre l’avancement. L’objectif est de réduire l’incertitude entre l’identification d’un besoin et la compréhension de la suite donnée.", detail: "Coordination · Suivi d’avancement · Compte rendu de clôture" },
      { n: "03", title: "Suivi de projets", tag: "Garder une vision des travaux", body: "Pour les réparations importantes, améliorations ou projets en cours, aider à rendre visibles les mises à jour, les documents et les actions en attente afin que les propriétaires puissent suivre l’avancement à distance.", detail: "Étapes clés · Actions ouvertes · Dossiers de projet" },
      { n: "04", title: "Visibilité des dépenses", tag: "Comprendre les coûts", body: "Relier les coûts enregistrés à l’actif et aux travaux concernés, avec les justificatifs disponibles. Des dossiers clairs aident les propriétaires à examiner les dépenses et à comprendre à quoi elles correspondent.", detail: "Dépenses enregistrées · Justificatifs · Historique de suivi" },
      { n: "05", title: "Rapports et documentation", tag: "Décider avec le bon contexte", body: "Rassembler les observations, mises à jour, documents et coûts enregistrés pour clarifier ce qui a été signalé et réalisé, afin de tenir les propriétaires informés sans présence sur place.", detail: "Mises à jour · Documents · Historique d’activité" }
    ],
    trustEyebrow: "Notre méthode",
    trustTitle: "Un processus que vous pouvez suivre, pas une promesse à croire sur parole.",
    trustBody: "Un bon suivi repose sur des informations utiles et des actions menées jusqu’au bout. Notre approche vise à rendre les étapes visibles, du premier constat au résultat consigné.",
    stages: [
      { n: "01", title: "Comprendre", body: "Nous commençons par votre actif, vos préoccupations et les éléments que vous souhaitez suivre." },
      { n: "02", title: "Coordonner", body: "Les contrôles et interventions adaptés sont organisés selon le besoin, avec une communication au fil de l’avancement." },
      { n: "03", title: "Documenter", body: "Les constats, mises à jour et pièces disponibles sont rassemblés pour vous permettre d’examiner les actions réalisées et les prochaines attentions éventuelles." }
    ],
    fitEyebrow: "Selon votre situation",
    fitTitle: "Chaque actif n’a pas besoin du même niveau d’attention.",
    fitBody: "Vous pouvez avoir besoin d’un état des lieux, d’aide pour coordonner une réparation, d’un suivi de projet ou d’un moyen plus régulier de rester informé. Partons de votre situation pour définir le périmètre adapté.",
    fitPoints: ["Un actif que vous ne pouvez pas visiter régulièrement", "Une maintenance nécessitant une coordination locale", "Des travaux en cours que vous souhaitez suivre", "Des dossiers plus clairs sur les interventions et les coûts"],
    finalTitle: "Parlez-nous de ce que vous souhaitez suivre.",
    finalBody: "Présentez-nous brièvement votre actif et l’accompagnement recherché. Nous pourrons commencer par échanger sur vos priorités et la prochaine étape adaptée.",
    finalCta: "Parlez-nous de vos besoins",
    footerLine: "Le suivi des actifs, avec clarté et responsabilité.",
    contact: "Contact", rights: "Tous droits réservés."
  },
  pt: {
    nav: { home: "Início", about: "Sobre", services: "Serviços", login: "Entrar", start: "Vamos conversar" },
    title: "Serviços KRAM — Acompanhamento, manutenção e relatórios de ativos",
    description: "Conheça os serviços da KRAM: inspeções, coordenação de manutenção, acompanhamento de projetos e relatórios claros.",
    eyebrow: "Serviços",
    headline: "O seu ativo merece mais do que uma visita ocasional.",
    hero: "Desde compreender o seu estado até coordenar os trabalhos necessários, a KRAM ajuda a tornar o acompanhamento de ativos mais claro, organizado e fácil de verificar.",
    cta: "Diga-nos do que precisa",
    note: "Uma abordagem ponderada. Comunicação clara. Acompanhamento responsável.",
    introEyebrow: "Como podemos ajudar",
    introTitle: "A atenção certa, no momento certo.",
    introBody: "Cada ativo tem o seu estado, histórico e prioridades. Ajudamos os proprietários a compreender melhor a situação, coordenar os próximos passos e reunir a informação relacionada com os trabalhos.",
    services: [
      { n: "01", title: "Inspeções de ativos", tag: "Compreender o estado", body: "Organizar verificações no local e registar o que foi observado, o que exige atenção e o que poderá precisar de uma avaliação adicional. Observações claras ajudam a tomar decisões mais informadas.", detail: "Notas sobre o estado · Constatações · Registos de apoio" },
      { n: "02", title: "Coordenação de manutenção", tag: "Passar do problema à ação", body: "Ajudar a organizar necessidades de manutenção, coordenar os profissionais locais relevantes e acompanhar o progresso. O objetivo é reduzir a incerteza entre identificar uma necessidade e saber o que aconteceu a seguir.", detail: "Coordenação de trabalhos · Acompanhamento · Registo de conclusão" },
      { n: "03", title: "Acompanhamento de projetos", tag: "Manter os trabalhos visíveis", body: "Em reparações maiores, melhorias ou projetos em curso, ajudar a manter atualizações, documentos e ações pendentes visíveis para que os proprietários acompanhem o progresso à distância.", detail: "Etapas principais · Ações pendentes · Registos do projeto" },
      { n: "04", title: "Visibilidade de despesas", tag: "Compreender os custos", body: "Manter os custos registados associados ao ativo e aos trabalhos correspondentes, com informação de suporte quando disponível. Registos claros ajudam a rever despesas e perceber a que se referem.", detail: "Registos de despesas · Comprovativos · Histórico de revisão" },
      { n: "05", title: "Relatórios e documentação", tag: "Decidir com contexto", body: "Reunir observações, atualizações de trabalho, documentos e custos registados para clarificar o que foi comunicado e realizado, mantendo os proprietários informados sem precisarem de estar no local.", detail: "Atualizações de estado · Documentos · Histórico de atividade" }
    ],
    trustEyebrow: "Como trabalhamos",
    trustTitle: "Um processo que pode acompanhar — não apenas uma promessa em que tem de acreditar.",
    trustBody: "Um bom acompanhamento depende de informação útil e de dar seguimento às ações. A nossa abordagem procura tornar cada etapa visível, desde a primeira observação até ao resultado registado.",
    stages: [
      { n: "01", title: "Compreender", body: "Começamos pelo seu ativo, pelas suas preocupações e pelo que precisa de acompanhar." },
      { n: "02", title: "Coordenar", body: "As verificações e os trabalhos relevantes são organizados de acordo com a necessidade, com comunicação durante o progresso." },
      { n: "03", title: "Documentar", body: "As constatações, atualizações e informações disponíveis são reunidas para que possa rever o que aconteceu e o que poderá precisar de atenção." }
    ],
    fitEyebrow: "À medida da sua situação",
    fitTitle: "Nem todos os ativos precisam do mesmo tipo de atenção.",
    fitBody: "Pode precisar de uma verificação do estado, apoio a coordenar uma reparação, acompanhamento de um projeto ou uma forma mais consistente de se manter informado. Começamos pela situação e conversamos sobre o âmbito adequado.",
    fitPoints: ["Um ativo que não consegue visitar regularmente", "Uma necessidade de manutenção que exige coordenação local", "Trabalhos em curso que pretende acompanhar", "Registos mais claros dos trabalhos e respetivos custos"],
    finalTitle: "Diga-nos o que precisa de acompanhar.",
    finalBody: "Partilhe algumas informações sobre o seu ativo e o apoio que procura. Podemos começar por conversar sobre as suas prioridades e o próximo passo adequado.",
    finalCta: "Diga-nos do que precisa",
    footerLine: "Acompanhamento de ativos com clareza e responsabilidade.",
    contact: "Contacto", rights: "Todos os direitos reservados."
  }
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fr";
  return { title: copy[locale].title, description: copy[locale].description };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return null;
  const locale = rawLocale;
  const t = copy[locale];

  return (
    <main className="public-home services-page" id="top">
      <header className="site-header">
        <KramBrand locale={locale} href={`/${locale}`} className="brand-mark" />
        <nav className="main-nav" aria-label="Main navigation">
          <Link href={`/${locale}`}>{t.nav.home}</Link>
          <Link href={`/${locale}/about`}>{t.nav.about}</Link>
          <Link className="nav-active" href={`/${locale}/services`}>{t.nav.services}</Link>
          <Link href={`/${locale}/login`}>{t.nav.login}</Link>
        </nav>
        <div className="header-actions">
          <div className="language-switch" aria-label="Language">
            {(["en", "fr", "pt"] as const).map((language) => <Link key={language} href={`/${language}/services`} aria-current={locale === language ? "page" : undefined} className={locale === language ? "language-current" : ""}>{language.toUpperCase()}</Link>)}
          </div>
          <a className="button button-small button-orange header-cta" href={`/${locale}/enquiry`}>{t.nav.start}<span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <section className="services-hero" aria-labelledby="services-title">
        <div className="services-hero-image" role="img" aria-label="A carefully maintained contemporary residence surrounded by greenery" />
        <div className="services-hero-shade" />
        <div className="services-hero-content">
          <p className="eyebrow eyebrow-light"><span className="eyebrow-line" />{t.eyebrow}</p>
          <h1 id="services-title">{t.headline}</h1>
          <p>{t.hero}</p>
          <a className="button button-orange" href={`/${locale}/enquiry`}>{t.cta}<span aria-hidden="true">↗</span></a>
          <div className="services-hero-note"><span className="hero-footnote-dot" />{t.note}</div>
        </div>
        <span className="services-hero-index">KRAM / 03</span>
      </section>

      <section className="services-intro section-shell">
        <div>
          <p className="eyebrow"><span className="eyebrow-line" />{t.introEyebrow}</p>
          <h2>{t.introTitle}</h2>
        </div>
        <p>{t.introBody}</p>
      </section>

      <section className="services-list-section" aria-label={t.introEyebrow}>
        <div className="services-list">
          {t.services.map((service, index) => (
            <article className="service-row" key={service.n}>
              <div className="service-row-number">{service.n}</div>
              <div className="service-row-main">
                <p className="service-row-tag">{service.tag}</p>
                <h2>{service.title}</h2>
                <p className="service-row-body">{service.body}</p>
                <p className="service-row-detail">{service.detail}</p>
              </div>
              <div className={`service-row-visual service-row-visual-${index + 1}`} aria-hidden="true"><span>{service.n}</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="services-process">
        <div className="section-shell services-process-inner">
          <div className="services-process-heading">
            <p className="eyebrow"><span className="eyebrow-line" />{t.trustEyebrow}</p>
            <h2>{t.trustTitle}</h2>
            <p>{t.trustBody}</p>
          </div>
          <div className="services-process-steps">
            {t.stages.map((stage) => <article className="services-process-step" key={stage.n}><span>{stage.n}</span><div className="services-process-rule" /><h3>{stage.title}</h3><p>{stage.body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="services-fit section-shell">
        <div className="services-fit-copy">
          <p className="eyebrow"><span className="eyebrow-line" />{t.fitEyebrow}</p>
          <h2>{t.fitTitle}</h2>
          <p>{t.fitBody}</p>
        </div>
        <ul className="services-fit-list">{t.fitPoints.map((point) => <li key={point}><span aria-hidden="true">↗</span>{point}</li>)}</ul>
      </section>

      <section className="services-closing" id="contact">
        <div className="services-closing-image" aria-hidden="true" />
        <div className="services-closing-shade" />
        <div className="services-closing-content">
          <p className="eyebrow eyebrow-light"><span className="eyebrow-line" />KRAM</p>
          <h2>{t.finalTitle}</h2>
          <p>{t.finalBody}</p>
          <a className="button button-orange" href={`/${locale}/enquiry`}>{t.finalCta}<span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand-row">
          <div className="footer-brand-copy">
            <Link className="footer-wordmark" href={`/${locale}`} aria-label="KRAM — Kore Remote Asset Management"><span>KRAM</span></Link>
            <p className="footer-company">{footerLabels[locale].company}</p>
            <p className="footer-tagline">{footerLabels[locale].tagline}</p>
          </div>
          <div className="footer-contact"><span>{footerLabels[locale].contact}</span><Link href={`/${locale}/enquiry`}>{t.finalCta} ↗</Link></div>
        </div>
        <div className="footer-columns">
          <section className="footer-column">
            <h2>{footerLabels[locale].explore}</h2>
            <nav className="footer-column-links" aria-label={footerLabels[locale].explore}>
            <Link href={`/${locale}`}>{t.nav.home}</Link>
            <Link href={`/${locale}/about`}>{t.nav.about}</Link>
            <Link href={`/${locale}/services`}>{t.nav.services}</Link>
            <Link href={`/${locale}/login`}>{t.nav.login}</Link>
            </nav>
          </section>
          <section className="footer-column">
            <h2>{footerLabels[locale].resources}</h2>
            <nav className="footer-column-links" aria-label={footerLabels[locale].resources}>
              <Link href={`/${locale}/enquiry`}>{footerLabels[locale].enquiry}</Link>
              <Link href={`/${locale}/login`}>{footerLabels[locale].portal}</Link>
              <Link href={`/${locale}/faqs`}>{footerLabels[locale].faqs}</Link>
            </nav>
          </section>
          <section className="footer-column">
            <h2>{footerLabels[locale].footprint}</h2>
            <ul className="footer-plain-list">
              {publicFooter.footprint.map((place) => <li key={place}>{place}</li>)}
            </ul>
            <p className="footer-muted-note">{footerLabels[locale].growing}</p>
          </section>
          <section className="footer-column">
            <h2>{footerLabels[locale].getInTouch}</h2>
            <div className="footer-contact-links">
              {publicFooter.email ? <a href={`mailto:${publicFooter.email}`}><Mail aria-hidden="true" size={14} /> <span>{footerLabels[locale].email}</span></a> : <span className="footer-link-pending"><Mail aria-hidden="true" size={14} /> <span>{footerLabels[locale].email}</span></span>}
              {publicFooter.phoneNumber ? <a href={`tel:+${publicFooter.phoneNumber}`}><Phone aria-hidden="true" size={14} /> <span>{footerLabels[locale].phone}</span></a> : <span className="footer-link-pending"><Phone aria-hidden="true" size={14} /> <span>{footerLabels[locale].phone}</span></span>}
              {publicFooter.whatsappNumber ? <a href={`https://wa.me/${publicFooter.whatsappNumber}`} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" size={14} /> <span>{footerLabels[locale].whatsapp}</span></a> : <span className="footer-link-pending"><MessageCircle aria-hidden="true" size={14} /> <span>{footerLabels[locale].whatsapp}</span></span>}
            </div>
          </section>
          <section className="footer-column">
            <h2>{footerLabels[locale].legal}</h2>
            <div className="footer-column-links">
              <Link href={`/${locale}/privacy-policy`}>{footerLabels[locale].privacy}</Link>
              <Link href={`/${locale}/terms-of-service`}>{footerLabels[locale].terms}</Link>
              <Link href={`/${locale}/cookie-policy`}>{footerLabels[locale].cookies}</Link>
            </div>
          </section>
          <section className="footer-address" aria-label={footerLabels[locale].branch}>
            <div className="footer-address-heading"><MapPin aria-hidden="true" size={15} /><span>{footerLabels[locale].branch}</span></div>
            <a className="footer-address-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${publicFooter.branch.address}, ${publicFooter.branch.city}`)}`} target="_blank" rel="noreferrer">
              <span>{publicFooter.branch.address}</span>
              <span className="footer-muted-note">{footerLabels[locale].reference}: {publicFooter.branch.reference}</span>
              <span>{publicFooter.branch.city}</span>
            </a>
          </section>
          <section className="footer-column">
            <h2>{footerLabels[locale].socials}</h2>
            <div className="footer-column-links">
              {publicFooter.socials.linkedin ? <a href={publicFooter.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> : <span className="footer-link-pending">LinkedIn</span>}
              {publicFooter.socials.instagram ? <a href={publicFooter.socials.instagram} target="_blank" rel="noreferrer">Instagram</a> : <span className="footer-link-pending">Instagram</span>}
              {publicFooter.socials.facebook ? <a href={publicFooter.socials.facebook} target="_blank" rel="noreferrer">Facebook</a> : <span className="footer-link-pending">Facebook</span>}
            </div>
          </section>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} KRAM. {footerLabels[locale].rights}</span>
          <div className="footer-languages">{(["en", "fr", "pt"] as const).map((language) => <Link key={language} href={`/${language}`} aria-current={locale === language ? "page" : undefined}>{language.toUpperCase()}</Link>)}</div>
        </div>
      </footer>
    </main>
  );
}
