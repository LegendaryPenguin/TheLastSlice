"use client";

import { useState } from "react";
import CopyableAddress from "@/components/CopyableAddress";

export default function Lobby({
  mode,
  code,
  raid,
  player,
  players,
  walletAddress,
  onJoin,
  onStart,
  isHost,
}: {
  mode: "join" | "lobby";
  code: string;
  raid: any;
  player: any;
  players: any[];
  walletAddress: string | null;
  onJoin: (f: string, l: string, wallet: string) => void;
  onStart: () => void;
  isHost: boolean;
}) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");

  return (
    <div className="grid2">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Lobby</h2>
        <p style={{ opacity: 0.8 }}>
          Join with your name. Your wallet will be saved when you join. Once enough people join, host starts the battle.
        </p>

        {!player && (
          <div className="form">
            <input placeholder="First Name" value={first} onChange={(e) => setFirst(e.target.value)} />
            <input placeholder="Last Name" value={last} onChange={(e) => setLast(e.target.value)} />
            <button
              className="btnPrimary"
              onClick={() => walletAddress && onJoin(first, last, walletAddress)}
              disabled={!walletAddress}
              title={!walletAddress ? "Creating wallet..." : undefined}
            >
              {walletAddress ? `Join Room ${code}` : "Creating wallet..."}
            </button>
          </div>
        )}

        {player && (
          <div className="pill" style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
            <span>You are in as <b>{player.display_name}</b></span>
            {player.wallet && (
              <CopyableAddress address={player.wallet} label="wallet" style={{ marginTop: 4 }} />
            )}
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
            <div key={p.id} className="row" style={{ flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <div className="name">{p.display_name}</div>
                <div className="muted">DMG {p.total_damage}</div>
              </div>
              {p.wallet && (
                <CopyableAddress address={p.wallet} style={{ padding: "4px 8px", fontSize: 11 }} />
              )}
            </div>
          ))}
          {players.length === 0 && <div className="muted">No one joined yet.</div>}
        </div>
      </div>
    </div>
  );
}
