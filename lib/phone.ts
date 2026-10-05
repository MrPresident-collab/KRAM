export const E164_PHONE_PATTERN = /^\+[1-9][0-9]{7,14}$/;

export function normalizePhone(value: string | null | undefined) {
  if (!value) return null;
  const compact = value.trim().replace(/[\s().-]/g, "");
  return compact || null;
}

export function isValidPhone(value: string | null | undefined) {
  if (!value) return false;
  return E164_PHONE_PATTERN.test(normalizePhone(value) ?? "");
}

export const phoneInputProps = {
  type: "tel",
  inputMode: "tel" as const,
  autoComplete: "tel",
  placeholder: "+243 81 234 5678",
  pattern: "\\+[1-9][0-9]{7,14}",
};
