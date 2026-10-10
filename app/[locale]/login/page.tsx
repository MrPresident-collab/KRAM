"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, ArrowUpRight, KeyRound, MessageCircle, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n";
import { KramBrand } from "@/components/brand/kram-brand";
import { footerLabels, publicFooter } from "@/lib/public-footer";

const copy = {
  en: {
    nav: { home: "Home", about: "About", services: "Services", login: "Login" },
    eyebrow: "A clearer way to care for your assets",
    headline: "How can we help you today?",
    intro: "Whether you're considering working with KRAM or already trust us with your asset, choose the path that fits you.",
    newLabel: "01 / GET STARTED",
    newTitle: "I'm a new client",
    newBody: "Let's talk about your asset, what matters to you, and the kind of oversight or support you need.",
    newAction: "Start a conversation",
    existingLabel: "02 / ALREADY WORKING WITH US",
    existingTitle: "I'm an existing client",
    existingBody: "Looking for updates or access to your client information? We’ll help you find the right next step.",
    existingAction: "Get client support",
    reassurance: "Personal attention. Clear communication. Responsible follow-through.",
    accessTitle: "Your asset. A clearer picture.",
    accessBody: "KRAM is built around keeping you informed about the condition of your asset, the work being coordinated, and the information you need to make decisions.",
    contactTitle: "Not sure where to start?",
    contactBody: "Tell us a little about your situation. We’ll help you work out the next step.",
    contactAction: "Explore our services",
    footerLine: "Asset oversight with clarity and accountability.",
    contact: "Contact", rights: "All rights reserved."
  },
  fr: {
    nav: { home: "Accueil", about: "À propos", services: "Services", login: "Connexion" },
    eyebrow: "Une approche plus claire du suivi de vos actifs",
    headline: "Comment pouvons-nous vous aider aujourd’hui ?",
    intro: "Vous envisagez de travailler avec KRAM ou vous nous confiez déjà le suivi de votre actif ? Choisissez le parcours qui vous correspond.",
    newLabel: "01 / COMMENCER",
    newTitle: "Je suis un nouveau client",
    newBody: "Parlons de votre actif, de vos priorités et du type de suivi ou d’accompagnement dont vous avez besoin.",
    newAction: "Engager la conversation",
    existingLabel: "02 / DÉJÀ CLIENT",
    existingTitle: "Je suis déjà client",
    existingBody: "Vous cherchez des nouvelles ou l’accès à vos informations client ? Nous vous aiderons à trouver la bonne prochaine étape.",
    existingAction: "Contacter l’assistance client",
    reassurance: "Une attention personnelle. Une communication claire. Un suivi responsable.",
    accessTitle: "Votre actif. Une vision plus claire.",
    accessBody: "KRAM vise à vous tenir informé de l’état de votre actif, des interventions coordonnées et des informations utiles à vos décisions.",
    contactTitle: "Vous ne savez pas par où commencer ?",
    contactBody: "Présentez-nous brièvement votre situation. Nous vous aiderons à définir la prochaine étape.",
    contactAction: "Découvrir nos services",
    footerLine: "Le suivi des actifs, avec clarté et responsabilité.",
    contact: "Contact", rights: "Tous droits réservés."
  },
  pt: {
    nav: { home: "Início", about: "Sobre", services: "Serviços", login: "Entrar" },
    eyebrow: "Uma forma mais clara de cuidar dos seus ativos",
    headline: "Como podemos ajudar hoje?",
    intro: "Está a considerar trabalhar com a KRAM ou já confia-nos o acompanhamento do seu ativo? Escolha a opção certa para si.",
    newLabel: "01 / COMEÇAR",
    newTitle: "Sou um novo cliente",
    newBody: "Vamos conversar sobre o seu ativo, as suas prioridades e o tipo de acompanhamento ou apoio de que precisa.",
    newAction: "Iniciar uma conversa",
    existingLabel: "02 / JÁ É CLIENTE",
    existingTitle: "Sou um cliente existente",
    existingBody: "Procura atualizações ou acesso às suas informações de cliente? Ajudamos a encontrar o próximo passo adequado.",
    existingAction: "Contactar apoio ao cliente",
    reassurance: "Atenção pessoal. Comunicação clara. Acompanhamento responsável.",
    accessTitle: "O seu ativo. Uma visão mais clara.",
    accessBody: "A KRAM procura mantê-lo informado sobre o estado do seu ativo, os trabalhos coordenados e a informação necessária para tomar decisões.",
    contactTitle: "Não sabe por onde começar?",
    contactBody: "Conte-nos um pouco sobre a sua situação. Ajudamos a definir o próximo passo.",
    contactAction: "Conhecer os nossos serviços",
    footerLine: "Acompanhamento de ativos com clareza e responsabilidade.",
    contact: "Contacto", rights: "Todos os direitos reservados."
  }
} as const;

export default function ClientLoginPage() {
  const params = useParams<{ locale: string }>();
  const locale: Locale = isLocale(params.locale) ? params.locale : "fr";
  const t = copy[locale];

  return (
    <main className="public-home client-login-page" id="top">
      <header className="site-header">
        <KramBrand locale={locale} href={`/${locale}`} className="brand-mark" />
        <nav className="main-nav" aria-label="Main navigation">
          <Link href={`/${locale}`}>{t.nav.home}</Link>
          <Link href={`/${locale}/about`}>{t.nav.about}</Link>
          <Link href={`/${locale}/services`}>{t.nav.services}</Link>
          <Link className="nav-active" href={`/${locale}/login`}>{t.nav.login}</Link>
        </nav>
        <div className="header-actions">
          <div className="language-switch" aria-label="Language">
            {(["en", "fr", "pt"] as const).map((language) => <Link key={language} href={`/${language}/login`} aria-current={locale === language ? "page" : undefined} className={locale === language ? "language-current" : ""}>{language.toUpperCase()}</Link>)}
          </div>
          <a className="button button-small button-orange header-cta" href="#client-choices">{t.newAction}<span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <section className="client-login-hero">
        <div className="client-login-hero-image" aria-hidden="true" />
        <div className="client-login-hero-shade" />
        <div className="client-login-hero-content">
          <p className="eyebrow eyebrow-light"><span className="eyebrow-line" />{t.eyebrow}</p>
          <h1>{t.headline}</h1>
          <p>{t.intro}</p>
          <a className="client-login-scroll" href="#client-choices"><span aria-hidden="true">↓</span>{t.newAction}</a>
        </div>
        <span className="client-login-hero-index">KRAM / CLIENTS</span>
      </section>

      <section className="client-choice-section section-shell" id="client-choices">
        <div className="client-choice-grid">
          <article className="client-choice-card client-choice-new">
            <div className="client-choice-topline"><span>{t.newLabel}</span><MessageCircle size={19} strokeWidth={1.5} /></div>
            <div className="client-choice-card-copy">
              <h2>{t.newTitle}</h2>
              <p>{t.newBody}</p>
            </div>
            <Link className="client-choice-action" href={`/${locale}/enquiry`}><span>{t.newAction}</span><ArrowUpRight size={19} /></Link>
          </article>
          <article className="client-choice-card client-choice-existing">
            <div className="client-choice-topline"><span>{t.existingLabel}</span><KeyRound size={19} strokeWidth={1.5} /></div>
            <div className="client-choice-card-copy">
              <h2>{t.existingTitle}</h2>
              <p>{t.existingBody}</p>
            </div>
            <Link className="client-choice-action" href={`/${locale}/client-login`}><span>{t.existingAction}</span><ArrowRight size={19} /></Link>
          </article>
        </div>
        <div className="client-choice-reassurance"><ShieldCheck size={16} strokeWidth={1.6} /><span>{t.reassurance}</span></div>
      </section>

      <section className="client-access-note" id="existing-client-access">
        <div className="client-access-note-inner">
          <div className="client-access-note-mark" aria-hidden="true">K.</div>
          <div>
            <p className="eyebrow"><span className="eyebrow-line" />KRAM</p>
            <h2>{t.accessTitle}</h2>
            <p>{t.accessBody}</p>
          </div>
        </div>
      </section>

      <section className="client-login-closing" id="contact">
        <div className="client-login-closing-image" aria-hidden="true" />
        <div className="client-login-closing-shade" />
        <div className="client-login-closing-content">
          <p className="eyebrow eyebrow-light"><span className="eyebrow-line" />KRAM</p>
          <h2>{t.contactTitle}</h2>
          <p>{t.contactBody}</p>
          <Link className="button button-orange" href={`/${locale}/services`}>{t.contactAction}<ArrowUpRight size={16} /></Link>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand-row">
          <div className="footer-brand-copy">
            <Link className="footer-wordmark" href={`/${locale}`} aria-label="KRAM — Kore Remote Asset Management"><span>KRAM</span></Link>
            <p className="footer-company">{footerLabels[locale].company}</p>
            <p className="footer-tagline">{footerLabels[locale].tagline}</p>
          </div>
          <div className="footer-contact"><span>{footerLabels[locale].contact}</span><Link href={`/${locale}/services`}>{t.contactAction} ↗</Link></div>
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
