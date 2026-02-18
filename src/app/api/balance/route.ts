import { NextResponse } from "next/server";
import { getBalance } from "@/lib/contract";
import { isWalletAddress } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address") ?? "";

  if (!isWalletAddress(address)) {
    return NextResponse.json({ error: "Invalid address." }, { status: 400 });
  }

  try {
    const raw = await getBalance(address as `0x${string}`);
    // 2 decimals: 100 raw = 1.00 PZZA
    const display = (Number(raw) / 100).toFixed(2);
    return NextResponse.json({ raw: raw.toString(), display });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to fetch balance." }, { status: 500 });
  }
}
