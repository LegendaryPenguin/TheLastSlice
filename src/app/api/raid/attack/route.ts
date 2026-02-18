import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { clamp } from "@/lib/utils";
import { getMoveById } from "@/lib/moves";

const ENERGY_MAX = 100;
const ENERGY_REGEN_PER_SEC = 25; // 0->100 in 4 seconds
const CRIT_MULT = 1.2;

export async function POST(req: Request) {
  const sb = supabaseServer();
  const body = await req.json();

  const raidCode = String(body.code || "").toUpperCase().trim();
  const playerId = String(body.playerId || "").trim();
  const moveId = Number(body.moveId);

  if (!raidCode || !playerId || !Number.isFinite(moveId)) {
    return NextResponse.json({ error: "Invalid attack payload." }, { status: 400 });
  }

  const move = getMoveById(moveId);
  if (!move) return NextResponse.json({ error: "Invalid move." }, { status: 400 });

  // Load raid
  const { data: raid, error: raidErr } = await sb
    .from("raids")
    .select("*")
    .eq("code", raidCode)
    .single();

  if (raidErr || !raid) return NextResponse.json({ error: "Raid not found." }, { status: 404 });
  if (raid.status !== "live") return NextResponse.json({ error: "Raid not live." }, { status: 409 });

  const now = new Date();

  // End check
  if (raid.ends_at && now.getTime() > new Date(raid.ends_at).getTime()) {
    await sb.from("raids").update({ status: "ended" }).eq("id", raid.id);
    return NextResponse.json({ error: "Raid ended." }, { status: 409 });
  }

  // Load player
  const { data: player, error: pErr } = await sb
    .from("players")
    .select("*")
    .eq("id", playerId)
    .eq("raid_id", raid.id)
    .single();

  if (pErr || !player) return NextResponse.json({ error: "Player not found." }, { status: 404 });

  // Compute regenerated energy
  const prevTs = new Date(player.energy_updated_at).getTime();
  const dtSec = Math.max(0, (now.getTime() - prevTs) / 1000);
  const regen = Math.floor(dtSec * ENERGY_REGEN_PER_SEC);
  const currentEnergy = clamp(player.energy + regen, 0, ENERGY_MAX);

  if (currentEnergy < move.cost) {
    return NextResponse.json({ error: "Not enough energy." }, { status: 429 });
  }

  // Roll damage + crit
  const base = Math.floor(Math.random() * (move.maxDmg - move.minDmg + 1)) + move.minDmg;
  const crit = Math.random() < move.critChance;
  const dmg = crit ? Math.floor(base * CRIT_MULT) : base;

  const newEnergy = currentEnergy - move.cost;

  // Apply updates (simple sequential updates; good enough for v1)
  const newBossHp = Math.max(0, raid.boss_hp - dmg);

  const { error: attackErr } = await sb.from("attacks").insert({
    raid_id: raid.id,
    player_id: player.id,
    player_name: player.display_name,
    move_id: move.id,
    move_name: move.name,
    energy_cost: move.cost,
    damage: dmg,
    crit,
    anim_type: move.animType,
  });

  if (attackErr) return NextResponse.json({ error: attackErr.message }, { status: 500 });

  const { error: playerUpErr } = await sb
    .from("players")
    .update({
      total_damage: player.total_damage + dmg,
      energy: newEnergy,
      energy_updated_at: now.toISOString(),
      last_attack_at: now.toISOString(),
    })
    .eq("id", player.id);

  if (playerUpErr) return NextResponse.json({ error: playerUpErr.message }, { status: 500 });

  // Update raid HP + possibly end
  const raidUpdate: any = { boss_hp: newBossHp };
  if (newBossHp === 0) raidUpdate.status = "ended";

  const { error: raidUpErr } = await sb.from("raids").update(raidUpdate).eq("id", raid.id);
  if (raidUpErr) return NextResponse.json({ error: raidUpErr.message }, { status: 500 });

  return NextResponse.json({
    ok: true,
    damage: dmg,
    crit,
    boss_hp: newBossHp,
    energy: newEnergy,
  });
}
