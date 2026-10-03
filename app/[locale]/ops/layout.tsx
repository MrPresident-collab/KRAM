import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { OpsHeader } from "@/components/ops/header";
import { OpsSidebar } from "@/components/ops/sidebar";
import { createClient } from "@/lib/supabase/server";
import { isLocale, type Locale } from "@/lib/i18n";

export default async function OpsLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect(`/${locale}/login`);

  return <div className="min-h-screen"><OpsSidebar locale={locale as Locale} /><div className="lg:pl-64"><OpsHeader locale={locale as Locale} /><main className="mx-auto max-w-[1600px] px-5 py-7 lg:px-8">{children}</main></div></div>;
}
