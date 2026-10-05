import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n";
import { LocaleDocumentLanguage } from "@/components/i18n/locale-document-language";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children, params
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <><LocaleDocumentLanguage locale={locale} />{children}</>;
}
