export function nowMs() {
  return Date.now();
}

export function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function isFiveDigits(tag: string) {
  return /^[0-9]{5}$/.test(tag);
}

/** Validate Privy user ID (used as identifier instead of 5-digit tag) */
export function isValidPrivyUserId(id: string): boolean {
  return typeof id === "string" && id.trim().length >= 5;
}

export function cleanName(s: string) {
  return s.trim().replace(/\s+/g, " ");
}
