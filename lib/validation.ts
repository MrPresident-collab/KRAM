export const INTERNATIONAL_PHONE_REGEX = /^\+[1-9]\d{7,14}$/;
export function isInternationalPhone(value: string) { return INTERNATIONAL_PHONE_REGEX.test(value.trim()); }
export function normalizeInternationalPhone(value: string) { return value.trim().replace(/[\s().-]/g, ""); }
