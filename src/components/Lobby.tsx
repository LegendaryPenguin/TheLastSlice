"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Lobby({
  mode,
  code,
  raid,
  player,
  players,
  onJoin,
  onStart,
  isHost = false,
}: {
  mode: "join" | "lobby";
  code: string;
  raid: any;
  player: any;
  players: any[];
  onJoin: (f: string, l: string, t: string) => void;
  onStart?: () => void;
  isHost?: boolean;
}) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [tag, setTag] = useState("");

  const joinedCount = players?.length ?? 0;

  const canStart = useMemo(() => {
    if (!isHost) return false;
    if (!raid) return false;
    if (raid.status !== "lobby") return false;
    // You can change this to >=2 if you want at least 2 players
    return joinedCount >= 1;
  }, [isHost, raid, joinedCount]);

  const inviteLink = useMemo(() => {
    // Safe on client
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/raid/${code}`;
  }, [code]);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  }

  return (
    <div className="grid2">
      {/* LEFT: Lobby / Join / Host Start */}
      <div className="card" style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <h2 style={{ marginTop: 0 }}>Lobby</h2>
        <p style={{ opacity: 0.8, marginTop: 0 }}>
          Join with your name + 5-digit tag. Once enough people join, the host starts the raid.
        </p>

        {/* If not joined yet -> show join form */}
        {!player && (
          <div className="form">
            <input
              placeholder="First Name"
              value={first}
              onChange={(e) => setFirst(e.target.value)}
            />
            <input
              placeholder="Last Name"
              value={last}
              onChange={(e) => setLast(e.target.value)}
            />
            <input
              placeholder="5-digit tag (e.g. 12345)"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />

            <button className="btnPrimary" onClick={() => onJoin(first, last, tag)}>
              Join Room {code}
            </button>

            {/* Host-only share helper (clean, small) */}
            {isHost && (
              <div className="pill" style={{ marginTop: 10 }}>
                <div style={{ fontWeight: 900, letterSpacing: 1, marginBottom: 8 }}>
                  Share with audience
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <div style={{ opacity: 0.8 }}>Room code:</div>
                    <div style={{ fontWeight: 900, letterSpacing: 2 }}>{code}</div>
                    <button className="btn" onClick={() => copy(code)}>
                      Copy
                    </button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <div style={{ opacity: 0.8, minWidth: 92 }}>Invite:</div>
                    <div
                      style={{
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        opacity: 0.9,
                      }}
                      title={inviteLink}
                    >
                      {inviteLink}
                    </div>
                    <button className="btn" onClick={() => copy(inviteLink)}>
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* If joined -> show your identity + waiting message */}
        {player && (
          <div style={{ display: "grid", gap: 10 }}>
            <div className="pill">
              You are in as <b>{player.display_name}</b>
            </div>

            {/* Waiting panel (same for host/player) */}
            {raid?.status === "lobby" && (
              <div className="pill" style={{ borderStyle: "solid" }}>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>⏳ Waiting for host…</div>
                <div style={{ opacity: 0.85, lineHeight: 1.4 }}>
                  Stay on this page. When the host starts the raid, you’ll automatically switch to
                  the battle.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Spacer pushes Start button to bottom */}
        <div style={{ flex: 1, minHeight: 12 }} />

        {/* Bottom bar: big centered START for host only */}
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div style={{ opacity: 0.85 }}>
              Players joined: <b>{joinedCount}</b>
            </div>
            <div style={{ opacity: 0.6, fontSize: 12 }}>
              Room <b>{code}</b>
            </div>
          </div>

          {isHost && onStart && (
            <motion.button
              className="btnPrimary"
              onClick={onStart}
              disabled={!canStart}
              whileHover={canStart ? { y: -1 } : undefined}
              whileTap={canStart ? { scale: 0.99 } : undefined}
              style={{
                width: "min(520px, 100%)",
                justifySelf: "center",
                padding: "16px 18px",
                borderRadius: 18,
                fontSize: 16,
                letterSpacing: 1.5,
                opacity: canStart ? 1 : 0.55,
              }}
              title={canStart ? "Start the raid" : "Need at least 1 player in the room"}
            >
              START RAID
            </motion.button>
          )}

          {isHost && (
            <div style={{ opacity: 0.7, fontSize: 12 }}>
              Tip: you’re the host. When you press Start, everyone switches to the battle view.
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Players list (animated joins) */}
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
