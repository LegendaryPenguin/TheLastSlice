import { createWalletClient, createPublicClient, http, type Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const PIZZACOIN_ABI = [
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

/** Mint amount: 100 = 1 Pizza Coin (contract has 2 decimals) */
export const PIZZA_COIN_SCALE = 100;

/**
 * Mint PizzaCoins to a player. Amount in raw units (100 = 1 Pizza Coin).
 * Returns tx hash on success, null on failure.
 */
export async function mintPizzaCoins(
  to: Address,
  amount: number,
  contractAddress: Address,
  privateKeyHex: string,
  rpcUrl: string,
  chainId?: number
): Promise<string | null> {
  const key = privateKeyHex.trim().replace(/^"|"$/g, "");
  const hex = key.startsWith("0x") ? key : `0x${key}`;
  if (!/^0x[a-fA-F0-9]{64}$/.test(hex)) {
    throw new Error(
      "Invalid PIZZACOIN_OWNER_PRIVATE_KEY: must be 64 hex chars (not an address). " +
        "Use the deployer wallet's private key from MetaMask/your wallet."
    );
  }
  const account = privateKeyToAccount(hex as `0x${string}`);

  const chain = {
    id: chainId ?? 10143, // default Monad testnet
    name: "Custom",
    nativeCurrency: { decimals: 18, name: "ETH", symbol: "ETH" },
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
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: PIZZACOIN_ABI,
        functionName: "mint",
        args: [to, BigInt(Math.floor(amount))],
      });

      if (!hash) return null;
      await publicClient.waitForTransactionReceipt({ hash });
      return hash;
    } catch (e: unknown) {
      lastError = e instanceof Error ? e : new Error(String(e));
      const msg = lastError.message;
      const is429 = msg.includes("429") || msg.includes("Too Many Requests");
      if (is429 && attempt < maxRetries - 1) {
        const delay = 2000 * (attempt + 1);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      console.error("[PizzaCoin] mint failed:", msg);
      throw lastError;
    }
  }

  throw lastError ?? new Error("Mint failed after retries");
}

/**
 * Convert reward score (0-100 contribution %) to mint amount.
 * rewardScore * 100 = raw mint amount (e.g. 50 -> 5000 -> 50 Pizza Coins)
 */
export function rewardToMintAmount(rewardScore: number): number {
  return Math.floor(rewardScore * PIZZA_COIN_SCALE);
}
