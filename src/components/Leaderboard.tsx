"use client";

import { useMemo } from "react";
import CopyableAddress from "@/components/CopyableAddress";

export default function Leaderboard({ raid, players }: { raid: any; players: any[] }) {
  const total = useMemo(() => players.reduce((s, p) => s + (p.total_damage || 0), 0), [players]);

  function rewardUnits(dmg: number) {
    if (total <= 0) return 0;
    return Math.round((100 * dmg) / total);
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>🏆 Leaderboard</h2>
      <div style={{ opacity: 0.8, marginBottom: 12 }}>
        Boss: <b>{raid?.boss_name}</b> — Result: <b>{raid?.boss_hp === 0 ? "DEFEATED" : "TIME UP"}</b>
      </div>

      <div className="leaderboard">
        <div className="lbHead">
          <div>#</div>
          <div>Player</div>
          <div>Damage</div>
          <div>Reward</div>
        </div>

        {players.map((p, idx) => (
          <div className="lbRow" key={p.id}>
            <div className="lbRank">{idx + 1}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
              <div className="lbName">{p.display_name}</div>
              {p.wallet && (
                <CopyableAddress address={p.wallet} style={{ padding: "4px 8px", fontSize: 11 }} />
              )}
            </div>
            <div className="lbDmg">{p.total_damage}</div>
            <div className="lbReward">{rewardUnits(p.total_damage)} / 100</div>
          </div>
        ))}

        {players.length === 0 && <div className="muted">No players.</div>}
      </div>
    </div>
  );
}
