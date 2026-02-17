import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const sb = supabaseServer();
  const body = await req.json();
  const code = String(body.code || "").toUpperCase().trim();

  const { data: raid, error: raidErr } = await sb
    .from("raids")
    .select("*")
    .eq("code", code)
    .single();

  if (raidErr || !raid) return NextResponse.json({ error: "Raid not found." }, { status: 404 });

  const { data: playersRaw } = await sb
    .from("players")
    .select("*")
    .eq("raid_id", raid.id)
    .order("total_damage", { ascending: false });

  // Map tag to wallet when tag contains a wallet address (0x + 40 hex)
  const isWallet = (s: string | null) => s && /^0x[a-fA-F0-9]{40}$/.test(s);
  const players = (playersRaw || []).map((p) => ({
    ...p,
    wallet: isWallet(p.tag) ? p.tag : undefined,
  }));

  const { data: attacks } = await sb
    .from("attacks")
    .select("*")
    .eq("raid_id", raid.id)
    .order("created_at", { ascending: false })
    .limit(200);

  return NextResponse.json({ raid, players, attacks: attacks || [] });
}
