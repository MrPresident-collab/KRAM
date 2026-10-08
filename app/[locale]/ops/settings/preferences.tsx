"use client";

import { useActionState } from "react";
import { updateDefaultCurrency, type SettingsState } from "./actions";

export function SettingsPreferences({ defaultCurrency }: { defaultCurrency: string }) {
  const [state, action, pending] = useActionState<SettingsState, FormData>(updateDefaultCurrency, { success: false, message: "" });

  return (
    <section>
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[.16em] text-[var(--kram-soft-metal)]">Preferences</p>
      <div className="grid gap-4">
        <form action={action} className="rounded-2xl border border-[var(--kram-border)] bg-white p-5">
          <p className="text-sm font-bold text-[var(--kram-deep)]">Default currency</p>
          <p className="mt-1 text-xs text-[var(--kram-metal)]">Used as the default for new financial records.</p>
          <div className="mt-4 flex gap-2">
            <select name="currency" defaultValue={defaultCurrency} className="min-w-0 flex-1 rounded-xl border border-[var(--kram-border)] bg-[var(--kram-surface)] px-3 py-2.5 text-sm text-[var(--kram-deep)]">{["USD","EUR","GBP","CDF","AOA","ZAR","NGN","RWF","KES"].map(code => <option key={code} value={code}>{code}</option>)}</select>
            <button disabled={pending} className="rounded-xl bg-[var(--kram-orange)] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">{pending ? "Saving…" : "Save"}</button>
          </div>
          {state.message && <p className={`mt-3 rounded-xl px-3 py-2.5 text-xs font-semibold ${state.success ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{state.message}</p>}
        </form>
      </div>
    </section>
  );
}
