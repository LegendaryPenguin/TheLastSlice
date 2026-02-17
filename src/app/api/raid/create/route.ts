import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { nanoid } from "nanoid";

export async function POST() {
  const sb = supabaseServer();
  const code = nanoid(6).toUpperCase(); // room code like "A1B2C3"

  const { data, error } = await sb
    .from("raids")
    .insert({
      code,
      status: "lobby",
      boss_name: "Pineapple Pizza Titan",
      boss_hp: 3600,
      boss_hp_max: 3600,
      duration_seconds: 60,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ raid: data });
}
