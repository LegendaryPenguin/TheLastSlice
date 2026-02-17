"use client";

import { useMemo, useState } from "react";

export default function Lobby({
  mode,
  code,
  raid,
  player,
  players,
  onJoin,
  onStart,
  canStart = false,
}: {
  mode: "join" | "lobby";
  code: string;
  raid: any;
  player: any;
  players: any[];
  onJoin: (f: string, l: string, t: string) => void;
  onStart?: () => void;
  canStart?: boolean; // ✅ host-only
}) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [tag, setTag] = useState("");

  const joinedCount = players?.length ?? 0;

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/raid/${code}`;
  }, [code]);

  return (
    <div className="grid2">
      {/* LEFT */}
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Lobby</h2>

        <p style={{ opacity: 0.8 }}>
          Join with your name + 5-digit tag. Once enough people join, the host starts the battle.
        </p>

        {/* JOIN FORM */}
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

            <div className="pill" style={{ marginTop: 12 }}>
              <div style={{ opacity: 0.85, lineHeight: 1.6 }}>
                Share with audience: <b style={{ wordBreak: "break-all" }}>{shareUrl}</b>
              </div>
            </div>
          </div>
        )}

        {/* WAITING VIEW */}
        {player && (
          <>
            <div className="pill">
              You are in as <b>{player.display_name}</b>
            </div>

            <div className="pill" style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>⏳ Waiting for host…</div>
              <div style={{ opacity: 0.85, lineHeight: 1.6 }}>
                Stay on this page. When the host starts the raid, you’ll automatically switch to the battle.
              </div>
            </div>

            <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              {/* ✅ Host-only Start button */}
              {canStart && (
                <button
                  className="btnPrimary"
                  onClick={onStart}
                  disabled={!raid || raid?.status !== "lobby" || joinedCount < 1}
                  title="Start when ready"
                >
                  Start Raid
                </button>
              )}

              <span style={{ opacity: 0.75, fontSize: 12 }}>
                Players joined: <b>{joinedCount}</b>
              </span>

              {raid?.status && (
                <span style={{ opacity: 0.75, fontSize: 12 }}>
                  Status: <b>{raid.status}</b>
                </span>
              )}
            </div>

            {canStart && (
              <div style={{ opacity: 0.7, fontSize: 12, marginTop: 10 }}>
                Tip: You’re the host. When you press Start, everyone switches to the battle view.
              </div>
            )}
          </>
        )}
      </div>

      {/* RIGHT */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Players</h3>
        <div className="list">
          {players.map((p) => (
            <div key={p.id} className="row">
              <div className="name">{p.display_name}</div>
              <div className="muted">DMG {p.total_damage}</div>
            </div>
          ))}
          {players.length === 0 && <div className="muted">No one joined yet.</div>}
        </div>
      </div>
    </div>
  );
}
