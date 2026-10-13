import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n";

const metadataCopy = {
  en: { title: "Client Options", description: "Choose the right way to contact KRAM as a new or existing client." },
  fr: { title: "Options client", description: "Choisissez le parcours adapté pour contacter KRAM en tant que nouveau client ou client existant." },
  pt: { title: "Opções para clientes", description: "Escolha a opção adequada para contactar a KRAM como novo cliente ou cliente existente." },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "fr";
  return { ...metadataCopy[locale], robots: { index: false, follow: true } };
}

export default function ClientOptionsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
