import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KRAM — Remote Asset Management",
  description: "KRAM helps property owners oversee assets remotely through inspections, maintenance coordination, project oversight and clear reporting.",
  icons: { icon: "/brand/kram-mark.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
