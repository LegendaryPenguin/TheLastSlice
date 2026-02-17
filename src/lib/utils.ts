export function nowMs() {
  return Date.now();
}

export function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function isFiveDigits(tag: string) {
  return /^[0-9]{5}$/.test(tag);
}

export function cleanName(s: string) {
  return s.trim().replace(/\s+/g, " ");
}
