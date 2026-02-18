import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { distributeRaidRewards } from "@/lib/distributeRewards";

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

  // Auto-end raid if timer expired (status stays "live" until someone fetches state or attacks)
  if (raid.status === "live" && raid.ends_at) {
    const now = new Date();
    if (now.getTime() > new Date(raid.ends_at).getTime()) {
      await sb.from("raids").update({ status: "ended" }).eq("id", raid.id);
      raid.status = "ended";
      // Trigger PizzaCoin distribution (idempotent via rewards_distributed)
      const { data: endPlayers } = await sb.from("players").select("id, total_damage, tag").eq("raid_id", raid.id);
      if (endPlayers) {
        await distributeRaidRewards(endPlayers);
      }
    }
  }

  const { data: players } = await sb
    .from("players")
    .select("*")
    .eq("raid_id", raid.id)
    .order("total_damage", { ascending: false });

  const { data: attacks } = await sb
    .from("attacks")
    .select("*")
    .eq("raid_id", raid.id)
    .order("created_at", { ascending: false })
    .limit(200);

  return NextResponse.json({ raid, players: players || [], attacks: attacks || [] });
}
