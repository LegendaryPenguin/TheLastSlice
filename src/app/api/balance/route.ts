import { createPublicClient, http } from "viem";
import { NextResponse } from "next/server";

const RPC_URL = process.env.PIZZACOIN_RPC_URL || "https://rpc.ankr.com/monad_testnet";
const CHAIN_ID = process.env.PIZZACOIN_CHAIN_ID ? parseInt(process.env.PIZZACOIN_CHAIN_ID, 10) : 10143;

const chain = {
  id: CHAIN_ID,
  name: "Monad Testnet",
  nativeCurrency: { decimals: 18, name: "MON", symbol: "MON" },
  rpcUrls: { default: { http: [RPC_URL] } },
};

const publicClient = createPublicClient({
  chain,
  transport: http(RPC_URL),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }

  try {
    const balance = await publicClient.getBalance({ address: address as `0x${string}` });
    return NextResponse.json({ balance: balance.toString(), wei: balance.toString() });
  } catch (e) {
    console.error("[balance] fetch failed:", e);
    return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 });
  }
}
