"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

type ActionState = { success: boolean; message: string };
type MoveAction = (previous: ActionState, formData: FormData) => Promise<ActionState>;

export function MoveToBinButton({ action, id, fieldName, listHref, label = "Move to Bin" }: { action: MoveAction; id: string; fieldName: string; listHref: string; label?: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, { success: false, message: "" });
  const router = useRouter();
  useEffect(() => { if (state.success) { router.push(listHref); router.refresh(); } }, [state.success, listHref, router]);
  return <div className="space-y-2">
    <form action={formAction} onSubmit={(event) => { if (!window.confirm("Move this record to the Bin? It can be restored later.")) event.preventDefault(); }}>
      <input type="hidden" name={fieldName} value={id} />
      <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50 disabled:opacity-60">
        {pending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}{pending ? "Moving..." : label}
      </button>
    </form>
    {state.message && !state.success && <p className="text-xs text-red-600">{state.message}</p>}
  </div>;
}
