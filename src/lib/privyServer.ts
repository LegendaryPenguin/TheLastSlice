/**
 * Fetch EVM wallet address for a Privy user by ID.
 * Uses Privy REST API - requires PRIVY_APP_ID and PRIVY_APP_SECRET.
 */
export async function getWalletAddressForPrivyUser(privyUserId: string): Promise<string | null> {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const appSecret = process.env.PRIVY_APP_SECRET;
  if (!appId || !appSecret) return null;

  try {
    const auth = Buffer.from(`${appId}:${appSecret}`).toString("base64");
    const res = await fetch(`https://api.privy.io/v1/users/${encodeURIComponent(privyUserId)}`, {
      headers: {
        "privy-app-id": appId,
        Authorization: `Basic ${auth}`,
      },
    });
    if (!res.ok) {
      console.error("[Privy] getUser failed:", res.status, await res.text());
      return null;
    }

    const user = (await res.json()) as {
      linked_accounts?: Array<{ type?: string; chain_type?: string; address?: string }>;
    };
    const accounts = user?.linked_accounts ?? [];

    // Find any EVM-style address (wallet, smart_wallet, embedded)
    const evmWallet = accounts.find(
      (a) => a?.address && /^0x[a-fA-F0-9]{40}$/.test(String(a.address))
    );
    return evmWallet?.address ?? null;
  } catch {
    return null;
  }
}
