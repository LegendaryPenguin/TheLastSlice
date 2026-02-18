import { createWalletClient, createPublicClient, http, type Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";

/** 0.1 MON in wei (18 decimals) */
const REWARD_AMOUNT_WEI = BigInt("100000000000000000");

/**
 * Send 0.1 MON (native) to a player's wallet.
 * Uses PIZZACOIN_OWNER_PRIVATE_KEY.
 * @param nonce - Optional explicit nonce to avoid "existing transaction had higher priority" errors when sending multiple txs.
 */
export async function sendMon(
  to: Address,
  privateKeyHex: string,
  rpcUrl: string,
  chainId = 10143,
  nonce?: number
): Promise<string | null> {
  const key = privateKeyHex.trim().replace(/^"|"$/g, "");
  const hex = key.startsWith("0x") ? key : `0x${key}`;
  if (!/^0x[a-fA-F0-9]{64}$/.test(hex)) {
    throw new Error(
      "Invalid PIZZACOIN_OWNER_PRIVATE_KEY: must be 64 hex chars (not an address)."
    );
  }
  const account = privateKeyToAccount(hex as `0x${string}`);

  const chain = {
    id: chainId,
    name: "Monad Testnet",
    nativeCurrency: { decimals: 18, name: "MON", symbol: "MON" },
    rpcUrls: { default: { http: [rpcUrl] } },
  };

  const publicClient = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });

  const walletClient = createWalletClient({
    account,
    chain,
    transport: http(rpcUrl),
  });

  if (!walletClient) return null;

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const hash = await walletClient.sendTransaction({
        to,
        value: REWARD_AMOUNT_WEI,
        ...(nonce !== undefined && { nonce }),
      });

      if (!hash) return null;
      await publicClient.waitForTransactionReceipt({ hash });
      return hash;
    } catch (e: unknown) {
      lastError = e instanceof Error ? e : new Error(String(e));
      const msg = lastError.message;
      const is429 = msg.includes("429") || msg.includes("Too Many Requests");
      const isNonce = msg.includes("higher priority") || msg.includes("nonce") || msg.includes("replacement");
      if ((is429 || isNonce) && attempt < maxRetries - 1) {
        const delay = 3000 * (attempt + 1);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      console.error("[sendMon] failed:", msg);
      throw lastError;
    }
  }

  throw lastError ?? new Error("Send MON failed after retries");
}
