import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { publicPageMetadata } from "@/lib/public-seo";
import { LegalDocument } from "@/components/public/legal-document";

const titles = {"en":"Terms of Use","fr":"Conditions d’utilisation","pt":"Termos de Utilização"};
const descriptions = {"en":"Terms for using the public KRAM website and submitting an enquiry.","fr":"Conditions d’utilisation du site public de KRAM et d’envoi d’une demande.","pt":"Condições de utilização do site público da KRAM e de envio de pedidos."};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fr";
  return publicPageMetadata(locale, "terms-of-service", titles[locale], descriptions[locale]);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  return <LegalDocument locale={rawLocale} kind="terms" />;
}
