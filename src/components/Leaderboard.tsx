"use client";

import Image from "next/image";
import { useMemo } from "react";
import { motion } from "framer-motion";
import CopyableAddress from "@/components/CopyableAddress";

const MEDAL_COLORS = [
  { bg: "rgba(251,191,36,0.18)",  border: "rgba(251,191,36,0.55)",  text: "#fbbf24", bar: "linear-gradient(90deg,#f59e0b,#fbbf24)", label: "1ST" },
  { bg: "rgba(156,163,175,0.15)", border: "rgba(156,163,175,0.45)", text: "#9ca3af", bar: "linear-gradient(90deg,#6b7280,#9ca3af)", label: "2ND" },
  { bg: "rgba(180,120,60,0.15)",  border: "rgba(180,120,60,0.45)",  text: "#c97c3a", bar: "linear-gradient(90deg,#92400e,#b4783c)", label: "3RD" },
];
const DEFAULT_BAR = "linear-gradient(90deg,#6d28d9,#8b5cf6)";

export default function Leaderboard({ raid, players }: { raid: any; players: any[] }) {
  const total = useMemo(() => players.reduce((s, p) => s + (p.total_damage || 0), 0), [players]);
  const defeated = raid?.boss_hp === 0;

  function rewardUnits(dmg: number) {
    if (total <= 0) return 0;
    return Math.round((100 * dmg) / total);
  }

  function damagePct(dmg: number) {
    if (total <= 0) return 0;
    return Math.round((dmg / total) * 100);
  }

  return (
    <div className="lbShell">
      {defeated && (
        <div aria-hidden className="lbParticles">
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.div
              key={i}
              className="lbParticle"
              initial={{ opacity: 0, y: 60, x: 0 }}
              animate={{ opacity: [0, 0.9, 0], y: -300, x: (i % 2 === 0 ? 1 : -1) * (10 + (i * 7) % 40) }}
              transition={{ duration: 2.8 + (i % 4) * 0.4, delay: i * 0.18, repeat: Infinity, repeatDelay: 1.2, ease: "easeOut" }}
              style={{ left: `${5 + (i * 6.5) % 88}%` }}
            >
              <Image src="/PizzaMan.svg" alt="" width={20} height={20} className="object-contain" />
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        className={`lbBanner ${defeated ? "lbBannerWin" : "lbBannerLose"}`}
        initial={{ opacity: 0, y: -24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="lbBannerInner">
          <motion.div
            className="lbBossWrap"
            animate={defeated ? { rotate: [0, -8, 8, -6, 0] } : { opacity: [1, 0.5, 1] }}
            transition={{ duration: defeated ? 0.6 : 2.2, delay: 0.4, repeat: defeated ? 0 : Infinity }}
          >
            <Image src="/PizzaMan.svg" alt="Boss" width={72} height={72} className="object-contain"
              style={{ filter: defeated ? "grayscale(1) opacity(0.5)" : "none" }} />
            {defeated && <div className="lbDefeatedX">X</div>}
          </motion.div>
          <div className="lbBannerText">
            <motion.div className="lbResultLabel"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.25 }}>
              {defeated ? "BOSS DEFEATED!" : "TIME'S UP"}
            </motion.div>
            <div className="lbBossName">{raid?.boss_name ?? "Pizza Titan"}</div>
            <div className="lbBossHp">
              {defeated
                ? "The Pizza Titan has fallen. PZZA rewards are being distributed."
                : `Boss survived with ${raid?.boss_hp?.toLocaleString()} HP remaining.`}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div className="lbCard"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}>

        <div className="lbTableHead">
          <div>#</div>
          <div>Player</div>
          <div>Contribution</div>
          <div className="lbColRight">PZZA</div>
        </div>

        {players.map((p, idx) => {
          const medal = MEDAL_COLORS[idx] ?? null;
          const pct = damagePct(p.total_damage);
          const reward = rewardUnits(p.total_damage);
          const barColor = medal ? medal.bar : DEFAULT_BAR;
          return (
            <motion.div key={p.id}
              className={`lbTableRow ${idx === 0 ? "lbRowFirst" : ""}`}
              initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28, delay: 0.35 + idx * 0.07, ease: "easeOut" }}
              style={medal ? { background: medal.bg, borderColor: medal.border } : {}}>

              {/* Col 1: Rank */}
              <div className="lbTableRank" style={medal ? { color: medal.text } : {}}>
                {medal
                  ? <span className="lbMedalLabel">{medal.label}</span>
                  : <span className="lbRankNum">{idx + 1}</span>}
              </div>

              {/* Col 2: Player name + wallet */}
              <div className="lbTablePlayer">
                <div className="lbTableName" style={idx === 0 ? { color: "#fbbf24" } : {}}>{p.display_name}</div>
                {p.wallet && <CopyableAddress address={p.wallet} style={{ padding: "3px 7px", fontSize: 10 }} />}
              </div>

              {/* Col 3: Contribution bar + % */}
              <div className="lbContrib">
                <div className="lbDmgBarWrap">
                  <motion.div className="lbDmgBar"
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, delay: 0.5 + idx * 0.07, ease: "easeOut" }}
                    style={{ background: barColor }} />
                </div>
                <div className="lbDmgLabel">{p.total_damage.toLocaleString()} dmg &middot; {pct}%</div>
              </div>

              {/* Col 4: PZZA reward */}
              <div className="lbTableReward">
                {reward > 0
                  ? <><span className="lbPzzaAmount">{reward}</span><span className="lbPzzaLabel">PZZA</span></>
                  : <span className="lbPzzaNone">-</span>}
              </div>
            </motion.div>
          );
        })}

        {players.length === 0 && (
          <div style={{ padding: "24px", textAlign: "center", opacity: 0.6 }}>No players.</div>
        )}
      </motion.div>
    </div>
  );
}
