import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const configuredUrl = process.env.KRAM_APP_URL?.trim();
  let sitemapUrl: string | undefined;

  if (configuredUrl) {
    try {
      const parsedUrl = new URL(configuredUrl);
      if (parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:") {
        sitemapUrl = new URL("/sitemap.xml", parsedUrl.origin).toString();
      }
    } catch {
      sitemapUrl = undefined;
    }
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Let crawlers read page-level noindex metadata; robots.txt is not access control.
      disallow: ["/api/ops/"],
    },
    ...(sitemapUrl ? { sitemap: sitemapUrl } : {}),
  };
}
