"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Lobby({
  mode,
  code,
  raid,
  player,
  players,
  privyUserId,
  onJoin,
  onStart,
  isHost = false,
}: {
  mode: "join" | "lobby";
  code: string;
  raid: any;
  player: any;
  players: any[];
  privyUserId: string | null;
  onJoin: (f: string, l: string) => void;
  onStart?: () => void;
  isHost?: boolean;
}) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");

  const joinedCount = players?.length ?? 0;

  const hostJoined = isHost && !!player;

  // Host can only start if host is joined + raid lobby + >= 1 player
  const canStart = useMemo(() => {
    if (!isHost) return false;
    if (!player) return false;
    if (!raid) return false;
    if (raid.status !== "lobby") return false;
    return joinedCount >= 1;
  }, [isHost, player, raid, joinedCount]);

  // ==========================
  // ✅ MINIMAL HOST LOBBY VIEW
  // ==========================
  if (hostJoined) {
    return (
      <div className="grid2">
        {/* LEFT: minimal host controls */}
        <div className="card" style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
            <div style={{ fontSize: 14, opacity: 0.85 }}>
              Players joined: <b>{joinedCount}</b>
            </div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>
              Room <b>{code}</b>
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 14 }} />

          {/* Big centered start */}
          {onStart && (
            <motion.button
              className="btnPrimary"
              onClick={onStart}
              disabled={!canStart}
              whileHover={canStart ? { y: -1 } : undefined}
              whileTap={canStart ? { scale: 0.99 } : undefined}
              style={{
                width: "min(560px, 100%)",
                justifySelf: "center",
                margin: "0 auto",
                padding: "20px 18px",
                borderRadius: 18,
                fontSize: 18,
                letterSpacing: 2,
                opacity: canStart ? 1 : 0.55,
              }}
              title={canStart ? "Start the raid" : "Need at least 1 player in the room"}
            >
              START RAID
            </motion.button>
          )}

          <div style={{ flex: 1, minHeight: 14 }} />
        </div>

        {/* RIGHT: players list */}
        <div className="card" style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <h3 style={{ marginTop: 0 }}>Players</h3>

          <div className="list" style={{ minHeight: 0 }}>
            <AnimatePresence initial={false}>
              {players.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="row"
                  style={{
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(0,0,0,0.18)",
                    borderRadius: 12,
                    padding: 10,
                  }}
                >
                  <div className="name">{p.display_name}</div>
                  <div className="muted">DMG {p.total_damage}</div>
                </motion.div>
              ))}
            </AnimatePresence>

            {players.length === 0 && <div className="muted">No one joined yet.</div>}
          </div>
        </div>
      </div>
    );
  }

  // ==========================
  // NORMAL JOIN / PLAYER LOBBY
  // ==========================
  return (
    <div className="grid2">
      {/* LEFT */}
      <div className="card" style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <h2 style={{ marginTop: 0 }}>Lobby</h2>

        {/* Join form */}
        {!player && (
          <div className="form">
            {!privyUserId ? (
              <div className="pill" style={{ borderStyle: "solid" }}>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>🔗 Connect first</div>
                <div style={{ opacity: 0.85, lineHeight: 1.4 }}>
                  Use the &quot;Connect Wallet&quot; or &quot;Continue as Guest&quot; button in the top-right corner to identify yourself, then come back here to join.
                </div>
              </div>
            ) : (
              <>
                <input placeholder="First Name" value={first} onChange={(e) => setFirst(e.target.value)} />
                <input placeholder="Last Name" value={last} onChange={(e) => setLast(e.target.value)} />
                <button className="btnPrimary" onClick={() => onJoin(first, last)}>
                  Join Room {code}
                </button>
              </>
            )}
          </div>
        )}

        {/* Joined (player view): keep waiting message */}
        {player && (
          <div style={{ display: "grid", gap: 10 }}>
            <div className="pill">
              You are in as <b>{player.display_name}</b>
            </div>

            {raid?.status === "lobby" && (
              <div className="pill" style={{ borderStyle: "solid" }}>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>⏳ Waiting for host…</div>
                <div style={{ opacity: 0.85, lineHeight: 1.4 }}>
                  Stay on this page. When the host starts the raid, you’ll automatically switch to the battle.
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ flex: 1, minHeight: 12 }} />

        {/* Footer info only */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div style={{ opacity: 0.85 }}>
            Players joined: <b>{joinedCount}</b>
          </div>
          <div style={{ opacity: 0.6, fontSize: 12 }}>
            Room <b>{code}</b>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="card" style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <h3 style={{ marginTop: 0 }}>Players</h3>

        <div className="list" style={{ minHeight: 0 }}>
          <AnimatePresence initial={false}>
            {players.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="row"
                style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(0,0,0,0.18)",
                  borderRadius: 12,
                  padding: 10,
                }}
              >
                <div className="name">{p.display_name}</div>
                <div className="muted">DMG {p.total_damage}</div>
              </motion.div>
            ))}
          </AnimatePresence>

          {players.length === 0 && <div className="muted">No one joined yet.</div>}
        </div>
      </div>
    </div>
  );
}

