import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { publicPageMetadata } from "@/lib/public-seo";
import { LegalDocument } from "@/components/public/legal-document";

const titles = {"en":"Privacy Policy","fr":"Politique de confidentialité","pt":"Política de Privacidade"};
const descriptions = {"en":"How KRAM handles information submitted through its website enquiries.","fr":"Comment KRAM traite les informations transmises par les demandes sur son site.","pt":"Como a KRAM trata as informações enviadas através dos pedidos no site."};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fr";
  return publicPageMetadata(locale, "privacy-policy", titles[locale], descriptions[locale]);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  return <LegalDocument locale={rawLocale} kind="privacy" />;
}
