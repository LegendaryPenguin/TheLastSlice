import { NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { supabaseServer } from "@/lib/supabaseServer";

const alphanumeric = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 6);

export async function POST() {
  const sb = supabaseServer();
  const code = alphanumeric();

  const { data, error } = await sb
    .from("raids")
    .insert({
      code,
      status: "lobby",
      boss_name: "Pizza Titan",
      boss_hp: 3600,
      boss_hp_max: 3600,
      duration_seconds: 10,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ raid: data });
}
