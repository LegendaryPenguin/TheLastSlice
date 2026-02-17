import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { cleanName, isFiveDigits } from "@/lib/utils";

export async function POST(req: Request) {
  const sb = supabaseServer();
  const body = await req.json();

  const code = String(body.code || "").toUpperCase().trim();
  const first = cleanName(String(body.firstName || ""));
  const last = cleanName(String(body.lastName || ""));
  const tag = String(body.tag || "").trim();

  if (!code || !first || !last || !isFiveDigits(tag)) {
    return NextResponse.json({ error: "Invalid join fields." }, { status: 400 });
  }

  const displayName = `${first} ${last} #${tag}`;

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


  const { data: player, error: pErr } = await sb
    .from("players")
    .insert({
      raid_id: raid.id,
      first_name: first,
      last_name: last,
      tag,
      display_name: displayName,
      energy: 100,
    })
    .select("*")
    .single();

  if (pErr) {
    return NextResponse.json({ error: pErr.message }, { status: 500 });
  }

  return NextResponse.json({ raid, player });
}
