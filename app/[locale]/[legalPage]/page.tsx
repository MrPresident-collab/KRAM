import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { footerLabels, publicFooter } from "@/lib/public-footer";
import { legalContent, legalNavigation, type LegalDocument } from "@/lib/legal-content";

const routeMap: Record<string, LegalDocument> = {
  "privacy-policy": "privacy-policy",
  "terms-of-service": "terms-of-service",
  "cookie-policy": "cookie-policy",
  faqs: "faqs",
};

export function generateStaticParams() {
  return Object.keys(routeMap).map((legalPage) => ({ legalPage }));
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ locale: string; legalPage: string }> }>): Promise<Metadata> {
  const { locale: localeParam, legalPage } = await params;
  if (!isLocale(localeParam) || !routeMap[legalPage]) return {};
  const document = legalContent[localeParam][routeMap[legalPage]];
  return {
    title: `${document.title} | KRAM`,
    description: document.intro,
  };
}

export default async function LegalPage({
  params,
}: Readonly<{ params: Promise<{ locale: string; legalPage: string }> }>) {
  const { locale: localeParam, legalPage } = await params;
  if (!isLocale(localeParam) || !routeMap[legalPage]) notFound();

  const locale: Locale = localeParam;
  const document = legalContent[locale][routeMap[legalPage]];
  const nav = legalNavigation[locale];
  const pathFor = (slug: string) => `/${locale}/${slug}`;

  return (
    <main className="public-home legal-page" id="top">
      <header className="site-header">
        <Link className="legal-header-wordmark" href={`/${locale}`} aria-label="KRAM home">KRAM</Link>
        <nav className="main-nav" aria-label={nav.home}>
          <Link href={`/${locale}`}>{nav.home}</Link>
          <Link href={`/${locale}/about`}>{nav.about}</Link>
          <Link href={`/${locale}/services`}>{nav.services}</Link>
          <Link href={`/${locale}/login`}>{nav.portal}</Link>
        </nav>
        <div className="language-switch" aria-label={nav.language}>
          {locales.map((language) => (
            <Link key={language} href={`/${language}/${legalPage}`} aria-current={locale === language ? "page" : undefined} className={locale === language ? "language-current" : ""}>
              {language.toUpperCase()}
            </Link>
          ))}
        </div>
      </header>

      <section className="legal-hero">
        <div className="legal-hero-inner">
          <p className="eyebrow"><span className="eyebrow-line" />KRAM / {document.updated}</p>
          <h1>{document.title}</h1>
          <p>{document.intro}</p>
          <span className="legal-updated">{locale === "fr" ? "Dernière mise à jour" : locale === "pt" ? "Última atualização" : "Last updated"}: {document.updated}</span>
        </div>
      </section>

      <div className="legal-layout section-shell">
        <aside className="legal-toc">
          <p className="eyebrow">{locale === "fr" ? "SUR CETTE PAGE" : locale === "pt" ? "NESTA PÁGINA" : "ON THIS PAGE"}</p>
          <nav aria-label={document.title}>
            {document.sections.map((section, index) => (
              <a key={section.heading} href={`#section-${index + 1}`}>{section.heading}</a>
            ))}
          </nav>
          <div className="legal-toc-help">
            <p>{locale === "fr" ? "Une question ?" : locale === "pt" ? "Tem uma dúvida?" : "Have a question?"}</p>
            <Link href={pathFor("enquiry")}>{nav.contact} ↗</Link>
          </div>
        </aside>
        <article className="legal-content">
          {document.sections.map((section, index) => (
            <section key={section.heading} id={`section-${index + 1}`} className="legal-section">
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
              {section.bullets ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
            </section>
          ))}
          <div className="legal-document-links">
            <h2>{locale === "fr" ? "Documents associés" : locale === "pt" ? "Documentos relacionados" : "Related documents"}</h2>
            <Link href={pathFor("privacy-policy")}>{nav.privacy} ↗</Link>
            <Link href={pathFor("terms-of-service")}>{nav.terms} ↗</Link>
            <Link href={pathFor("cookie-policy")}>{nav.cookies} ↗</Link>
            <Link href={pathFor("faqs")}>{nav.faqs} ↗</Link>
          </div>
        </article>
      </div>

      <footer className="site-footer legal-site-footer">
        <div className="footer-brand-row">
          <div className="footer-brand-copy">
            <Link className="footer-wordmark" href={`/${locale}`} aria-label="KRAM — Kore Remote Asset Management"><span>KRAM</span><i aria-hidden="true" /></Link>
            <p className="footer-company">{footerLabels[locale].company}</p>
            <p className="footer-tagline">{footerLabels[locale].tagline}</p>
          </div>
          <div className="footer-contact"><span>{footerLabels[locale].contact}</span><Link href={pathFor("enquiry")}>{footerLabels[locale].start} ↗</Link></div>
        </div>
        <div className="footer-columns">
          <section className="footer-column"><h2>{footerLabels[locale].explore}</h2><nav className="footer-column-links" aria-label={footerLabels[locale].explore}>
            <Link href={`/${locale}`}>{nav.home}</Link><Link href={`/${locale}/about`}>{nav.about}</Link><Link href={`/${locale}/services`}>{nav.services}</Link><Link href={`/${locale}/login`}>{nav.portal}</Link>
          </nav></section>
          <section className="footer-column"><h2>{footerLabels[locale].resources}</h2><nav className="footer-column-links" aria-label={footerLabels[locale].resources}>
            <Link href={pathFor("enquiry")}>{nav.enquiry}</Link><Link href={pathFor("login")}>{nav.portal}</Link><Link href={pathFor("faqs")}>{nav.faqs}</Link>
          </nav></section>
          <section className="footer-column"><h2>{footerLabels[locale].footprint}</h2><ul className="footer-plain-list">{publicFooter.footprint.map((place) => <li key={place}>{place}</li>)}</ul><p className="footer-muted-note">{footerLabels[locale].growing}</p></section>
          <section className="footer-column"><h2>{footerLabels[locale].getInTouch}</h2><div className="footer-column-links">
              {publicFooter.email ? <a href={`mailto:${publicFooter.email}`}>{footerLabels[locale].email}</a> : <span className="footer-link-pending">{footerLabels[locale].email}</span>}
              <Link href={pathFor("enquiry")}>{footerLabels[locale].contactUs}</Link>
              {publicFooter.whatsappNumber ? <a href={`https://wa.me/${publicFooter.whatsappNumber}`} target="_blank" rel="noreferrer">{footerLabels[locale].whatsapp}</a> : <span className="footer-link-pending">{footerLabels[locale].whatsapp}</span>}
            </div></section>
          <section className="footer-column"><h2>{footerLabels[locale].legal}</h2><div className="footer-column-links">
            <Link href={pathFor("privacy-policy")}>{nav.privacy}</Link><Link href={pathFor("terms-of-service")}>{nav.terms}</Link><Link href={pathFor("cookie-policy")}>{nav.cookies}</Link>
          </div></section>
          <section className="footer-column"><h2>{footerLabels[locale].branch}</h2><p>{publicFooter.branch.address}</p><p className="footer-muted-note">{footerLabels[locale].reference}: {publicFooter.branch.reference}</p><p>{publicFooter.branch.city}</p></section>
          {Object.values(publicFooter.socials).some(Boolean) ? <section className="footer-column">
            <h2>{footerLabels[locale].socials}</h2>
            <div className="footer-column-links">
              {publicFooter.socials.linkedin ? <a href={publicFooter.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> : <span className="footer-link-pending">LinkedIn</span>}
              {publicFooter.socials.instagram ? <a href={publicFooter.socials.instagram} target="_blank" rel="noreferrer">Instagram</a> : <span className="footer-link-pending">Instagram</span>}
              {publicFooter.socials.facebook ? <a href={publicFooter.socials.facebook} target="_blank" rel="noreferrer">Facebook</a> : <span className="footer-link-pending">Facebook</span>}
            </div>
          </section> : null}
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} KRAM. {footerLabels[locale].rights}</span><div className="footer-languages">{locales.map((language) => <Link key={language} href={`/${language}/${legalPage}`} aria-current={locale === language ? "page" : undefined}>{language.toUpperCase()}</Link>)}</div></div>
      </footer>
    </main>
  );
}
