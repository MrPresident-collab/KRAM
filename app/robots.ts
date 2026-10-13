import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const configuredUrl = process.env.KRAM_APP_URL?.trim();
  let sitemapUrl: string | undefined;

  if (configuredUrl) {
    try {
      sitemapUrl = new URL("/sitemap.xml", configuredUrl).toString();
    } catch {
      sitemapUrl = undefined;
    }
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/en/client",
        "/fr/client",
        "/pt/client",
        "/en/ops",
        "/fr/ops",
        "/pt/ops",
        "/en/ops-login",
        "/fr/ops-login",
        "/pt/ops-login",
        "/en/accept-invite",
        "/fr/accept-invite",
        "/pt/accept-invite",
      ],
    },
    ...(sitemapUrl ? { sitemap: sitemapUrl } : {}),
  };
}
