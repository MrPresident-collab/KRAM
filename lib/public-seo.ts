import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";

function getSiteUrl(): URL | null {
  const configuredUrl = process.env.KRAM_APP_URL?.trim();
  if (!configuredUrl) return null;
  try {
    const url = new URL(configuredUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return new URL(url.origin);
  } catch {
    return null;
  }
}

export function publicPageMetadata(
  locale: Locale,
  path: string,
  title: string,
  description: string,
): Metadata {
  const siteUrl = getSiteUrl();
  const route = `/${locale}${path ? `/${path.replace(/^\/+/, "")}` : ""}`;
  const canonical = siteUrl ? new URL(route, siteUrl).toString() : undefined;
  const languageAlternates = siteUrl
    ? Object.fromEntries(
        (["fr", "en", "pt"] as const).map((language) => [
          language,
          new URL(`/${language}${path ? `/${path.replace(/^\/+/, "")}` : ""}`, siteUrl).toString(),
        ]),
      )
    : undefined;

  return {
    title,
    description,
    keywords: locale === "fr"
      ? ["gestion immobilière à distance", "suivi immobilier", "maintenance immobilière", "inspection de biens", "KRAM"]
      : locale === "pt"
        ? ["gestão remota de imóveis", "acompanhamento de ativos", "manutenção imobiliária", "inspeção de imóveis", "KRAM"]
        : ["remote property management", "asset oversight", "property maintenance", "property inspections", "KRAM"],
    ...(canonical
      ? {
          alternates: {
            canonical,
            languages: { ...languageAlternates, "x-default": new URL(`/fr${path ? `/${path.replace(/^\/+/, "")}` : ""}`, siteUrl).toString() },
          },
          openGraph: {
            type: "website",
            url: canonical,
            title,
            description,
            siteName: "KRAM",
            locale: locale === "fr" ? "fr_FR" : locale === "pt" ? "pt_PT" : "en_US",
          },
          twitter: { card: "summary_large_image", title, description },
        }
      : {}),
  };
}
