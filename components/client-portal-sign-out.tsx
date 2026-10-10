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
    const { error } = await supabase.auth.signOut();
    if (error) { setPending(false); return; }
    router.replace("/" + locale + "/client-login");
    router.refresh();
  }
  return <button type="button" className="client-portal-signout" onClick={signOut} disabled={pending}><LogOut size={14}/>{pending ? "…" : label}</button>;
}
