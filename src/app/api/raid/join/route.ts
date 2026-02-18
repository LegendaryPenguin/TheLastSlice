import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { cleanName, isValidPrivyUserId, isWalletAddress } from "@/lib/utils";

export async function POST(req: Request) {
  const sb = supabaseServer();
  const body = await req.json();

  const code = String(body.code || "").toUpperCase().trim();
  const first = cleanName(String(body.firstName || ""));
  const last = cleanName(String(body.lastName || ""));
  const privyUserId = String(body.privyUserId || "").trim();
  const walletAddress = String(body.walletAddress || "").trim();

  if (!code || !first || !last || !isValidPrivyUserId(privyUserId)) {
    return NextResponse.json(
      { error: "Connect wallet or continue as guest first, then enter your name." },
      { status: 400 }
    );
  }

  const displayName = `${first} ${last}`;

  const { data: raid, error: raidErr } = await sb
    .from("raids")
    .select("*")
    .eq("code", code)
    .single();

  if (raidErr || !raid) {
    return NextResponse.json({ error: "Raid not found." }, { status: 404 });
  }

  if (raid.status === "ended") {
    return NextResponse.json({ error: "Raid already ended." }, { status: 409 });
  }

  // Check for duplicate player using Privy user ID OR wallet address (tag may be either)
  const tagCandidates = [privyUserId];
  if (isWalletAddress(walletAddress)) tagCandidates.push(walletAddress);

  const { data: existing } = await sb
    .from("players")
    .select("id")
    .eq("raid_id", raid.id)
    .in("tag", tagCandidates)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "You already joined this raid." }, { status: 409 });
  }

  // Store wallet address in tag if we have one, otherwise fall back to privyUserId.
  // The end route uses tag to mint tokens, so a real 0x address is strongly preferred.
  const tagValue = isWalletAddress(walletAddress) ? walletAddress : privyUserId;

  const { data: player, error: pErr } = await sb
    .from("players")
    .insert({
      raid_id: raid.id,
      first_name: first,
      last_name: last,
      tag: tagValue,
      display_name: displayName,
      energy: 100,
    })
    .select("*")
    .single();

  if (pErr) {
    return NextResponse.json({ error: pErr.message }, { status: 500 });
  }

  // Expose wallet for frontend use
  const playerWithWallet = { ...player, wallet: isWalletAddress(player.tag) ? player.tag : null };

  return NextResponse.json({ raid, player: playerWithWallet });
}
