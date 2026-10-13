import Link from "next/link";
import Image from "next/image";
import { ProjectPhotoGallery } from "@/components/projects/project-photo-gallery";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n";
import { KramBrand } from "@/components/brand/kram-brand";
import { footerLabels, publicFooter } from "@/lib/public-footer";

const copy: Record<Locale, {
  nav: { home: string; about: string; services: string; projects: string; login: string; start: string };
  title: string; description: string; eyebrow: string; headline: string; hero: string;
  introEyebrow: string; introTitle: string; introBody: string;
  emptyEyebrow: string; emptyTitle: string; emptyBody: string; standardsTitle: string;
  standards: { title: string; body: string }[]; ctaTitle: string; ctaBody: string; cta: string;
}> = {
  en: {
    nav: { home: "Home", about: "About", services: "Services", projects: "Projects", login: "Client Portal", start: "Get started" },
    title: "KRAM Projects — Selected property work",
    description: "Explore selected photographs of property maintenance, renovations, installations and project oversight.",
    eyebrow: "Projects",
    headline: "Selected work, clearly presented.",
    hero: "A visual selection of property-related work, grouped by type. The photographs offer context for the kinds of work KRAM can help coordinate; scope and deliverables are agreed for each engagement.",
    introEyebrow: "Our work",
    introTitle: "A closer look at the work.",
    introBody: "Explore photographs related to property care, maintenance, installations, renovations and project oversight. Each engagement is shaped around the asset, the agreed scope and the owner’s priorities.",
    emptyEyebrow: "Selected work",
    emptyTitle: "Work carried out with care.",
    emptyBody: "Our work spans property inspections, maintenance coordination, installations and renovation oversight. Contact KRAM to discuss the needs of your property or project.",
    standardsTitle: "What this selection shows",
    standards: [
      { title: "Different types of work", body: "Examples of renovation, maintenance, installation and project-coordination tasks." },
      { title: "Visual context", body: "Photographs grouped by type to help illustrate the work involved." },
      { title: "Agreed scope", body: "The work, records and reporting for each KRAM engagement are agreed with the client individually." }
    ],
    ctaTitle: "Have a project in mind? Let’s discuss the next step.",
    ctaBody: "Tell us what you have in mind, even if it is still an idea. We’ll help define the next steps and coordinate the work toward realisation.",
    cta: "Tell us about your project"
  },
  fr: {
    nav: { home: "Accueil", about: "À propos", services: "Services", projects: "Projets", login: "Portail client", start: "Parlons de votre actif" },
    title: "Projets KRAM — Travaux immobiliers documentés",
    description: "Découvrez les projets documentés de KRAM au fur et à mesure que les travaux sont terminés et autorisés à la publication. Les services expliquent ce que nous faisons ; les projets montrent ce que nous avons fait.",
    eyebrow: "Projets",
    headline: "Une sélection de travaux, présentée clairement.",
    hero: "Une sélection visuelle de travaux liés aux biens immobiliers, classés par type. Les photographies illustrent les interventions que KRAM peut aider à coordonner ; le périmètre et les livrables sont convenus pour chaque mission.",
    introEyebrow: "Ce qui a sa place ici",
    introTitle: "Un aperçu de nos interventions.",
    introBody: "Découvrez des photographies liées à l’entretien immobilier, à la maintenance, aux installations, aux rénovations et au suivi de projets. Chaque intervention est adaptée au bien, au périmètre convenu et aux priorités du propriétaire.",
    emptyEyebrow: "Nos interventions",
    emptyTitle: "Des interventions menées avec soin.",
    emptyBody: "Nos interventions couvrent les inspections, la coordination de maintenance, les installations et le suivi de rénovations. Contactez KRAM pour discuter des besoins de votre bien ou de votre projet.",
    standardsTitle: "Ce que présente cette sélection",
    standards: [
      { title: "Différents types d’intervention", body: "Des exemples de rénovation, de maintenance, d’installation et de coordination de projets." },
      { title: "Un aperçu visuel", body: "Des photographies regroupées par type pour illustrer les interventions concernées." },
      { title: "Le résultat", body: "Ce qui a été réalisé, les points restant ouverts et les recommandations ou documents de suivi." }
    ],
    ctaTitle: "Un projet en tête ? Parlons de la prochaine étape.",
    ctaBody: "Présentez-nous votre idée, même si elle n’en est qu’au début. Nous vous aiderons à définir les prochaines étapes et à coordonner sa réalisation.",
    cta: "Parlez-nous de votre projet"
  },
  pt: {
    nav: { home: "Início", about: "Sobre", services: "Serviços", projects: "Projetos", login: "Portal do cliente", start: "Vamos conversar" },
    title: "Projetos KRAM — Trabalhos imobiliários documentados",
    description: "Conheça os projetos documentados da KRAM à medida que os trabalhos são concluídos e autorizados para publicação. Os serviços explicam o que fazemos; os projetos mostram o que fizemos.",
    eyebrow: "Projetos",
    headline: "Trabalhos selecionados, apresentados com clareza.",
    hero: "Uma seleção visual de trabalhos relacionados com imóveis, organizada por tipo. As fotografias dão contexto aos trabalhos que a KRAM pode ajudar a coordenar; o âmbito e os resultados a entregar são acordados em cada serviço.",
    introEyebrow: "O que pertence aqui",
    introTitle: "Uma visão mais próxima do nosso trabalho.",
    introBody: "Explore fotografias relacionadas com inspeções, manutenção, instalações, renovações e acompanhamento de projetos. Cada intervenção é definida de acordo com o imóvel, o âmbito acordado e as prioridades do proprietário.",
    emptyEyebrow: "O nosso trabalho",
    emptyTitle: "Trabalho acompanhado com cuidado.",
    emptyBody: "O nosso trabalho inclui inspeções imobiliárias, coordenação de manutenção, instalações e acompanhamento de renovações. Contacte a KRAM para conversar sobre as necessidades do seu imóvel ou projeto.",
    standardsTitle: "O que esta seleção apresenta",
    standards: [
      { title: "Diferentes tipos de trabalho", body: "Exemplos de renovação, manutenção, instalações e coordenação de projetos." },
      { title: "Contexto visual", body: "Fotografias agrupadas por tipo para ilustrar os trabalhos envolvidos." },
      { title: "Âmbito acordado", body: "Os trabalhos, documentos e relatórios de cada serviço da KRAM são acordados individualmente com o cliente." }
    ],
    ctaTitle: "Tem um projeto em mente? Vamos conversar sobre o próximo passo.",
    ctaBody: "Conte-nos a sua ideia, mesmo que ainda esteja no início. Vamos ajudar a definir os próximos passos e coordenar o trabalho até à sua concretização.",
    cta: "Conte-nos o seu projeto"
  }
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fr";
  return { title: copy[locale].title, description: copy[locale].description };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return null;
  const locale = rawLocale;
  const t = copy[locale];

  return (
    <main className="public-home projects-page" id="top">
      <header className="site-header">
        <KramBrand locale={locale} href={`/${locale}`} className="brand-mark" />
        <nav className="main-nav" aria-label={locale === "fr" ? "Navigation principale" : locale === "pt" ? "Navegação principal" : "Main navigation"}>
          <Link href={`/${locale}`}>{t.nav.home}</Link>
          <Link href={`/${locale}/about`}>{t.nav.about}</Link>
          <Link href={`/${locale}/services`}>{t.nav.services}</Link>
          <Link className="nav-active" href={`/${locale}/projects`}>{t.nav.projects}</Link>
          <Link href={`/${locale}/client-login`}>{t.nav.login}</Link>
        </nav>
        <div className="header-actions">
          <div className="language-switch" aria-label={locale === "fr" ? "Langue" : locale === "pt" ? "Idioma" : "Language"}>
            {(["en", "fr", "pt"] as const).map((language) => <Link key={language} href={`/${language}/projects`} aria-current={locale === language ? "page" : undefined} className={locale === language ? "language-current" : ""}>{language.toUpperCase()}</Link>)}
          </div>
          <Link className="button button-small button-orange header-cta" href={`/${locale}/enquiry`}>{t.nav.start}<span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <section className="projects-hero" aria-labelledby="projects-title">
        <div className="projects-hero-image" role="img" aria-label={locale === "fr" ? "Photographie illustrative d’une propriété contemporaine" : locale === "pt" ? "Fotografia ilustrativa de um imóvel contemporâneo" : "Illustrative photograph of a contemporary property"} />
        <div className="projects-hero-shade" />
        <div className="projects-hero-copy">
          <p className="eyebrow eyebrow-light"><span className="eyebrow-line" />{t.eyebrow}</p>
          <h1 id="projects-title">{t.headline}</h1>
          <p>{t.hero}</p>
          <span className="projects-hero-note">{locale === "fr" ? "Interventions sélectionnées. Contexte clair. Suivi pratique." : locale === "pt" ? "Trabalhos selecionados. Contexto claro. Acompanhamento prático." : "Selected work. Clear context. Practical oversight."}</span>
        </div>
        <span className="projects-hero-index">KRAM / 04</span>
      </section>

      <section className="projects-intro section-shell">
        <div>
          <p className="eyebrow"><span className="eyebrow-line" />{t.introEyebrow}</p>
          <h2>{t.introTitle}</h2>
        </div>
        <p>{t.introBody}</p>
      </section>


      <section className="projects-gallery section-shell" aria-labelledby="projects-gallery-title">
        <div className="projects-gallery-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" />{locale === "fr" ? "Travaux sélectionnés" : locale === "pt" ? "Trabalhos selecionados" : "Selected work"}</p>
            <h2 id="projects-gallery-title">{locale === "fr" ? "Un aperçu plus concret des travaux." : locale === "pt" ? "Veja de perto o trabalho." : "A closer look at the work."}</h2>
          </div>
          <p>{locale === "fr" ? "Une sélection de travaux immobiliers organisée par type de projet. Chaque série rassemble des photos liées pour présenter les travaux de manière cohérente." : locale === "pt" ? "Uma seleção de trabalhos imobiliários organizada por tipo de projeto. Cada conjunto reúne fotografias relacionadas para apresentar o trabalho de forma coerente." : "A selection of property work, organised by project type. Related photographs are grouped together to tell a clearer story."}</p>
        </div>
        <div className="projects-grid">
          {[
            { title: locale === "fr" ? "Rénovation de salle de bain" : locale === "pt" ? "Renovação de casa de banho" : "Bathroom renovation", category: locale === "fr" ? "Rénovation & finitions" : locale === "pt" ? "Renovações e acabamentos" : "Renovations & finishing", summary: locale === "fr" ? "Amélioration et finitions de salle de bain." : locale === "pt" ? "Melhorias e acabamentos de casa de banho." : "Bathroom improvement and finishing work.", cover: "/images/projects/bathroom_renovate.jpg", images: ["/images/projects/bathroom_renovate.jpg", "/images/projects/bathroom_renovate2.jpg"] },
            { title: locale === "fr" ? "Rénovation de cuisine" : locale === "pt" ? "Renovação de cozinha" : "Kitchen renovation", category: locale === "fr" ? "Rénovation & finitions" : locale === "pt" ? "Renovações e acabamentos" : "Renovations & finishing", summary: locale === "fr" ? "Photos de rénovation de cuisine réunies dans un même projet." : locale === "pt" ? "Fotografias de renovação de cozinha reunidas num projeto." : "Kitchen renovation photographs grouped as one project story.", cover: "/images/projects/kitchen_renovate3.png", images: ["/images/projects/kitchen_renovate1.png", "/images/projects/kitchen_renovate3.png", "/images/projects/kitchen_renovate4.png", "/images/projects/kitchen_renovate5.png"] },
            { title: locale === "fr" ? "Construction & peinture" : locale === "pt" ? "Construção e pintura" : "Construction & painting", category: locale === "fr" ? "Construction" : locale === "pt" ? "Construção" : "Construction", summary: locale === "fr" ? "Travaux de construction, rénovation et peinture." : locale === "pt" ? "Trabalhos de construção, renovação e pintura." : "Construction, renovation and painting-related work.", cover: "/images/projects/constructe&renovate1.png", images: ["/images/projects/constructe&renovate1.png", "/images/projects/painting_1.jpeg"] },
            { title: locale === "fr" ? "Installation d’éclairage" : locale === "pt" ? "Instalação de iluminação" : "Lighting installation", category: locale === "fr" ? "Installations techniques" : locale === "pt" ? "Instalações técnicas" : "Technical installations", summary: locale === "fr" ? "Planification et installation d’éclairage documentées." : locale === "pt" ? "Planeamento e instalação de iluminação documentados." : "Lighting planning and installation photographs in one sequence.", cover: "/images/projects/lights_install1.jpeg", images: ["/images/projects/lights_begin.jpeg", "/images/projects/lights_design.jpeg", "/images/projects/lights_install1.jpeg", "/images/projects/lights_install2.jpeg"] },
            { title: locale === "fr" ? "Plomberie & réseaux d’eau" : locale === "pt" ? "Canalização e redes de água" : "Plumbing & water systems", category: locale === "fr" ? "Maintenance technique" : locale === "pt" ? "Manutenção técnica" : "Technical maintenance", summary: locale === "fr" ? "Travaux de plomberie, conduites et équipements d’eau." : locale === "pt" ? "Trabalhos de canalização, tubagens e equipamentos de água." : "Plumbing work, pipework and water-system components.", cover: "/images/projects/plumbing_1.jpeg", images: ["/images/projects/plumbing_1.jpeg", "/images/projects/plumbing_2.jpeg", "/images/projects/plumbing_meter.jpeg"] },
            { title: locale === "fr" ? "Compteurs & installations électriques" : locale === "pt" ? "Contadores e instalações elétricas" : "Electrical meter & installations", category: locale === "fr" ? "Installations électriques" : locale === "pt" ? "Instalações elétricas" : "Electrical installations", summary: locale === "fr" ? "Équipements de comptage électrique et installations associées." : locale === "pt" ? "Equipamentos de contagem de eletricidade e instalações associadas." : "Electricity meter boxes and associated electrical installation work.", cover: "/images/projects/meterbox_mainten.jpg", images: ["/images/projects/meterbox_mainten.jpg", "/images/projects/technical-installations.jpg"] },
            { title: locale === "fr" ? "Entretien & inspections" : locale === "pt" ? "Manutenção e inspeções" : "Property care & inspections", category: locale === "fr" ? "Maintenance immobilière" : locale === "pt" ? "Manutenção imobiliária" : "Property maintenance", summary: locale === "fr" ? "Coordination de maintenance, inspections et suivi des actifs." : locale === "pt" ? "Coordenação de manutenção, inspeções e acompanhamento de imóveis." : "Maintenance coordination, routine inspection and ongoing asset care.", cover: "/images/projects/maintenance_coordination1.png", images: ["/images/projects/maintenance_coordination1.png", "/images/projects/maintenance_coordination2.png", "/images/projects/maintenance_coordination3.png", "/images/projects/maintenance_coordination4.png", "/images/projects/routine_inspection.png", "/images/projects/ongoing_asset1.png", "/images/projects/ongoing_asset2.png", "/images/projects/ongoing_asset3.png", "/images/projects/property-maintenance.jpg"] },
            { title: locale === "fr" ? "Suivi de projet" : locale === "pt" ? "Acompanhamento de projetos" : "Project oversight", category: locale === "fr" ? "Coordination & suivi" : locale === "pt" ? "Coordenação e acompanhamento" : "Coordination & oversight", summary: locale === "fr" ? "Photographies liées au suivi de chantier et à la coordination." : locale === "pt" ? "Fotografias de acompanhamento de obras e coordenação." : "Photographs associated with site oversight and project coordination.", cover: "/images/projects/project_oversight1.png", images: ["/images/projects/project_oversight1.png", "/images/projects/project_oversight2.png", "/images/projects/project_oversight3.png", "/images/projects/project_oversight4.png"] }
          ].map((project, index) => (
            <article className="project-card" key={project.title}>
              <div className="project-card-cover">
                <Image src={project.cover} alt={project.title} fill sizes="(max-width: 720px) 100vw, (max-width: 1050px) 50vw, 33vw" />
                <span className="project-card-number">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="project-card-copy">
                <p className="project-card-category">{project.category}</p>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <details className="project-card-details">
                  <summary>{locale === "fr" ? "Voir les photos" : locale === "pt" ? "Ver fotografias" : "View project photos"} <span aria-hidden="true">↗</span></summary>
                  <ProjectPhotoGallery images={project.images} title={project.title} locale={locale} />
                </details>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="projects-cta" id="contact">
        <div className="projects-cta-image" role="img" aria-label={locale === "fr" ? "Intérieur présenté à titre illustratif" : locale === "pt" ? "Interior apresentado apenas para ilustração" : "Interior shown for illustrative purposes"} />
        <div className="projects-cta-shade" />
        <div className="projects-cta-copy">
          <p className="eyebrow eyebrow-light"><span className="eyebrow-line" />KRAM</p>
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaBody}</p>
          <Link className="button button-orange" href={`/${locale}/enquiry?type=project`}>{t.cta}<span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand-row">
          <div className="footer-brand-copy">
            <Link className="footer-wordmark" href={`/${locale}`} aria-label="KRAM — Kore Remote Asset Management"><span>KRAM</span></Link>
            <p className="footer-company">{footerLabels[locale].company}</p>
            <p className="footer-tagline">{footerLabels[locale].tagline}</p>
          </div>
          <div className="footer-contact"><span>{footerLabels[locale].contact}</span><Link href={`/${locale}/enquiry`}>{t.cta} ↗</Link></div>
        </div>
        <div className="footer-columns">
          <section className="footer-column">
            <h2>{footerLabels[locale].explore}</h2>
            <nav className="footer-column-links" aria-label={footerLabels[locale].explore}>
              <Link href={`/${locale}`}>{t.nav.home}</Link>
              <Link href={`/${locale}/about`}>{t.nav.about}</Link>
              <Link href={`/${locale}/services`}>{t.nav.services}</Link>
              <Link href={`/${locale}/projects`}>{t.nav.projects}</Link>
            </nav>
          </section>
          <section className="footer-column">
            <h2>{footerLabels[locale].resources}</h2>
            <nav className="footer-column-links" aria-label={footerLabels[locale].resources}>
              <Link href={`/${locale}/enquiry`}>{footerLabels[locale].enquiry}</Link>
              <Link href={`/${locale}/client-login`}>{footerLabels[locale].portal}</Link>
              <Link href={`/${locale}/faqs`}>{footerLabels[locale].faqs}</Link>
            </nav>
          </section>
          <section className="footer-column">
            <h2>{footerLabels[locale].footprint}</h2>
            <ul className="footer-plain-list">{publicFooter.footprint.map((place) => <li key={place}>{place}</li>)}</ul>
          </section>
          <section className="footer-column">
            <h2>{footerLabels[locale].getInTouch}</h2>
            <div className="footer-contact-links">
              {publicFooter.email ? <a href={`mailto:${publicFooter.email}`}><Mail aria-hidden="true" size={14} /> <span>{footerLabels[locale].email}</span></a> : null}
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
          {(publicFooter.socials.linkedin || publicFooter.socials.instagram || publicFooter.socials.facebook) ? <section className="footer-column"><h2>{footerLabels[locale].socials}</h2><div className="footer-column-links">{publicFooter.socials.linkedin ? <a href={publicFooter.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> : null}{publicFooter.socials.instagram ? <a href={publicFooter.socials.instagram} target="_blank" rel="noreferrer">Instagram</a> : null}{publicFooter.socials.facebook ? <a href={publicFooter.socials.facebook} target="_blank" rel="noreferrer">Facebook</a> : null}</div></section> : null}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} KRAM. {footerLabels[locale].rights}</span>
          <div className="footer-languages">{(["en", "fr", "pt"] as const).map((language) => <Link key={language} href={`/${language}/projects`} aria-current={locale === language ? "page" : undefined}>{language.toUpperCase()}</Link>)}</div>
        </div>
      </footer>
    </main>
  );
}
