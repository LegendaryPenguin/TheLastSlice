import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { distributeRaidRewards } from "@/lib/distributeRewards";

export async function POST(req: Request) {
  const sb = supabaseServer();
  const body = await req.json();
  const code = String(body.code || "").toUpperCase().trim();

  if (!code) {
    return NextResponse.json({ error: "Missing code." }, { status: 400 });
  }

  const { data: raid, error: raidErr } = await sb
    .from("raids")
    .select("*")
    .eq("code", code)
    .single();

  if (raidErr || !raid) {
    return NextResponse.json({ error: "Raid not found." }, { status: 404 });
  }

  if (raid.status !== "ended") {
    return NextResponse.json({ error: "Raid has not ended yet." }, { status: 409 });
  }

  if (raid.rewards_distributed === true) {
    return NextResponse.json({
      ok: true,
      distributed: 0,
      skipped: 0,
      errors: [],
      alreadyDistributed: true,
    });
  }

  const { data: players } = await sb
    .from("players")
    .select("id, total_damage, tag")
    .eq("raid_id", raid.id);

  const result = await distributeRaidRewards(players || []);

  if (result.distributed > 0 || result.errors.length === 0) {
    try {
      await sb.from("raids").update({ rewards_distributed: true }).eq("id", raid.id);
    } catch {
      // rewards_distributed column may not exist; add via Supabase Table Editor if needed
    }
  }

  return NextResponse.json({
    ok: true,
    distributed: result.distributed,
    skipped: result.skipped,
    errors: result.errors,
  });
}
