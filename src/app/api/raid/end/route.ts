import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { mintTokens } from "@/lib/contract";

export async function POST(req: Request) {
  const sb = supabaseServer();
  const body = await req.json();
  const code = String(body.code || "").toUpperCase().trim();

  if (!code) return NextResponse.json({ error: "Code required." }, { status: 400 });

  // Load raid
  const { data: raid, error: raidErr } = await sb
    .from("raids")
    .select("*")
    .eq("code", code)
    .single();

  if (raidErr || !raid) return NextResponse.json({ error: "Raid not found." }, { status: 404 });
  if (raid.status !== "ended") return NextResponse.json({ error: "Raid not ended yet." }, { status: 409 });

  // Load all players
  const { data: players, error: pErr } = await sb
    .from("players")
    .select("*")
    .eq("raid_id", raid.id)
    .order("total_damage", { ascending: false });

  if (pErr || !players) {
    return NextResponse.json({ error: "Could not load players." }, { status: 500 });
  }

  const total = players.reduce((s: number, p: any) => s + (p.total_damage || 0), 0);
  if (total === 0) {
    return NextResponse.json({ ok: true, minted: [], message: "No damage dealt, nothing to mint." });
  }

  const results = [];

  for (const player of players) {
    // Wallet is stored in the tag column
    const wallet = player.tag as string | null;

    if (!wallet || !wallet.startsWith("0x")) {
      results.push({ player: player.display_name, address: wallet, amount: 0, txHash: null, error: "No wallet address" });
      continue;
    }

    // Same formula as the Leaderboard: proportional share out of 100
    const rewardUnits = Math.round((100 * player.total_damage) / total);
    if (rewardUnits === 0) {
      results.push({ player: player.display_name, address: wallet, amount: 0, txHash: null, error: "Zero reward" });
      continue;
    }

    // 2 decimals: rewardUnits * 100 raw = rewardUnits.00 PZZA
    // e.g. 30% damage share -> 30 rewardUnits -> 3000 raw -> 30.00 PZZA
    const rawAmount = BigInt(rewardUnits * 100);

    try {
      const txHash = await mintTokens(wallet as `0x${string}`, rawAmount);
      results.push({ player: player.display_name, address: wallet, amount: rewardUnits, txHash });
    } catch (e: any) {
      results.push({ player: player.display_name, address: wallet, amount: rewardUnits, txHash: null, error: e.message });
    }
  }

  return NextResponse.json({ ok: true, minted: results });
}
