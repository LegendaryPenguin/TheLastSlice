/**
 * Call this once when a raid ends to trigger on-chain PZZA minting for all players.
 * The server handles idempotency (tokens_minted flag), so safe to call from multiple clients.
 */
export async function triggerGameEnd(code: string): Promise<void> {
  try {
    const res = await fetch("/api/raid/end", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const json = await res.json();
    if (!json.ok) {
      console.error("[gameEnd] Minting error:", json.error ?? json.message);
    } else {
      console.log("[gameEnd] Mint results:", json.minted);
    }
  } catch (e) {
    console.error("[gameEnd] Failed to call /api/raid/end:", e);
  }
}
