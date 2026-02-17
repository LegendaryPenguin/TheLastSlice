import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { cleanName, isWalletAddress, shortAddr } from "@/lib/utils";

export async function POST(req: Request) {
  const sb = supabaseServer();
  const body = await req.json();

  const code = String(body.code || "").toUpperCase().trim();
  const first = cleanName(String(body.firstName || ""));
  const last = cleanName(String(body.lastName || ""));
  const wallet = String(body.wallet || "").trim();

  if (!code || !first || !last || !isWalletAddress(wallet)) {
    return NextResponse.json({ error: "Invalid join fields. Wallet required." }, { status: 400 });
  }

  const displayName = `${first} ${last} #${shortAddr(wallet)}`;

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

  // Check for duplicate wallet in this raid (stored in tag column)
  const { data: existing } = await sb
    .from("players")
    .select("id")
    .eq("raid_id", raid.id)
    .eq("tag", wallet)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "This wallet already joined this raid." }, { status: 409 });
  }

  const { data: player, error: pErr } = await sb
    .from("players")
    .insert({
      raid_id: raid.id,
      first_name: first,
      last_name: last,
      tag: wallet,
      display_name: displayName,
      energy: 100,
    })
    .select("*")
    .single();

  if (pErr) {
    return NextResponse.json({ error: pErr.message }, { status: 500 });
  }

  // Attach wallet for frontend (stored in tag column)
  const playerWithWallet = { ...player, wallet: player.tag };

  return NextResponse.json({ raid, player: playerWithWallet });
}

