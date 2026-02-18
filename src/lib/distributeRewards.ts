import type { Address } from "viem";
import { mintPizzaCoins, rewardToMintAmount } from "./pizzaCoin";
import { getWalletAddressForPrivyUser } from "./privyServer";

const CONTRACT_ADDRESS = process.env.PIZZACOIN_CONTRACT_ADDRESS as Address | undefined;
const OWNER_PRIVATE_KEY = process.env.PIZZACOIN_OWNER_PRIVATE_KEY;
const RPC_URL = process.env.PIZZACOIN_RPC_URL || "https://rpc.ankr.com/monad_testnet";
const CHAIN_ID = process.env.PIZZACOIN_CHAIN_ID ? parseInt(process.env.PIZZACOIN_CHAIN_ID, 10) : 10143;

export type PlayerWithReward = {
  id: string;
  total_damage: number;
  tag?: string | null; // Privy user ID
};

/**
 * Compute reward score (0-100) for a player based on damage contribution.
 * This is the Pizza Coin reward (reward * 100 = mint amount in contract units).
 */
export function rewardScore(totalDamage: number, totalDamageAll: number): number {
  if (totalDamageAll <= 0) return 0;
  return Math.round((10 * totalDamage) / totalDamageAll);
}

/**
 * Distribute PizzaCoins to players when raid ends.
 * Fetches wallet address from Privy API using player's tag (Privy user ID).
 * Returns { distributed: number, skipped: number, errors: string[] }
 */
export async function distributeRaidRewards(
  players: PlayerWithReward[],
  setRewardsDistributed?: () => Promise<void>
): Promise<{ distributed: number; skipped: number; errors: string[] }> {
  const errors: string[] = [];
  let distributed = 0;
  let skipped = 0;

  if (!CONTRACT_ADDRESS || !OWNER_PRIVATE_KEY) {
    return { distributed: 0, skipped: players.length, errors: ["PizzaCoin config missing (contract address or owner key)"] };
  }

  const total = players.reduce((s, p) => s + (p.total_damage || 0), 0);

  for (const p of players) {
    const score = rewardScore(p.total_damage || 0, total);
    const mintAmount = rewardToMintAmount(score);

    if (mintAmount <= 0) {
      skipped++;
      continue;
    }

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

    try {
      const hash = await mintPizzaCoins(
        walletAddress as Address,
        mintAmount,
        CONTRACT_ADDRESS,
        OWNER_PRIVATE_KEY,
        RPC_URL,
        CHAIN_ID
      );
      if (hash) {
        distributed++;
      } else {
        errors.push(`Failed to mint for ${walletAddress}`);
      }
    } catch (e: any) {
      errors.push(`Mint error for ${walletAddress}: ${e?.message || String(e)}`);
    }
    // Delay between mints to avoid RPC rate limits (429)
    await new Promise((r) => setTimeout(r, 1500));
  }

  if ((distributed > 0 || errors.length === 0) && setRewardsDistributed) {
    try {
      await setRewardsDistributed();
    } catch {
      // Ignore if rewards_distributed column doesn't exist
    }
  }

  return { distributed, skipped, errors };
}
