import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { mintTokens } from "@/lib/contract";
import { isWalletAddress } from "@/lib/utils";

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

  // Idempotency: if tokens were already minted for this raid, skip
  if (raid.tokens_minted) {
    return NextResponse.json({ ok: true, minted: [], message: "Rewards already distributed." });
  }

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

  // Mark as minted immediately to prevent duplicate runs from other clients
  await sb.from("raids").update({ tokens_minted: true }).eq("id", raid.id);

  const results = [];

  for (const player of players) {
    // tag holds the wallet address (0x...) if the player had a wallet at join time
    const wallet = player.tag as string | null;

    if (!wallet || !isWalletAddress(wallet)) {
      console.warn(`[gameEnd] No wallet for player "${player.display_name}" (tag: ${wallet})`);
      results.push({
        player: player.display_name,
        address: wallet,
        amount: 0,
        txHash: null,
        error: "No wallet address â€” player joined without a connected wallet",
      });
      continue;
    }

    // Proportional share out of 100 units (same formula as Leaderboard)
    const rewardUnits = Math.round((100 * player.total_damage) / total);
    if (rewardUnits === 0) {
      results.push({ player: player.display_name, address: wallet, amount: 0, txHash: null, error: "Zero reward" });
      continue;
    }

    // 2 decimals: rewardUnits * 100 raw = rewardUnits.00 PZZA
    // e.g. 30% damage share -> 3000 raw -> 30.00 PZZA
    const rawAmount = BigInt(rewardUnits * 100);

    try {
      const txHash = await mintTokens(wallet as `0x${string}`, rawAmount);
      console.log(`[gameEnd] Minted ${rewardUnits} PZZA to ${wallet} (${player.display_name}) â€” tx: ${txHash}`);
      results.push({ player: player.display_name, address: wallet, amount: rewardUnits, txHash });
    } catch (e: any) {
      console.error(`[gameEnd] Mint failed for ${player.display_name} (${wallet}):`, e?.message);
      results.push({ player: player.display_name, address: wallet, amount: rewardUnits, txHash: null, error: e.message });
    }
  }

  return NextResponse.json({ ok: true, minted: results });
}
