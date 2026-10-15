import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

import { redirect, notFound } from "next/navigation";
import { OpsShell } from "@/components/ops/ops-shell";
import { createClient } from "@/lib/supabase/server";
import { isLocale, type Locale } from "@/lib/i18n";

function AccessBlocked({ locale, title, message }: { locale: Locale; title: string; message: string }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center px-6">
      <section className="w-full rounded-2xl border border-[var(--kram-border)] bg-[var(--kram-surface)] p-8">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--kram-orange)]">KRAM Ops</p>
        <h1 className="mt-3 text-xl font-semibold text-[var(--kram-ink)]">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--kram-metal)]">{message}</p>
        <a className="mt-6 inline-flex rounded-lg border border-[var(--kram-border)] px-4 py-2 text-sm font-semibold" href={`/${locale}/ops-login`}>
          {locale === "fr" ? "Retour à la connexion" : locale === "pt" ? "Voltar ao início de sessão" : "Return to sign in"}
        </a>
      </section>
    </main>
  );
}

export default async function OpsLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect(`/${locale}/ops-login`);

  const [{ data: profile }, { data: memberships, error: membershipError }] = await Promise.all([
    supabase.from("profiles").select("full_name,job_title,avatar_url").eq("id", userId).maybeSingle(),
    supabase
      .from("organization_members")
      .select("id,organization_id,role,scope_level,country_id,branch_id,status")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: true })
      .limit(2),
  ]);

  if (membershipError) {
    return <AccessBlocked locale={locale as Locale} title="We couldn't verify your KRAM access" message="Your access could not be verified safely. Please try again or contact the KRAM owner." />;
  }

  if (!memberships?.length) {
    return <AccessBlocked locale={locale as Locale} title="KRAM access is not configured" message="Your account has no active KRAM staff membership. Client accounts must use the client portal." />;
  }

  // Do not silently choose the oldest membership: that can apply the wrong role or scope.
  if (memberships.length > 1) {
    return <AccessBlocked locale={locale as Locale} title="Your KRAM access needs clarification" message="More than one active membership is assigned to this account. Ask the KRAM owner to resolve the assignment before using Ops." />;
  }

  const membership = memberships[0];

  // Global authority is reserved for the owner. Fail closed on invalid combinations.
  if (
    (membership.scope_level === "global" && membership.role !== "owner") ||
    (membership.role === "owner" && membership.scope_level !== "global") ||
    (membership.role === "client")
  ) {
    return <AccessBlocked locale={locale as Locale} title="Your KRAM access needs correction" message="Your active membership has a role and scope combination that is not valid for the Ops workspace. Contact the KRAM owner." />;
  }

  if (
    (membership.scope_level === "country" && !membership.country_id) ||
    (membership.scope_level === "branch" && !membership.branch_id)
  ) {
    return <AccessBlocked locale={locale as Locale} title="Your KRAM scope is incomplete" message="Your active membership is missing its required region or branch assignment. Contact the KRAM owner before continuing." />;
  }

  let workspaceLabel = locale === "fr" ? "Vue globale" : locale === "pt" ? "Visão global" : "Global Overview";
  if (membership.scope_level === "country" && membership.country_id) {
    const { data } = await supabase.from("countries").select("name").eq("id", membership.country_id).eq("organization_id", membership.organization_id).maybeSingle();
    if (data?.name) workspaceLabel = data.name + (locale === "fr" ? " — Région" : locale === "pt" ? " — Região" : " — Region");
  } else if (membership.scope_level === "branch" && membership.branch_id) {
    const { data } = await supabase.from("branches").select("name").eq("id", membership.branch_id).eq("organization_id", membership.organization_id).maybeSingle();
    if (data?.name) workspaceLabel = data.name + (locale === "fr" ? " — Agence" : locale === "pt" ? " — Filial" : " — Branch");
  }

  const email = typeof claims.claims.email === "string" ? claims.claims.email : "—";
  const name = profile?.full_name?.trim() || email.split("@")[0] || "KRAM User";
  const user = {
    name,
    email,
    role: membership.role,
    scope: membership.scope_level,
    jobTitle: profile?.job_title ?? null,
    avatarUrl: profile?.avatar_url ?? null,
  };

  return <OpsShell locale={locale as Locale} user={user} workspaceLabel={workspaceLabel}>{children}</OpsShell>;
}
