import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { cleanName, isValidPrivyUserId } from "@/lib/utils";

export async function POST(req: Request) {
  const sb = supabaseServer();
  const body = await req.json();

  const code = String(body.code || "").toUpperCase().trim();
  const first = cleanName(String(body.firstName || ""));
  const last = cleanName(String(body.lastName || ""));
  const privyUserId = String(body.privyUserId || "").trim();

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


  const { data: player, error: pErr } = await sb
    .from("players")
    .insert({
      raid_id: raid.id,
      first_name: first,
      last_name: last,
      tag: privyUserId,
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
