import { redirect, notFound } from "next/navigation";
import { OpsHeader } from "@/components/ops/header";
import { OpsSidebar } from "@/components/ops/sidebar";
import { createClient } from "@/lib/supabase/server";
import { isLocale, type Locale } from "@/lib/i18n";

export default async function OpsLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect(`/${locale}/login`);

  const [{ data: profile }, { data: membership }] = await Promise.all([
    supabase.from("profiles").select("full_name,job_title,avatar_url").eq("id", userId).maybeSingle(),
    supabase.from("organization_members").select("role,scope_level").eq("user_id", userId).order("created_at", { ascending: true }).limit(1).maybeSingle(),
  ]);

  const email = typeof claims.claims.email === "string" ? claims.claims.email : "—";
  const name = profile?.full_name?.trim() || email.split("@")[0] || "KRAM User";
  const user = { name, email, role: membership?.role ?? "viewer", scope: membership?.scope_level ?? "global", jobTitle: profile?.job_title ?? null, avatarUrl: profile?.avatar_url ?? null };

  return <div className="min-h-screen"><OpsSidebar locale={locale as Locale} /><div className="lg:pl-64"><OpsHeader locale={locale as Locale} user={user} /><main className="mx-auto max-w-[1600px] px-5 py-7 lg:px-8">{children}</main></div></div>;
}
