import { createWalletClient, createPublicClient, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";

// Monad testnet chain definition (not in viem built-in list)
export const monadTestnet = {
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: { default: { http: ["https://testnet-rpc.monad.xyz"] } },
} as const;

// PizzaCoin ABI - only the functions we need
export const PIZZA_ABI = parseAbi([
  "function mint(address to, uint256 amount) external",
  "function balanceOf(address account) external view returns (uint256)",
  "function totalSupply() external view returns (uint256)",
  "function decimals() external view returns (uint8)",
]);

function getRpcUrl() {
  return process.env.RPC_URL ?? "https://testnet-rpc.monad.xyz";
}

function getContractAddress(): `0x${string}` {
  const addr = process.env.CONTRACT_ADDRESS;
  if (!addr || addr === "PASTE_AFTER_DEPLOY") {
    throw new Error("CONTRACT_ADDRESS env var is not set. Deploy the contract first.");
  }
  return addr as `0x${string}`;
}

// Write client - signs transactions with the owner private key
function getWalletClient() {
  const privateKey = process.env.OWNER_PRIVATE_KEY as `0x${string}`;
  if (!privateKey) throw new Error("OWNER_PRIVATE_KEY env var is not set.");

  const account = privateKeyToAccount(privateKey);
  return createWalletClient({
    account,
    chain: monadTestnet,
    transport: http(getRpcUrl()),
  });
}

// Read client - no key needed, for balanceOf / totalSupply etc.
export function getPublicClient() {
  return createPublicClient({
    chain: monadTestnet,
    transport: http(getRpcUrl()),
  });
}

/**
 * Mint PizzaCoin to a wallet address.
 * toAddress  - recipient wallet (0x...)
 * rawAmount  - token units (2 decimals: 100 raw = 1.00 PZZA)
 * returns      transaction hash
 */
export async function mintTokens(
  toAddress: `0x${string}`,
  rawAmount: bigint
): Promise<`0x${string}`> {
  const client = getWalletClient();
  const contractAddress = getContractAddress();

  const txHash = await client.writeContract({
    address: contractAddress,
    abi: PIZZA_ABI,
    functionName: "mint",
    args: [toAddress, rawAmount],
  });

  return txHash;
}

/**
 * Read a wallet PZZA balance (raw units - divide by 100 for display).
 */
export async function getBalance(walletAddress: `0x${string}`): Promise<bigint> {
  const client = getPublicClient();
  const contractAddress = getContractAddress();

  return client.readContract({
    address: contractAddress,
    abi: PIZZA_ABI,
    functionName: "balanceOf",
    args: [walletAddress],
  });
}
