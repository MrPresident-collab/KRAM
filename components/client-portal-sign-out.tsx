"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function ClientSignOut({ locale, label }: { locale: string; label: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  async function signOut() {
    if (pending) return;
    setPending(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/" + locale + "/client-login");
    router.refresh();
  }
  return <button type="button" className="client-portal-signout" onClick={signOut} disabled={pending}><LogOut size={14}/>{pending ? "…" : label}</button>;
}
