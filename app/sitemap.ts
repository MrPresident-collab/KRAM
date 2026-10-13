import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";

const publicPaths = [
  "",
  "about",
  "services",
  "projects",
  "enquiry",
  "privacy-policy",
  "terms-of-service",
  "cookie-policy",
  "faqs",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const configuredUrl = process.env.KRAM_APP_URL?.trim();
  if (!configuredUrl) return [];

  let baseUrl: string;
  try {
    baseUrl = new URL(configuredUrl).origin;
  } catch {
    return [];
  }

  return locales.flatMap((locale) =>
    publicPaths.map((path) => {
      const route = path ? `/${locale}/${path}` : `/${locale}`;
      return {
        url: `${baseUrl}${route}`,
        alternates: {
          languages: Object.fromEntries(
            locales.map((language) => [
              language,
              `${baseUrl}${path ? `/${language}/${path}` : `/${language}`}`,
            ]),
          ),
        },
      };
    }),
  );
}
