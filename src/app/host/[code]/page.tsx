"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { supabaseClient } from "@/lib/supabaseClient";
import Lobby from "@/components/Lobby";

type Mode = "join" | "lobby";

export default function HostRoomPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const { user } = usePrivy();

  const code = (params?.code ?? "ENTER").toString().toUpperCase();

  const [mode, setMode] = useState<Mode>("join");
  const [raid, setRaid] = useState<any>(null);
  const [player, setPlayer] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [joinLoading, setJoinLoading] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);

  useEffect(() => {
    if (!code || code === "ENTER") return;

    const saved = localStorage.getItem(`raid:${code}:player`);
    if (saved) {
      try {
        setPlayer(JSON.parse(saved));
      } catch {}
    }
  }, [code]);

  async function refreshState(showLoading = false) {
    if (showLoading && refreshLoading) return;
    if (showLoading) setRefreshLoading(true);
    try {
      const res = await fetch("/api/raid/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const json = await res.json();
      if (json.error) return;
      setRaid(json.raid);
      setPlayers(json.players);
    } finally {
      if (showLoading) setRefreshLoading(false);
    }
  }

  useEffect(() => {
    if (!code || code === "ENTER") return;
    refreshState();
  }, [code]);

  useEffect(() => {
    if (!raid?.id) return;

    const channel = supabaseClient
      .channel(`host:${raid.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "raids", filter: `id=eq.${raid.id}` },
        (payload) => {
          const next = payload.new as any;
          setRaid((r: any) => ({ ...r, ...next }));

          if (next.status === "live") {
            router.push(`/raid/${code}`);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players", filter: `raid_id=eq.${raid.id}` },
        async () => {
          const res = await fetch("/api/raid/state", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          });
          const json = await res.json();
          if (!json.error) setPlayers(json.players);
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [raid?.id, code, router]);

  async function joinRaid(firstName: string, lastName: string) {
    if (!user?.id) return alert("Connect wallet or continue as guest first.");
    if (joinLoading) return;
    setJoinLoading(true);
    try {
      const res = await fetch("/api/raid/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, firstName, lastName, privyUserId: user.id }),
      });
      const json = await res.json();
      if (json.error) return alert(json.error);
      setRaid(json.raid);
      setPlayer(json.player);
      localStorage.setItem(`raid:${code}:player`, JSON.stringify(json.player));
      setMode("lobby");
      await refreshState();
    } finally {
      setJoinLoading(false);
    }
  }

  async function startRaid() {
    if (startLoading) return;
    setStartLoading(true);
    try {
      const res = await fetch("/api/raid/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const json = await res.json();
      if (json.error) {
        setStartLoading(false);
        return alert(json.error);
      }
      router.push(`/raid/${code}`);
    } catch (e: any) {
      setStartLoading(false);
      alert(e?.message || "Start raid failed.");
    }
  }

  useEffect(() => {
    if (!raid) return;
    if (raid.status === "lobby") setMode(player ? "lobby" : "join");
  }, [raid, player]);

  return (
    <main className="pageShell">
      <div className="raidTop">
        <div>
          <div className="raidTitle">Host Room {code}</div>
          {/* ✅ NO status line */}
          {raid?.boss_name ? <div className="raidSub">Boss: <b>{raid.boss_name}</b></div> : null}
        </div>

        <div className="raidRight">
          <button className="btn" onClick={() => refreshState(true)} disabled={refreshLoading}>
            {refreshLoading ? "…" : "Refresh"}
          </button>
        </div>
      </div>

      <Lobby
        mode={mode}
        code={code}
        raid={raid}
        player={player}
        players={players}
        privyUserId={user?.id ?? null}
        joinLoading={joinLoading}
        startLoading={startLoading}
        onJoin={joinRaid}
        onStart={startRaid}
        isHost={true}
      />
    </main>
  );
}

