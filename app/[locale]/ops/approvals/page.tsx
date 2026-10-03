import { notFound } from "next/navigation";
import { ClipboardList, ClipboardCheck, FolderKanban, Wrench, ShieldCheck, Wallet, FileText, Activity } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n";
import { getModuleCopy } from "@/lib/ops-modules";
import { OpsModulePage } from "@/components/ops/module-page";

export default async function ApprovalsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <OpsModulePage locale={locale as Locale} copy={getModuleCopy(locale as Locale, "approvals")} icon={ClipboardCheck} />;
}
