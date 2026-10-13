import type { Metadata } from "next";
import "./globals.css";

const configuredSiteUrl = process.env.KRAM_APP_URL?.trim();
const metadataBase = (() => {
  if (!configuredSiteUrl) return undefined;
  try {
    return new URL(configuredSiteUrl);
  } catch {
    return undefined;
  }
})();

const siteDescription =
  "KRAM helps property owners oversee assets remotely through inspections, maintenance coordination, project oversight and clear reporting.";

export const metadata: Metadata = {
  ...(metadataBase ? { metadataBase } : {}),
  title: "KRAM — Remote Asset Management",
  description: siteDescription,
  applicationName: "KRAM",
  openGraph: {
    type: "website",
    siteName: "KRAM",
    title: "KRAM — Remote Asset Management",
    description: siteDescription,
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "KRAM — Remote Asset Management",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: { icon: "/brand/kram-mark.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
