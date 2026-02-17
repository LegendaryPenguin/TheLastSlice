export function nowMs() {
  return Date.now();
}

export function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function isFiveDigits(tag: string) {
  return /^[0-9]{5}$/.test(tag);
}

/** Valid EVM address (0x + 40 hex chars) */
export function isWalletAddress(addr: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}

/** Shorten address for display: 0x1234...5678 */
export function shortAddr(addr: string) {
  if (!addr || addr.length < 10) return addr;
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export function cleanName(s: string) {
  return s.trim().replace(/\s+/g, " ");
}
