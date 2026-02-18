"use client";

import Image from "next/image";
import { useMemo, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Leaderboard({
  raid,
  players,
  code,
  onDistribute,
}: {
  raid: any;
  players: any[];
  code?: string;
  onDistribute?: () => void;
}) {
  const total = useMemo(() => players.reduce((s, p) => s + (p.total_damage || 0), 0), [players]);
  const defeated = raid?.boss_hp === 0;

  const [rewardStatus, setRewardStatus] = useState<{
    distributed?: number;
    skipped?: number;
    errors?: string[];
  } | null>(null);

  const hasTriggeredDistribute = useRef(false);

  useEffect(() => {
    if (!code || !raid?.id) return;
    if (hasTriggeredDistribute.current) return;
    hasTriggeredDistribute.current = true;

    fetch("/api/raid/distribute-rewards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok) {
          setRewardStatus({
            distributed: data.distributed ?? 0,
            skipped: data.skipped ?? 0,
            errors: data.errors ?? [],
          });
          if (data.distributed > 0) onDistribute?.();
        } else if (data?.errors?.length) {
          setRewardStatus({ errors: data.errors });
        }
      })
      .catch((err) => setRewardStatus({ errors: [String(err)] }));
  }, [code, raid?.id]);

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
              width: defeated ? 22 : 18,
              height: defeated ? 22 : 18,
              filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.45))",
            }}
          >
            {defeated ? (
              <span style={{ position: "relative", display: "block", width: "100%", height: "100%" }}>
                <Image src="/PizzaMan.svg" alt="" fill className="object-contain" sizes="22px" />
              </span>
            ) : (
              <span style={{ fontSize: 18 }}>🥀</span>
            )}
          </motion.div>
        ))}
      </div>

      <h2 style={{ marginTop: 0 }}>🏆 Leaderboard</h2>
      <div style={{ opacity: 0.8, marginBottom: 12 }}>
        Boss: <b>{raid?.boss_name}</b> — Result:{" "}
        <b>{defeated ? "DEFEATED" : "TIME UP"}</b>
      </div>
      {rewardStatus && (
        <div style={{ marginBottom: 12, fontSize: 12, opacity: 0.9 }}>
          {rewardStatus.distributed !== undefined && rewardStatus.distributed > 0 ? (
            <span style={{ color: "#22c55e" }}>
              ✓ {rewardStatus.distributed} player(s) received 0.1 MON
            </span>
          ) : rewardStatus.errors?.length ? (
            <span style={{ color: "#f59e0b" }}>
              Reward issue: {rewardStatus.errors[0]}
            </span>
          ) : rewardStatus.skipped !== undefined && rewardStatus.skipped > 0 ? (
            <span className="muted">
              No wallets to send to ({rewardStatus.skipped} skipped)
            </span>
          ) : null}
        </div>
      )}

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
            <div className="lbReward">0.1 MON</div>
          </motion.div>
        ))}

        {players.length === 0 && <div className="muted">No players.</div>}
      </div>
    </motion.div>
  );
}
