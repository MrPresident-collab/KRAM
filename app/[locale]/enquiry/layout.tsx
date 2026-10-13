import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n";
import { publicPageMetadata } from "@/lib/public-seo";

const metadataCopy = {
  en: {
    title: "Send an Enquiry",
    description: "Tell KRAM about your property or project and the oversight or coordination support you need.",
  },
  fr: {
    title: "Envoyer une demande",
    description: "Présentez votre bien ou votre projet à KRAM et précisez le suivi ou la coordination dont vous avez besoin.",
  },
  pt: {
    title: "Enviar um pedido",
    description: "Conte à KRAM sobre o seu imóvel ou projeto e indique o acompanhamento ou apoio de coordenação de que precisa.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fr";
  return publicPageMetadata(locale, "enquiry", `${metadataCopy[locale].title} | KRAM`, metadataCopy[locale].description);
}

export default function EnquiryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
