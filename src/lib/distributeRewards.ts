import type { Address } from "viem";
import { createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sendMon } from "./sendMon";
import { getWalletAddressForPrivyUser } from "./privyServer";

const OWNER_PRIVATE_KEY = process.env.PIZZACOIN_OWNER_PRIVATE_KEY;
const RPC_URL = process.env.PIZZACOIN_RPC_URL || "https://rpc.ankr.com/monad_testnet";
const CHAIN_ID = process.env.PIZZACOIN_CHAIN_ID ? parseInt(process.env.PIZZACOIN_CHAIN_ID, 10) : 10143;

export type PlayerWithReward = {
  id: string;
  total_damage: number;
  tag?: string | null;
};

/** 1 MON in wei - total reward pool */
const TOTAL_POOL_WEI = BigInt("1000000000000000000");

/**
 * Distribute 1 MON total to players based on damage contribution.
 * Each player gets (their_damage / total_damage) * 1 MON.
 */
export async function distributeRaidRewards(
  players: PlayerWithReward[]
): Promise<{ distributed: number; skipped: number; errors: string[] }> {
  const errors: string[] = [];
  let distributed = 0;
  let skipped = 0;

  if (!OWNER_PRIVATE_KEY) {
    return {
      distributed: 0,
      skipped: players.length,
      errors: ["PIZZACOIN_OWNER_PRIVATE_KEY missing in env"],
    };
  }

  const totalDamage = players.reduce((s, p) => s + (p.total_damage || 0), 0);
  if (totalDamage <= 0) {
    return { distributed: 0, skipped: players.length, errors: ["No damage dealt"] };
  }

  // Get initial nonce and owner address
  let nextNonce: number | undefined;
  let ownerAddress: string | null = null;
  try {
    const key = OWNER_PRIVATE_KEY.trim().replace(/^"|"$/g, "");
    const hex = key.startsWith("0x") ? key : `0x${key}`;
    const account = privateKeyToAccount(hex as `0x${string}`);
    ownerAddress = account.address.toLowerCase();
    const publicClient = createPublicClient({
      chain: { id: CHAIN_ID, name: "Monad", nativeCurrency: { decimals: 18, name: "MON", symbol: "MON" }, rpcUrls: { default: { http: [RPC_URL] } } },
      transport: http(RPC_URL),
    });
    nextNonce = await publicClient.getTransactionCount({ address: account.address });
  } catch {
    // Fall back to no explicit nonce if fetch fails
  }

  for (const p of players) {
    const privyUserId = p.tag?.trim();
    if (!privyUserId) {
      skipped++;
      continue;
    }

    const walletAddress = await getWalletAddressForPrivyUser(privyUserId);
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      skipped++;
      continue;
    }
    if (ownerAddress && walletAddress.toLowerCase() === ownerAddress) {
      skipped++;
      continue;
    }

    const damage = p.total_damage || 0;
    const shareWei = (BigInt(Math.floor(damage * 1e12)) * TOTAL_POOL_WEI) / BigInt(Math.floor(totalDamage * 1e12));

    try {
      const hash = await sendMon(
        walletAddress as Address,
        shareWei,
        OWNER_PRIVATE_KEY,
        RPC_URL,
        CHAIN_ID,
        nextNonce
      );
      if (hash) {
        distributed++;
        if (nextNonce !== undefined) nextNonce++;
      } else {
        errors.push(`Failed to send MON for ${walletAddress}`);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`Send error for ${walletAddress}: ${msg}`);
      if (nextNonce !== undefined) nextNonce++;
    }
    await new Promise((r) => setTimeout(r, 2500));
  }

  return { distributed, skipped, errors };
}
