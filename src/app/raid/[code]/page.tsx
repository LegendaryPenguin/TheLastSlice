"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { pickFourRandomMoves } from "@/lib/moves";
import Lobby from "@/components/Lobby";
import BattleArena from "@/components/BattleArena";
import Leaderboard from "@/components/Leaderboard";

type Mode = "join" | "lobby" | "battle" | "ended";

export default function RaidPage() {
  const params = useParams<{ code: string }>();
  const code = (params?.code ?? "ENTER").toString().toUpperCase();

  const [mode, setMode] = useState<Mode>("join");
  const [raid, setRaid] = useState<any>(null);
  const [player, setPlayer] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [attacks, setAttacks] = useState<any[]>([]);

  const [moveSet, setMoveSet] = useState(() => pickFourRandomMoves());

  // Load saved player for this raid (so refresh doesn't wipe identity)
  useEffect(() => {
    if (!code || code === "ENTER") return;

    const saved = localStorage.getItem(`raid:${code}:player`);
    if (saved) {
      try {
        setPlayer(JSON.parse(saved));
      } catch {}
    }
  }, [code]);

  async function refreshState() {
    if (!code || code === "ENTER") return;

    const res = await fetch("/api/raid/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const json = await res.json();
    if (json.error) return;

    setRaid(json.raid);
    setPlayers(json.players);
    setAttacks(json.attacks);
  }

  // Initial fetch (guarded)
  useEffect(() => {
    if (!code || code === "ENTER") return;
    refreshState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  // Subscribe realtime once raid is known
  useEffect(() => {
    if (!raid?.id) return;

    const channel = supabaseClient
      .channel(`raid:${raid.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "raids", filter: `id=eq.${raid.id}` },
        (payload) => {
          const next = payload.new as any;
          setRaid((r: any) => ({ ...r, ...next }));
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players", filter: `raid_id=eq.${raid.id}` },
        async () => {
          // Re-fetch ordered players for leaderboard correctness
          const res = await fetch("/api/raid/state", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          });
          const json = await res.json();
          if (!json.error) setPlayers(json.players);
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "attacks", filter: `raid_id=eq.${raid.id}` },
        (payload) => {
          const atk = payload.new as any;
          // prepend + cap
          setAttacks((prev) => [atk, ...prev].slice(0, 200));
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [raid?.id, code]);

  async function joinRaid(firstName: string, lastName: string, tag: string) {
    const res = await fetch("/api/raid/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, firstName, lastName, tag }),
    });
    const json = await res.json();
    if (json.error) return alert(json.error);

    setRaid(json.raid);
    setPlayer(json.player);
    localStorage.setItem(`raid:${code}:player`, JSON.stringify(json.player));
    setMode("lobby");

    await refreshState();
  }

  async function startBattle() {
    const res = await fetch("/api/raid/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const json = await res.json();
    if (json.error) return alert(json.error);

    setRaid(json.raid);
    setMode("battle");
  }

  async function doAttack(moveId: number) {
    if (!player) return alert("Join first.");

    const res = await fetch("/api/raid/attack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, playerId: player.id, moveId }),
    });
    const json = await res.json();
    if (json.error) return;

    await refreshState();
    setMoveSet(pickFourRandomMoves());
  }

  // Single source of truth for mode switching
  useEffect(() => {
    if (!raid) return;

    if (raid.status === "lobby") setMode(player ? "lobby" : "join");
    if (raid.status === "live") setMode("battle");
    if (raid.status === "ended") setMode("ended");
  }, [raid, player]);

  return (
    <main className="pageShell">
      <div className="raidTop">
        <div>
          <div className="raidTitle">🍍🍕 Room {code}</div>
          {raid && (
            <div className="raidSub">
              Boss: <b>{raid.boss_name}</b> — Status: <b>{raid.status}</b>
            </div>
          )}
        </div>

        <div className="raidRight">
          <button
            className="btn"
            onClick={() => {
              if (code !== "ENTER") refreshState();
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {mode === "join" && (
        <Lobby
          mode="join"
          code={code}
          raid={raid}
          player={player}
          players={players}
          onJoin={joinRaid}
          onStart={startBattle}
          isHost={true}
        />
      )}

      {mode === "lobby" && (
        <Lobby
          mode="lobby"
          code={code}
          raid={raid}
          player={player}
          players={players}
          onJoin={joinRaid}
          onStart={startBattle}
          isHost={true}
        />
      )}

      {mode === "battle" && (
        <BattleArena
          code={code}
          raid={raid}
          player={player}
          players={players}
          attacks={attacks}
          moves={moveSet}
          onAttack={doAttack}
        />
      )}

      {mode === "ended" && <Leaderboard raid={raid} players={players} />}
    </main>
  );
}
