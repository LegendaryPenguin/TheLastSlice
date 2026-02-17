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
  if (raid.status !== "lobby") return NextResponse.json({ error: "Raid not in lobby." }, { status: 409 });

  const startedAt = new Date();
  const endsAt = new Date(startedAt.getTime() + raid.duration_seconds * 1000);

  const { data: updated, error } = await sb
    .from("raids")
    .update({
      status: "live",
      started_at: startedAt.toISOString(),
      ends_at: endsAt.toISOString(),
    })
    .eq("id", raid.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ raid: updated });
}
