"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, ChevronDown } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n";
import { KramLogo } from "@/components/brand/kram-logo";

const copy = {
  en: {
    nav: { home: "Home", about: "About", services: "Services", login: "Login" },
    eyebrow: "A first conversation",
    title: "Tell us what your asset needs.",
    intro: "Every situation is different. Share a little about what you need, and our team can review your enquiry and guide you through the next step.",
    step: "ENQUIRY / 01",
    contact: "Your details",
    name: "Full name",
    email: "Email address",
    phone: "Phone or WhatsApp (optional)",
    residence: "Where are you based?",
    asset: "About the asset",
    assetLocation: "Where is the asset located?",
    assetType: "Asset type",
    chooseType: "Choose an asset type",
    types: ["Residential", "Commercial", "Construction or renovation", "Retail", "Land", "Warehouse", "Hospitality", "Other"],
    help: "What would you like help with?",
    helpOptions: ["Asset inspection", "Maintenance coordination", "Project oversight", "Cost and expense visibility", "Ongoing asset oversight", "Something else"],
    details: "Tell us a little more (optional)",
    detailsPlaceholder: "What is happening, and what would you like KRAM to help you with?",
    preferred: "Preferred way to contact you",
    emailOption: "Email", phoneOption: "Phone call", whatsappOption: "WhatsApp",
    privacy: "Submitting an enquiry does not create a client account or commit you to a service. Our team will review your request and contact you about the next step.",
    submit: "Review enquiry",
    layoutNote: "Enquiry submission will be connected to KRAM’s intake workflow in the next implementation phase.",
    back: "Back to Login",
    footer: "Asset oversight with clarity and accountability.",
    contactLabel: "Contact", rights: "All rights reserved."
  },
  fr: {
    nav: { home: "Accueil", about: "À propos", services: "Services", login: "Connexion" },
    eyebrow: "Un premier échange",
    title: "Parlez-nous des besoins de votre actif.",
    intro: "Chaque situation est différente. Présentez-nous brièvement vos besoins afin que notre équipe puisse examiner votre demande et vous guider vers la prochaine étape.",
    step: "DEMANDE / 01",
    contact: "Vos coordonnées",
    name: "Nom complet",
    email: "Adresse e-mail",
    phone: "Téléphone ou WhatsApp (facultatif)",
    residence: "Où résidez-vous ?",
    asset: "À propos de l’actif",
    assetLocation: "Où se situe l’actif ?",
    assetType: "Type d’actif",
    chooseType: "Choisir un type d’actif",
    types: ["Résidentiel", "Commercial", "Construction ou rénovation", "Commerce", "Terrain", "Entrepôt", "Hôtellerie", "Autre"],
    help: "Pour quel besoin souhaitez-vous notre aide ?",
    helpOptions: ["Inspection d’actif", "Coordination de maintenance", "Suivi de projet", "Visibilité des coûts et dépenses", "Suivi continu de l’actif", "Autre besoin"],
    details: "Quelques précisions (facultatif)",
    detailsPlaceholder: "Que se passe-t-il et comment KRAM pourrait-il vous aider ?",
    preferred: "Moyen de contact préféré",
    emailOption: "E-mail", phoneOption: "Appel téléphonique", whatsappOption: "WhatsApp",
    privacy: "Envoyer une demande ne crée pas de compte client et ne vous engage pas à acheter un service. Notre équipe examinera votre demande et vous contactera pour la suite.",
    submit: "Vérifier la demande",
    layoutNote: "L’envoi de la demande sera relié au processus d’admission de KRAM lors de la prochaine phase d’implémentation.",
    back: "Retour à la connexion",
    footer: "Le suivi des actifs, avec clarté et responsabilité.",
    contactLabel: "Contact", rights: "Tous droits réservés."
  },
  pt: {
    nav: { home: "Início", about: "Sobre", services: "Serviços", login: "Entrar" },
    eyebrow: "Uma primeira conversa",
    title: "Conte-nos do que o seu ativo precisa.",
    intro: "Cada situação é diferente. Partilhe um pouco sobre o que precisa para que a nossa equipa possa analisar o pedido e orientar os próximos passos.",
    step: "PEDIDO / 01",
    contact: "Os seus dados",
    name: "Nome completo",
    email: "Endereço de e-mail",
    phone: "Telefone ou WhatsApp (opcional)",
    residence: "Onde reside?",
    asset: "Sobre o ativo",
    assetLocation: "Onde está localizado o ativo?",
    assetType: "Tipo de ativo",
    chooseType: "Escolha o tipo de ativo",
    types: ["Residencial", "Comercial", "Construção ou renovação", "Comércio", "Terreno", "Armazém", "Hotelaria", "Outro"],
    help: "Em que gostaria de receber ajuda?",
    helpOptions: ["Inspeção do ativo", "Coordenação de manutenção", "Acompanhamento de projetos", "Visibilidade de custos e despesas", "Acompanhamento contínuo do ativo", "Outro"],
    details: "Conte-nos um pouco mais (opcional)",
    detailsPlaceholder: "O que está a acontecer e como gostaria que a KRAM ajudasse?",
    preferred: "Forma preferida de contacto",
    emailOption: "E-mail", phoneOption: "Chamada telefónica", whatsappOption: "WhatsApp",
    privacy: "O envio de um pedido não cria uma conta de cliente nem o compromete com um serviço. A nossa equipa irá analisar o pedido e contactá-lo sobre os próximos passos.",
    submit: "Rever pedido",
    layoutNote: "O envio do pedido será ligado ao processo de entrada da KRAM na próxima fase de implementação.",
    back: "Voltar ao início de sessão",
    footer: "Acompanhamento de ativos com clareza e responsabilidade.",
    contactLabel: "Contacto", rights: "Todos os direitos reservados."
  }
} as const;

export default function EnquiryPage() {
  const params = useParams<{ locale: string }>();
  const locale: Locale = isLocale(params.locale) ? params.locale : "fr";
  const t = copy[locale];

  return (
    <main className="public-home enquiry-page" id="top">
      <header className="site-header">
        <Link href={`/${locale}`} className="brand-mark" aria-label="KRAM home"><KramLogo className="site-logo" /></Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href={`/${locale}`}>{t.nav.home}</Link>
          <Link href={`/${locale}/about`}>{t.nav.about}</Link>
          <Link href={`/${locale}/services`}>{t.nav.services}</Link>
          <Link href={`/${locale}/login`}>{t.nav.login}</Link>
        </nav>
        <div className="header-actions">
          <div className="language-switch" aria-label="Language">
            {(["en", "fr", "pt"] as const).map((language) => <Link key={language} href={`/${language}/enquiry`} aria-current={locale === language ? "page" : undefined} className={locale === language ? "language-current" : ""}>{language.toUpperCase()}</Link>)}
          </div>
        </div>
      </header>

      <section className="enquiry-hero">
        <div className="enquiry-hero-image" aria-hidden="true" />
        <div className="enquiry-hero-shade" />
        <div className="enquiry-hero-copy">
          <p className="eyebrow eyebrow-light"><span className="eyebrow-line" />{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p>{t.intro}</p>
          <span className="enquiry-hero-index">{t.step}</span>
        </div>
      </section>

      <section className="enquiry-layout section-shell">
        <aside className="enquiry-aside">
          <p className="eyebrow"><span className="eyebrow-line" />{t.step}</p>
          <h2>{t.contact}</h2>
          <p>{t.privacy}</p>
          <Link className="enquiry-back-link" href={`/${locale}/login`}><ArrowLeft size={16} />{t.back}</Link>
        </aside>

        <form className="enquiry-form" onSubmit={(event) => event.preventDefault()}>
          <fieldset className="enquiry-fieldset">
            <legend>{t.contact}</legend>
            <div className="enquiry-field-grid">
              <label className="enquiry-field"><span>{t.name} *</span><input name="fullName" autoComplete="name" required maxLength={160} /></label>
              <label className="enquiry-field"><span>{t.email} *</span><input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
              <label className="enquiry-field"><span>{t.phone}</span><input name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
              <label className="enquiry-field"><span>{t.residence} *</span><input name="residence" required maxLength={120} /></label>
            </div>
          </fieldset>

          <fieldset className="enquiry-fieldset">
            <legend>{t.asset}</legend>
            <div className="enquiry-field-grid">
              <label className="enquiry-field"><span>{t.assetLocation} *</span><input name="assetLocation" required maxLength={180} /></label>
              <label className="enquiry-field"><span>{t.assetType} *</span><span className="enquiry-select-wrap"><select name="assetType" required defaultValue=""><option value="" disabled>{t.chooseType}</option>{t.types.map((type) => <option key={type} value={type}>{type}</option>)}</select><ChevronDown size={16} /></span></label>
            </div>
            <div className="enquiry-field enquiry-field-full"><span>{t.help} *</span><div className="enquiry-options">{t.helpOptions.map((option) => <label key={option} className="enquiry-option"><input type="checkbox" name="helpNeeded" value={option} /><span>{option}</span></label>)}</div></div>
            <label className="enquiry-field enquiry-field-full"><span>{t.details}</span><textarea name="details" rows={4} maxLength={2000} placeholder={t.detailsPlaceholder} /></label>
          </fieldset>

          <fieldset className="enquiry-fieldset">
            <legend>{t.preferred}</legend>
            <div className="enquiry-options enquiry-contact-options">
              <label className="enquiry-option"><input type="radio" name="preferredContact" value="email" defaultChecked /><span>{t.emailOption}</span></label>
              <label className="enquiry-option"><input type="radio" name="preferredContact" value="phone" /><span>{t.phoneOption}</span></label>
              <label className="enquiry-option"><input type="radio" name="preferredContact" value="whatsapp" /><span>{t.whatsappOption}</span></label>
            </div>
          </fieldset>

          <div className="enquiry-submit-row">
            <p>{t.layoutNote}</p>
            <button type="submit" className="button button-orange" disabled>{t.submit}<ArrowUpRight size={17} /></button>
          </div>
        </form>
      </section>

      <footer className="site-footer">
        <div className="footer-top">
          <Link href={`/${locale}`} className="brand-mark brand-mark-footer" aria-label="KRAM home"><KramLogo className="site-logo site-logo-footer" /></Link>
          <p>{t.footer}</p>
          <div className="footer-contact"><span>{t.contactLabel}</span><Link href={`/${locale}/services`}>{t.nav.services} ↗</Link></div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} KRAM. {t.rights}</span>
          <div className="footer-links"><Link href={`/${locale}`}>{t.nav.home}</Link><Link href={`/${locale}/about`}>{t.nav.about}</Link><Link href={`/${locale}/services`}>{t.nav.services}</Link><Link href={`/${locale}/login`}>{t.nav.login}</Link></div>
          <div className="footer-languages">{(["en", "fr", "pt"] as const).map((language) => <Link key={language} href={`/${language}/enquiry`}>{language.toUpperCase()}</Link>)}</div>
        </div>
      </footer>
    </main>
  );
}
