import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { publicPageMetadata } from "@/lib/public-seo";
import { LegalDocument } from "@/components/public/legal-document";

const titles = {"en":"Cookie Policy","fr":"Politique relative aux cookies","pt":"Política de Cookies"};
const descriptions = {"en":"Information about cookies and similar technologies on the KRAM website.","fr":"Informations sur les cookies et technologies similaires sur le site KRAM.","pt":"Informações sobre cookies e tecnologias semelhantes no site da KRAM."};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fr";
  return publicPageMetadata(locale, "cookie-policy", titles[locale], descriptions[locale]);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  return <LegalDocument locale={rawLocale} kind="cookies" />;
}
