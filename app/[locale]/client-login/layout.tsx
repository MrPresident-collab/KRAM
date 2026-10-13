import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n";

const metadataCopy = {
  en: { title: "Client Portal", description: "Sign in to access the KRAM client portal." },
  fr: { title: "Portail client", description: "Connectez-vous pour accéder au portail client KRAM." },
  pt: { title: "Portal do cliente", description: "Inicie sessão para aceder ao portal de clientes da KRAM." },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "fr";
  return { ...metadataCopy[locale], title: `${metadataCopy[locale].title} | KRAM`, robots: { index: false, follow: true } };
}

export default function ClientPortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
