"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Leaderboard({ raid, players }: { raid: any; players: any[] }) {
  const total = useMemo(() => players.reduce((s, p) => s + (p.total_damage || 0), 0), [players]);
  const defeated = raid?.boss_hp === 0;

  function rewardUnits(dmg: number) {
    if (total <= 0) return 0;
    return Math.round((100 * dmg) / total);
  }

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 10, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Victory/Defeat overlay burst */}
      <AnimatePresence>
        <motion.div
          key={defeated ? "win" : "lose"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: defeated
              ? "radial-gradient(700px 260px at 40% 0%, rgba(34,197,94,0.20), transparent 60%)"
              : "radial-gradient(700px 260px at 40% 0%, rgba(239,68,68,0.18), transparent 60%)",
          }}
        />
      </AnimatePresence>

      {/* Floating emojis (subtle, on-theme) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: defeated ? 0.55 : 0.25,
        }}
      >
        {Array.from({ length: defeated ? 10 : 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: -220 }}
            transition={{
              duration: 2.2,
              delay: i * 0.08,
              ease: "easeOut",
              repeat: Infinity,
              repeatDelay: 0.8,
            }}
            style={{
              position: "absolute",
              left: `${8 + (i * 9) % 80}%`,
              bottom: -20,
              fontSize: defeated ? 22 : 18,
              filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.45))",
            }}
          >
            {defeated ? "🍕" : "🥀"}
          </motion.div>
        ))}
      </div>

      <h2 style={{ marginTop: 0 }}>🏆 Leaderboard</h2>
      <div style={{ opacity: 0.8, marginBottom: 12 }}>
        Boss: <b>{raid?.boss_name}</b> — Result:{" "}
        <b>{defeated ? "DEFEATED" : "TIME UP"}</b>
      </div>

      <div className="leaderboard">
        <div className="lbHead">
          <div>#</div>
          <div>Player</div>
          <div>Damage</div>
          <div>Reward</div>
        </div>

        {players.map((p, idx) => (
          <motion.div
            className="lbRow"
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, delay: Math.min(0.6, idx * 0.04) }}
          >
            <div className="lbRank">{idx + 1}</div>
            <div className="lbName">{p.display_name}</div>
            <div className="lbDmg">{p.total_damage}</div>
            <div className="lbReward">{rewardUnits(p.total_damage)} / 100</div>
          </motion.div>
        ))}

        {players.length === 0 && <div className="muted">No players.</div>}
      </div>
    </motion.div>
  );
}
