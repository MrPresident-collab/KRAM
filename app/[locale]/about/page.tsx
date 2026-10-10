import Link from "next/link";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n";
import { KramBrand } from "@/components/brand/kram-brand";
import { footerLabels, publicFooter } from "@/lib/public-footer";

const copy = {
  en: {
    nav: { home: "Home", about: "About", services: "Services", login: "Login", start: "Get started" },
    metaTitle: "About KRAM — A more considered approach to asset care",
    metaDescription: "Learn about KRAM's approach to asset oversight: clear information, practical coordination and accountable follow-through.",
    heroEyebrow: "About KRAM",
    heroTitle: "Care should not depend on being there in person.",
    heroBody: "Looking after an asset from a distance can leave too much room for uncertainty. We believe owners deserve a clearer understanding of its condition, the work it needs and the decisions being made.",
    introEyebrow: "Why we exist",
    introTitle: "Ownership should come with clarity.",
    introBody: "An asset represents more than a place or a building. It carries value, responsibility and often years of work. Yet when an owner lives elsewhere or has other demands on their time, staying informed can become difficult.",
    introAside: "The distance may be unavoidable. The uncertainty should not be.",
    approachEyebrow: "Our point of view",
    approachTitle: "Good oversight is practical, visible and accountable.",
    approachBody: "KRAM is built around a straightforward idea: asset care works better when observations are documented, work is coordinated with purpose, and communication makes the next decision easier.",
    principles: [
      { n: "01", title: "See the situation clearly", body: "Understand what has been observed, what needs attention and what remains uncertain." },
      { n: "02", title: "Make the work understandable", body: "Keep maintenance priorities, progress and recorded costs connected to the asset they concern." },
      { n: "03", title: "Follow through", body: "Keep information moving and actions visible, so responsibility does not disappear between conversations." }
    ],
    closingTitle: "A better view begins with a conversation.",
    closingBody: "Every asset and owner has different priorities. Tell us what you need to oversee, and we can start by understanding your situation.",
    cta: "Get started",
    footerLine: "Asset oversight with clarity and accountability.",
    contact: "Contact", rights: "All rights reserved."
  },
  fr: {
    nav: { home: "Accueil", about: "À propos", services: "Services", login: "Connexion", start: "Parlons de votre actif" },
    metaTitle: "À propos de KRAM — Un suivi plus attentif des actifs",
    metaDescription: "Découvrez l’approche KRAM : des informations claires, une coordination pratique et un suivi responsable.",
    heroEyebrow: "À propos de KRAM",
    heroTitle: "Le suivi ne devrait pas dépendre de votre présence sur place.",
    heroBody: "Suivre un actif à distance peut laisser trop de place à l’incertitude. Nous pensons que les propriétaires méritent une vision plus claire de son état, des travaux nécessaires et des décisions prises.",
    introEyebrow: "Notre raison d’être",
    introTitle: "Être propriétaire devrait rimer avec clarté.",
    introBody: "Un actif représente bien plus qu’un lieu ou un bâtiment. Il porte une valeur, une responsabilité et souvent des années d’efforts. Mais lorsque le propriétaire vit ailleurs ou manque de temps, rester informé peut devenir difficile.",
    introAside: "La distance est parfois inévitable. L’incertitude ne devrait pas l’être.",
    approachEyebrow: "Notre vision",
    approachTitle: "Un bon suivi est concret, visible et responsable.",
    approachBody: "KRAM repose sur une idée simple : le suivi des actifs fonctionne mieux lorsque les constats sont documentés, les interventions coordonnées avec méthode et la communication facilite les prochaines décisions.",
    principles: [
      { n: "01", title: "Comprendre la situation", body: "Savoir ce qui a été constaté, ce qui demande une attention particulière et ce qui reste incertain." },
      { n: "02", title: "Rendre les interventions compréhensibles", body: "Relier les priorités de maintenance, l’avancement et les coûts enregistrés à l’actif concerné." },
      { n: "03", title: "Assurer le suivi", body: "Faire circuler les informations et rendre les actions visibles, pour que les responsabilités restent claires." }
    ],
    closingTitle: "Une vision plus claire commence par un échange.",
    closingBody: "Chaque actif et chaque propriétaire ont des priorités différentes. Parlez-nous de vos besoins pour commencer par comprendre votre situation.",
    cta: "Parlons de votre actif",
    footerLine: "Le suivi des actifs, avec clarté et responsabilité.",
    contact: "Contact", rights: "Tous droits réservés."
  },
  pt: {
    nav: { home: "Início", about: "Sobre", services: "Serviços", login: "Entrar", start: "Vamos conversar" },
    metaTitle: "Sobre a KRAM — Uma abordagem mais cuidada aos ativos",
    metaDescription: "Conheça a abordagem da KRAM ao acompanhamento de ativos: informação clara, coordenação prática e responsabilidade.",
    heroEyebrow: "Sobre a KRAM",
    heroTitle: "Cuidar não deve depender de estar presente.",
    heroBody: "Acompanhar um ativo à distância pode gerar demasiada incerteza. Acreditamos que os proprietários merecem compreender melhor o seu estado, os trabalhos necessários e as decisões tomadas.",
    introEyebrow: "A nossa razão de existir",
    introTitle: "Ser proprietário deve significar ter clareza.",
    introBody: "Um ativo representa mais do que um lugar ou um edifício. Tem valor, responsabilidade e, muitas vezes, anos de trabalho. Mas quando o proprietário vive noutro lugar ou tem outras prioridades, manter-se informado pode ser difícil.",
    introAside: "A distância pode ser inevitável. A incerteza não deveria ser.",
    approachEyebrow: "A nossa perspetiva",
    approachTitle: "Um bom acompanhamento é prático, visível e responsável.",
    approachBody: "A KRAM parte de uma ideia simples: o acompanhamento de ativos funciona melhor quando as observações são documentadas, os trabalhos são coordenados com propósito e a comunicação facilita as decisões seguintes.",
    principles: [
      { n: "01", title: "Compreender a situação", body: "Perceber o que foi observado, o que exige atenção e o que continua por esclarecer." },
      { n: "02", title: "Tornar os trabalhos claros", body: "Manter prioridades de manutenção, progresso e custos registados ligados ao ativo em causa." },
      { n: "03", title: "Acompanhar até ao fim", body: "Manter a informação atualizada e as ações visíveis, para que as responsabilidades não se percam entre conversas." }
    ],
    closingTitle: "Uma visão mais clara começa com uma conversa.",
    closingBody: "Cada ativo e proprietário tem prioridades diferentes. Conte-nos o que precisa de acompanhar e começamos por compreender a sua situação.",
    cta: "Vamos conversar",
    footerLine: "Acompanhamento de ativos com clareza e responsabilidade.",
    contact: "Contacto", rights: "Todos os direitos reservados."
  }
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fr";
  return { title: copy[locale].metaTitle, description: copy[locale].metaDescription };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return null;
  const locale = rawLocale;
  const t = copy[locale];

  return (
    <main className="public-home about-page" id="top">
      <header className="site-header">
        <KramBrand locale={locale} href={`/${locale}`} className="brand-mark" />
        <nav className="main-nav" aria-label="Main navigation">
          <Link href={`/${locale}`}>{t.nav.home}</Link>
          <Link className="nav-active" href={`/${locale}/about`}>{t.nav.about}</Link>
          <Link href={`/${locale}/services`}>{t.nav.services}</Link>
          <Link href={`/${locale}/login`}>{t.nav.login}</Link>
        </nav>
        <div className="header-actions">
          <div className="language-switch" aria-label="Language">
            {(["en", "fr", "pt"] as const).map((language) => <Link key={language} href={`/${language}/about`} aria-current={locale === language ? "page" : undefined} className={locale === language ? "language-current" : ""}>{language.toUpperCase()}</Link>)}
          </div>
          <a className="button button-small button-orange header-cta" href="#contact">{t.nav.start}<span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-image" role="img" aria-label="A thoughtfully maintained contemporary home in natural surroundings" />
        <div className="about-hero-shade" />
        <div className="about-hero-content">
          <p className="eyebrow eyebrow-light"><span className="eyebrow-line" />{t.heroEyebrow}</p>
          <h1 id="about-title">{t.heroTitle}</h1>
          <p>{t.heroBody}</p>
          <a className="about-scroll-link" href="#why"><span>↓</span>{locale === "fr" ? "Découvrir notre approche" : locale === "pt" ? "Conheça a nossa abordagem" : "Discover our approach"}</a>
        </div>
        <span className="about-hero-index">KRAM / 02</span>
      </section>

      <section className="about-story section-shell" id="why">
        <div className="about-story-label">
          <p className="eyebrow"><span className="eyebrow-line" />{t.introEyebrow}</p>
          <span className="about-story-mark">K.</span>
        </div>
        <div className="about-story-copy">
          <h2>{t.introTitle}</h2>
          <p>{t.introBody}</p>
          <div className="about-pullquote"><span className="orange-rule" />{t.introAside}</div>
        </div>
      </section>

      <section className="about-belief">
        <div className="section-shell about-belief-inner">
          <div className="about-belief-heading">
            <p className="eyebrow"><span className="eyebrow-line" />{t.approachEyebrow}</p>
            <h2>{t.approachTitle}</h2>
          </div>
          <div className="about-belief-content">
            <p className="about-belief-lead">{t.approachBody}</p>
            <div className="about-principles">
              {t.principles.map((item) => (
                <article className="about-principle" key={item.n}>
                  <span className="about-principle-number">{item.n}</span>
                  <div><h3>{item.title}</h3><p>{item.body}</p></div>
                  <span className="about-principle-arrow" aria-hidden="true">↗</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="about-closing" id="contact">
        <div className="about-closing-copy">
          <p className="eyebrow"><span className="eyebrow-line" />KRAM</p>
          <h2>{t.closingTitle}</h2>
          <p>{t.closingBody}</p>
          <a className="button button-orange" href={`/${locale}#contact`}>{t.cta}<span aria-hidden="true">↗</span></a>
        </div>
        <div className="about-closing-image" role="img" aria-label="Natural materials and soft light in a well-kept interior" />
      </section>

      <footer className="site-footer">
        <div className="footer-brand-row">
          <div className="footer-brand-copy">
            <Link className="footer-wordmark" href={`/${locale}`} aria-label="KRAM — Kore Remote Asset Management"><span>KRAM</span><i aria-hidden="true" /></Link>
            <p className="footer-company">{footerLabels[locale].company}</p>
            <p className="footer-tagline">{footerLabels[locale].tagline}</p>
          </div>
          <div className="footer-contact"><span>{footerLabels[locale].contact}</span><Link href={`/${locale}#contact`}>{t.cta} ↗</Link></div>
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
            <div className="footer-column-links">
              {publicFooter.email ? <a href={`mailto:${publicFooter.email}`}>{footerLabels[locale].email}</a> : <span className="footer-link-pending">{footerLabels[locale].email}</span>}
              <Link href={`/${locale}/enquiry`}>{footerLabels[locale].contactUs}</Link>
              {publicFooter.whatsappNumber ? <a href={`https://wa.me/${publicFooter.whatsappNumber}`} target="_blank" rel="noreferrer">{footerLabels[locale].whatsapp}</a> : <span className="footer-link-pending">{footerLabels[locale].whatsapp}</span>}
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
          <section className="footer-column">
            <h2>{footerLabels[locale].branch}</h2>
            <p>{publicFooter.branch.address}</p>
            <p className="footer-muted-note">{footerLabels[locale].reference}: {publicFooter.branch.reference}</p>
            <p>{publicFooter.branch.city}</p>
          </section>
          {Object.values(publicFooter.socials).some(Boolean) ? <section className="footer-column">
            <h2>{footerLabels[locale].socials}</h2>
            <div className="footer-column-links">
              {publicFooter.socials.linkedin ? <a href={publicFooter.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> : <span className="footer-link-pending">LinkedIn</span>}
              {publicFooter.socials.instagram ? <a href={publicFooter.socials.instagram} target="_blank" rel="noreferrer">Instagram</a> : <span className="footer-link-pending">Instagram</span>}
              {publicFooter.socials.facebook ? <a href={publicFooter.socials.facebook} target="_blank" rel="noreferrer">Facebook</a> : <span className="footer-link-pending">Facebook</span>}
            </div>
          </section> : null}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} KRAM. {footerLabels[locale].rights}</span>
          <div className="footer-languages">{(["en", "fr", "pt"] as const).map((language) => <Link key={language} href={`/${language}`} aria-current={locale === language ? "page" : undefined}>{language.toUpperCase()}</Link>)}</div>
        </div>
      </footer>
    </main>
  );
}
