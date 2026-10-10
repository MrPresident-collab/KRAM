"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, ArrowUpRight, Check, ChevronDown, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n";
import { KramBrand } from "@/components/brand/kram-brand";
import { footerLabels, publicFooter } from "@/lib/public-footer";

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
    phone: "Phone or WhatsApp (include country code)",
    phonePlaceholder: "+244 923 456 789",
    residenceCountry: "Country of residence", residenceCity: "City of residence",
    assetStreet: "Street address, building or neighbourhood", assetCity: "Asset city", assetCountry: "Asset country",
    residence: "Where are you based?",
    asset: "About the asset",
    addAsset: "Add another asset", removeAsset: "Remove asset", assetNumber: "Asset", assetLimit: "You can add up to 20 assets.", assetRequiredHelp: "Choose at least one service for each asset.",
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
    submit: "Send enquiry", sending: "Sending…", successTitle: "Your enquiry has been received.", successBody: "Thank you. Your request has been securely recorded for KRAM’s team to review. It does not create a client account.", error: "We couldn’t submit your enquiry. Please check your details and try again.",
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
    phone: "Téléphone ou WhatsApp (avec indicatif du pays)",
    phonePlaceholder: "+244 923 456 789",
    residenceCountry: "Pays de résidence", residenceCity: "Ville de résidence",
    assetStreet: "Adresse, bâtiment ou quartier", assetCity: "Ville de l’actif", assetCountry: "Pays de l’actif",
    residence: "Où résidez-vous ?",
    asset: "À propos de l’actif",
    addAsset: "Ajouter un autre actif", removeAsset: "Supprimer l’actif", assetNumber: "Actif", assetLimit: "Vous pouvez ajouter jusqu’à 20 actifs.", assetRequiredHelp: "Choisissez au moins un service pour chaque actif.",
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
    submit: "Envoyer la demande", sending: "Envoi…", successTitle: "Votre demande a été reçue.", successBody: "Merci. Votre demande a été enregistrée de manière sécurisée pour examen par l’équipe KRAM. Aucun compte client n’a été créé.", error: "Impossible d’envoyer votre demande. Vérifiez les informations et réessayez.",
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
    phone: "Telefone ou WhatsApp (com indicativo do país)",
    phonePlaceholder: "+244 923 456 789",
    residenceCountry: "País de residência", residenceCity: "Cidade de residência",
    assetStreet: "Morada, edifício ou bairro", assetCity: "Cidade do ativo", assetCountry: "País do ativo",
    residence: "Onde reside?",
    asset: "Sobre o ativo",
    addAsset: "Adicionar outro ativo", removeAsset: "Remover ativo", assetNumber: "Ativo", assetLimit: "Pode adicionar até 20 ativos.", assetRequiredHelp: "Escolha pelo menos um serviço para cada ativo.",
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
    submit: "Enviar pedido", sending: "A enviar…", successTitle: "O seu pedido foi recebido.", successBody: "Obrigado. O pedido foi registado em segurança para análise pela equipa KRAM. Não foi criada nenhuma conta de cliente.", error: "Não foi possível enviar o pedido. Verifique os dados e tente novamente.",
    back: "Voltar ao início de sessão",
    footer: "Acompanhamento de ativos com clareza e responsabilidade.",
    contactLabel: "Contacto", rights: "Todos os direitos reservados."
  }
} as const;

export default function EnquiryPage() {
  const params = useParams<{ locale: string }>();
  const locale: Locale = isLocale(params.locale) ? params.locale : "fr";
  const t = copy[locale];
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [assets, setAssets] = useState([{ id: 1, street: "", city: "", country: "", type: "", helpNeeded: [] as string[] }]);
  const [nextAssetId, setNextAssetId] = useState(2);

  return (
    <main className="public-home enquiry-page" id="top">
      <header className="site-header">
        <KramBrand locale={locale} href={`/${locale}`} className="brand-mark" />
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

        <form className="enquiry-form" onSubmit={async (event) => {
          event.preventDefault();
          if (submitting || submitted) return;
          setSubmitting(true); setSubmitError("");
          const form = event.currentTarget;
          const data = new FormData(form);
          if (assets.some((asset) => asset.helpNeeded.length === 0)) { setSubmitError(t.assetRequiredHelp); setSubmitting(false); return; }
          const submittedAssets = assets.map((asset) => ({
            asset_type: asset.type,
            asset_location: [asset.street, asset.city, asset.country].map((part) => part.trim()).filter(Boolean).join(", "),
            help_needed: asset.helpNeeded
          }));
          const firstAsset = submittedAssets[0];
          const supabase = createClient();
          const { error } = await supabase.rpc("submit_public_client_enquiry", {
            p_full_name: String(data.get("fullName") || ""),
            p_email: String(data.get("email") || ""),
            p_phone: String(data.get("phone") || ""),
            p_residence: `${String(data.get("residenceCity") || "").trim()}, ${String(data.get("residenceCountry") || "").trim()}`,
            p_asset_location: firstAsset.asset_location,
            p_asset_type: firstAsset.asset_type,
            p_help_needed: firstAsset.help_needed,
            p_details: String(data.get("details") || ""),
            p_preferred_contact: String(data.get("preferredContact") || "email"),
            p_language: locale,
            p_assets: submittedAssets
          });
          setSubmitting(false);
          if (error) { setSubmitError(t.error); return; }
          setSubmitted(true);
          form.reset();
          setAssets([{ id: nextAssetId, street: "", city: "", country: "", type: "", helpNeeded: [] }]);
          setNextAssetId((id) => id + 1);
        }}>
          <fieldset className="enquiry-fieldset">
            <legend>{t.contact}</legend>
            <div className="enquiry-field-grid">
              <label className="enquiry-field"><span>{t.name} *</span><input name="fullName" autoComplete="name" required maxLength={160} /></label>
              <label className="enquiry-field"><span>{t.email} *</span><input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
              <label className="enquiry-field"><span>{t.phone} *</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={16} placeholder={t.phonePlaceholder} pattern="\+[1-9][0-9]{7,14}" title="Use international format: + followed by country code and 7–14 more digits, without spaces." onChange={(event) => { const digits = event.currentTarget.value.replace(/\D/g, "").slice(0, 15); event.currentTarget.value = digits ? "+" + digits : ""; }} /></label>
              <label className="enquiry-field"><span>{t.residenceCountry} *</span><input name="residenceCountry" autoComplete="country-name" required maxLength={100} /></label>
              <label className="enquiry-field"><span>{t.residenceCity} *</span><input name="residenceCity" required maxLength={100} /></label>
            </div>
          </fieldset>

          <fieldset className="enquiry-fieldset">
            <legend>{t.asset}</legend>
            <div className="enquiry-assets-list">
              {assets.map((asset, index) => (
                <section className="enquiry-asset-card" key={asset.id} aria-labelledby={`asset-heading-${asset.id}`}>
                  <div className="enquiry-asset-card-heading">
                    <h3 id={`asset-heading-${asset.id}`}>{t.assetNumber} {index + 1}</h3>
                    {assets.length > 1 && <button type="button" className="enquiry-remove-asset" onClick={() => setAssets((current) => current.filter((item) => item.id !== asset.id))}><Trash2 size={15} />{t.removeAsset}</button>}
                  </div>
                  <div className="enquiry-field-grid">
                    <label className="enquiry-field enquiry-field-full"><span>{t.assetStreet} *</span><input name={`assetStreet-${asset.id}`} autoComplete={index === 0 ? "street-address" : "off"} required maxLength={180} value={asset.street} onChange={(event) => { const value = event.currentTarget.value; setAssets((current) => current.map((item) => item.id === asset.id ? { ...item, street: value } : item)); }} /></label>
                    <label className="enquiry-field"><span>{t.assetCity} *</span><input name={`assetCity-${asset.id}`} required maxLength={100} value={asset.city} onChange={(event) => { const value = event.currentTarget.value; setAssets((current) => current.map((item) => item.id === asset.id ? { ...item, city: value } : item)); }} /></label>
                    <label className="enquiry-field"><span>{t.assetCountry} *</span><input name={`assetCountry-${asset.id}`} autoComplete="country-name" required maxLength={100} value={asset.country} onChange={(event) => { const value = event.currentTarget.value; setAssets((current) => current.map((item) => item.id === asset.id ? { ...item, country: value } : item)); }} /></label>
                    <label className="enquiry-field"><span>{t.assetType} *</span><span className="enquiry-select-wrap"><select name={`assetType-${asset.id}`} required value={asset.type} onChange={(event) => { const value = event.currentTarget.value; setAssets((current) => current.map((item) => item.id === asset.id ? { ...item, type: value } : item)); }}><option value="" disabled>{t.chooseType}</option>{t.types.map((type) => <option key={type} value={type}>{type}</option>)}</select><ChevronDown size={16} /></span></label>
                  </div>
                  <div className="enquiry-field enquiry-field-full enquiry-asset-help"><span>{t.help} *</span><div className="enquiry-options">{t.helpOptions.map((option) => <label key={option} className="enquiry-option"><input type="checkbox" name={`helpNeeded-${asset.id}`} value={option} checked={asset.helpNeeded.includes(option)} onChange={(event) => { const checked = event.currentTarget.checked; setAssets((current) => current.map((item) => item.id === asset.id ? { ...item, helpNeeded: checked ? [...item.helpNeeded, option] : item.helpNeeded.filter((value) => value !== option) } : item)); }} /><span>{option}</span></label>)}</div></div>
                </section>
              ))}
              {assets.length < 20 ? <button type="button" className="enquiry-add-asset" onClick={() => { setAssets((current) => [...current, { id: nextAssetId, street: "", city: "", country: "", type: "", helpNeeded: [] }]); setNextAssetId((id) => id + 1); }}><Plus size={17} />{t.addAsset}</button> : <p className="enquiry-asset-limit">{t.assetLimit}</p>}
            </div>
            <label className="enquiry-field enquiry-field-full enquiry-general-details"><span>{t.details}</span><textarea name="details" rows={4} maxLength={2000} placeholder={t.detailsPlaceholder} /></label>
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
            <button type="submit" className="button button-orange" disabled={submitting || submitted}>{submitting ? <><LoaderCircle size={16} className="enquiry-spinner"/>{t.sending}</> : submitted ? <><Check size={16}/>{t.successTitle}</> : <>{t.submit}<ArrowUpRight size={17}/></>}</button>
          </div>
          {submitError && <p className="enquiry-form-feedback enquiry-form-error" role="alert">{submitError}</p>}
          {submitted && <div className="enquiry-form-feedback enquiry-form-success" role="status"><Check size={18}/><div><strong>{t.successTitle}</strong><p>{t.successBody}</p></div></div>}
        </form>
      </section>

      <footer className="site-footer">
        <div className="footer-brand-row">
          <div className="footer-brand-copy">
            <Link className="footer-wordmark" href={`/${locale}`} aria-label="KRAM — Kore Remote Asset Management"><span>KRAM</span><i aria-hidden="true" /></Link>
            <p className="footer-company">{footerLabels[locale].company}</p>
            <p className="footer-tagline">{footerLabels[locale].tagline}</p>
          </div>
          <div className="footer-contact"><span>{footerLabels[locale].contact}</span><Link href={`/${locale}/services`}>{t.nav.services} ↗</Link></div>
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
