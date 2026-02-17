"use client";

import { useState } from "react";

export default function Lobby({
  mode,
  code,
  raid,
  player,
  players,
  onJoin,
  onStart,
  isHost,
}: {
  mode: "join" | "lobby";
  code: string;
  raid: any;
  player: any;
  players: any[];
  onJoin: (f: string, l: string, t: string) => void;
  onStart: () => void;
  isHost: boolean;
}) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [tag, setTag] = useState("");

  return (
    <div className="grid2">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Lobby</h2>
        <p style={{ opacity: 0.8 }}>
          Join with your name + 5-digit tag. Once enough people join, host starts the battle.
        </p>

        {!player && (
          <div className="form">
            <input placeholder="First Name" value={first} onChange={(e) => setFirst(e.target.value)} />
            <input placeholder="Last Name" value={last} onChange={(e) => setLast(e.target.value)} />
            <input placeholder="5-digit tag (e.g. 12345)" value={tag} onChange={(e) => setTag(e.target.value)} />
            <button className="btnPrimary" onClick={() => onJoin(first, last, tag)}>
              Join Room {code}
            </button>
          </div>
        )}

        {player && (
          <div className="pill">
            You are in as <b>{player.display_name}</b>
          </div>
        )}

        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button
              className="btnPrimary"
              onClick={onStart}
              disabled={!raid || raid?.status !== "lobby" || players.length < 1}
              title="Start when ready"
            >
              Start Battle
            </button>
            <span style={{ opacity: 0.75, fontSize: 12 }}>
              Players joined: <b>{players.length}</b>
            </span>
          </div>
          <div style={{ opacity: 0.7, fontSize: 12, marginTop: 8 }}>
            Tip: project this page for the audience. When you press Start, everyone switches to the battle view.
          </div>
        </div>
      </div>

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
