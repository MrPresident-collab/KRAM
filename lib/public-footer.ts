import type { Locale } from "@/lib/i18n";

/**
 * Public footer details are sourced centrally. Contact and social links stay
 * unpublished until the corresponding deployment environment variables exist.
 */
export const publicFooter = {
  email: process.env.NEXT_PUBLIC_KRAM_EMAIL?.trim() || "",
  whatsappNumber: process.env.NEXT_PUBLIC_KRAM_WHATSAPP_NUMBER?.replace(/\D/g, "") || "",
  socials: {
    linkedin: process.env.NEXT_PUBLIC_KRAM_LINKEDIN_URL?.trim() || "",
    instagram: process.env.NEXT_PUBLIC_KRAM_INSTAGRAM_URL?.trim() || "",
    facebook: process.env.NEXT_PUBLIC_KRAM_FACEBOOK_URL?.trim() || "",
  },
  footprint: [
    "Luanda, Angola",
    "Kinshasa, Democratic Republic of the Congo",
    "Cape Town, South Africa",
  ],
  branch: {
    address: "Via Expressa - Nova Era, Cacuaco",
    reference: "Officina - antes da TotalEnergies Sequele",
    city: "Luanda, Angola",
  },
};

export const footerLabels: Record<Locale, Record<string, string>> = {
  en: {
    company: "Kore Remote Asset Management",
    tagline: "Asset oversight with clarity and accountability.",
    contact: "Contact",
    start: "Get started",
    explore: "Explore",
    resources: "Client resources",
    enquiry: "Submit an Enquiry",
    portal: "Client Portal",
    footprint: "Current footprint",
    growing: "Growing internationally — not limited to these locations.",
    getInTouch: "Get in touch",
    email: "Email KRAM",
    contactUs: "Contact Us",
    whatsapp: "WhatsApp KRAM",
    socials: "Socials",
    branch: "Main Branch",
    reference: "Reference",
    rights: "All rights reserved.",
  },
  fr: {
    company: "Kore Remote Asset Management",
    tagline: "Le suivi des actifs, avec clarté et responsabilité.",
    contact: "Contact",
    start: "Parlons de votre actif",
    explore: "Explorer",
    resources: "Espace client",
    enquiry: "Envoyer une demande",
    portal: "Portail client",
    footprint: "Présence actuelle",
    growing: "Expansion internationale — ces lieux ne sont pas nos seules destinations.",
    getInTouch: "Nous contacter",
    email: "Écrire à KRAM",
    contactUs: "Nous contacter",
    whatsapp: "Contacter KRAM sur WhatsApp",
    socials: "Réseaux sociaux",
    branch: "Agence principale",
    reference: "Repère",
    rights: "Tous droits réservés.",
  },
  pt: {
    company: "Kore Remote Asset Management",
    tagline: "Acompanhamento de ativos com clareza e responsabilidade.",
    contact: "Contacto",
    start: "Vamos conversar",
    explore: "Explorar",
    resources: "Recursos do cliente",
    enquiry: "Enviar uma solicitação",
    portal: "Portal do cliente",
    footprint: "Presença atual",
    growing: "Em expansão internacional — não nos limitamos a estas localizações.",
    getInTouch: "Entre em contacto",
    email: "Enviar e-mail à KRAM",
    contactUs: "Contactar",
    whatsapp: "Contactar a KRAM pelo WhatsApp",
    socials: "Redes sociais",
    branch: "Sede principal",
    reference: "Referência",
    rights: "Todos os direitos reservados.",
  },
};
