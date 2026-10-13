import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { publicPageMetadata } from "@/lib/public-seo";
import { LegalDocument } from "@/components/public/legal-document";

const titles = {"en":"Frequently Asked Questions","fr":"Questions fréquentes","pt":"Perguntas Frequentes"};
const descriptions = {"en":"Answers to common questions about KRAM's remote asset oversight services.","fr":"Réponses aux questions fréquentes sur les services de suivi d’actifs à distance de KRAM.","pt":"Respostas às perguntas frequentes sobre os serviços de acompanhamento remoto de ativos da KRAM."};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fr";
  return publicPageMetadata(locale, "faqs", titles[locale], descriptions[locale]);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  return <LegalDocument locale={rawLocale} kind="faqs" />;
}
