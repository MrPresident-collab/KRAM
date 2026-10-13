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

  if (new URL(baseUrl).protocol !== "https:" && new URL(baseUrl).protocol !== "http:") return [];

  return locales.flatMap((locale) =>
    publicPaths.map((path) => {
      const route = path ? `/${locale}/${path}` : `/${locale}`;
      return {
        url: `${baseUrl}${route}`,
        changeFrequency: path === "" ? "weekly" as const : "monthly" as const,
        priority: path === "" ? 1 : path === "services" || path === "enquiry" ? 0.8 : path === "about" || path === "projects" ? 0.7 : path === "faqs" ? 0.5 : 0.3,
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales.map((language) => [
                language,
                `${baseUrl}${path ? `/${language}/${path}` : `/${language}`}`,
              ]),
            ),
            "x-default": `${baseUrl}${path ? `/fr/${path}` : "/fr"}`,
          },,
        },
      };
    }),
  );
}
