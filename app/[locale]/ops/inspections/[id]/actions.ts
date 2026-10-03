"use server";

import { updateInspectionItem as updateItem } from "../actions";
import type { InspectionActionState } from "../actions";

export type { InspectionActionState } from "../actions";

export async function updateInspectionItem(_previous: InspectionActionState, formData: FormData): Promise<InspectionActionState> {
  return updateItem(formData);
}
