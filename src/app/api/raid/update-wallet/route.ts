import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { isWalletAddress, isValidPrivyUserId } from "@/lib/utils";

/**
 * Updates a player tag from a Privy DID to their actual 0x wallet address.
 * Called by the client when the embedded wallet becomes available after joining.
 */
export async function POST(req: Request) {
  const sb = supabaseServer();
  const body = await req.json();
  const playerId = String(body.playerId || "").trim();
  const privyUserId = String(body.privyUserId || "").trim();
  const walletAddress = String(body.walletAddress || "").trim();

  if (!playerId || !isValidPrivyUserId(privyUserId) || !isWalletAddress(walletAddress)) {
    return NextResponse.json({ error: "Invalid parameters." }, { status: 400 });
  }

  // Only update if the player tag is still the Privy DID (joined without a wallet)
  const { data: player, error: pErr } = await sb
    .from("players")
    .select("id, tag")
    .eq("id", playerId)
    .eq("tag", privyUserId)
    .maybeSingle();

  if (pErr) {
    return NextResponse.json({ error: pErr.message }, { status: 500 });
  }

  if (!player) {
    // tag is already a wallet address (or player not found) - nothing to do
    return NextResponse.json({ ok: true, updated: false, message: "No update needed." });
  }

  const { error: uErr } = await sb
    .from("players")
    .update({ tag: walletAddress })
    .eq("id", playerId);

  if (uErr) {
    return NextResponse.json({ error: uErr.message }, { status: 500 });
  }

  console.log(`[update-wallet] Updated player ${playerId} tag to ${walletAddress}`);
  return NextResponse.json({ ok: true, updated: true });
}
