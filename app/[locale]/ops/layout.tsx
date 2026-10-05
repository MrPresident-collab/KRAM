import { redirect, notFound } from "next/navigation";
import { OpsShell } from "@/components/ops/ops-shell";
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
    supabase.from("organization_members").select("role,scope_level,country_id,branch_id").eq("user_id", userId).order("created_at", { ascending: true }).limit(1).maybeSingle()
  ]);

  let workspaceLabel = locale === "fr" ? "Vue globale" : locale === "pt" ? "Visão global" : "Global Overview";
  if (membership?.scope_level === "country" && membership.country_id) {
    const { data } = await supabase.from("countries").select("name").eq("id", membership.country_id).maybeSingle();
    if (data?.name) workspaceLabel = data.name + " Overview";
  } else if (membership?.scope_level === "branch" && membership.branch_id) {
    const { data } = await supabase.from("branches").select("name").eq("id", membership.branch_id).maybeSingle();
    if (data?.name) workspaceLabel = data.name + " Overview";
  }

  const email = typeof claims.claims.email === "string" ? claims.claims.email : "—";
  const name = profile?.full_name?.trim() || email.split("@")[0] || "KRAM User";
  const user = { name, email, role: membership?.role ?? "viewer", scope: membership?.scope_level ?? "global", jobTitle: profile?.job_title ?? null, avatarUrl: profile?.avatar_url ?? null };

  return <OpsShell locale={locale as Locale} user={user} workspaceLabel={workspaceLabel}>{children}</OpsShell>;
}
