"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProvider, type ProviderActionState } from "../../actions";

type Provider = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  coverage: string | null;
  notes: string | null;
  branch_id: string | null;
};

type Branch = {
  id: string;
  name: string;
  city: string | null;
};

export function ProviderEditForm({
  provider,
  services,
  serviceCatalog,
  branches,
  locale,
}: {
  provider: Provider;
  services: string[];
  serviceCatalog: string[];
  branches: Branch[];
  locale: string;
}) {
  const [state, action, pending] = useActionState<ProviderActionState, FormData>(
    updateProvider,
    { success: false, message: "" },
  );
  const router = useRouter();
  useEffect(() => {
    if (state.success) router.push("/" + locale + "/ops/providers/" + provider.id);
  }, [locale, provider.id, router, state.success]);

  return (
    <form
      action={action}
      className="space-y-5"
    >
      <input type="hidden" name="providerId" value={provider.id} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold">
          Name
          <input
            name="name"
            required
            defaultValue={provider.name}
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2.5"
          />
        </label>
        <label className="text-sm font-semibold">
          Phone
          <input
            name="phone"
            defaultValue={provider.phone || ""}
            placeholder="+244..."
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2.5"
          />
        </label>
        <label className="text-sm font-semibold">
          Email
          <input
            name="email"
            type="email"
            defaultValue={provider.email || ""}
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2.5"
          />
        </label>
        <label className="text-sm font-semibold">
          Coverage
          <input
            name="coverage"
            defaultValue={provider.coverage || ""}
            className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2.5"
          />
        </label>
      </div>

      <label className="block text-sm font-semibold">
        Branch
        <select
          name="branchId"
          defaultValue={provider.branch_id || ""}
          className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2.5"
        >
          <option value="">No branch</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
              {branch.city ? " · " + branch.city : ""}
            </option>
          ))}
        </select>
      </label>

      <fieldset>
        <legend className="text-sm font-semibold">Specialties</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {serviceCatalog.map((service) => (
            <label
              key={service}
              className="flex items-center gap-3 rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"
            >
              <input
                type="checkbox"
                name="specialties"
                value={service}
                defaultChecked={services.includes(service)}
              />
              {service}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block text-sm font-semibold">
        Notes
        <textarea
          name="notes"
          defaultValue={provider.notes || ""}
          rows={5}
          className="mt-2 w-full rounded-xl border border-zinc-200 px-3 py-2.5"
        />
      </label>

      {state.message && (
        <p className={state.success ? "text-sm text-emerald-700" : "text-sm text-red-600"}>
          {state.message}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-bold"
        >
          Cancel
        </button>
        <button
          disabled={pending}
          className="rounded-xl bg-[var(--kram-charcoal)] px-4 py-2.5 text-sm font-bold text-white"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
