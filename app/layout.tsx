import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KRAM — Remote Asset Management",
  description: "Kore Remote Asset Management",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
