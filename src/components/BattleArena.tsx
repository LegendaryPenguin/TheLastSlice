"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Move } from "@/lib/moves";
import { clamp } from "@/lib/utils";
import CopyableAddress from "@/components/CopyableAddress";

function hpColor(pct: number) {
  if (pct > 0.5) return "#22c55e";
  if (pct > 0.2) return "#f59e0b";
  return "#ef4444";
}

export default function BattleArena({
  code,
  raid,
  player,
  players,
  attacks,
  moves,
  onAttack,
}: {
  code: string;
  raid: any;
  player: any;
  players: any[];
  attacks: any[];
  moves: Move[];
  onAttack: (moveId: number) => Promise<void> | void;
}) {
  const [shake, setShake] = useState(false);
  const [flashBoss, setFlashBoss] = useState(false);

  // Local UI energy (server is authoritative; this is just smooth UX)
  const [localEnergy, setLocalEnergy] = useState<number>(player?.energy ?? 100);
  useEffect(() => setLocalEnergy(player?.energy ?? 100), [player?.energy]);

  // Smooth regen animation for the bar (does NOT change server energy)
  useEffect(() => {
    const id = setInterval(() => {
      setLocalEnergy((e) => clamp(e + 2, 0, 100));
    }, 80);
    return () => clearInterval(id);
  }, []);

  const bossPct = useMemo(() => {
    if (!raid) return 1;
    return clamp(raid.boss_hp / raid.boss_hp_max, 0, 1);
  }, [raid]);

  const latestAttack = attacks?.[0] ?? null;

  const endsIn = useMemo(() => {
    if (!raid?.ends_at) return null;
    const ms = new Date(raid.ends_at).getTime() - Date.now();
    return Math.max(0, Math.floor(ms / 1000));
  }, [raid?.ends_at, raid?.boss_hp, raid?.status]);

  // Boss reaction when a new attack arrives
  const lastAttackId = useRef<string | null>(null);
  useEffect(() => {
    if (!latestAttack?.id) return;
    if (lastAttackId.current === latestAttack.id) return;
    lastAttackId.current = latestAttack.id;

    setFlashBoss(true);
    setShake(true);
    const t1 = setTimeout(() => setFlashBoss(false), 180);
    const t2 = setTimeout(() => setShake(false), 250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [latestAttack?.id]);

  async function doMove(m: Move) {
    if (!player) return;

    // optimistic local drop for snappy feel
    setLocalEnergy((e) => Math.max(0, e - m.cost));

    try {
      await onAttack(m.id);
    } catch {
      // if attack fails, UI will correct on next refresh
    }
  }

  return (
    <div className="grid2" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
      {/* LEFT: Battle */}
      <div className={`battleShell ${shake ? "shake" : ""}`}>
        <div className="battleField">
          <div className="bgBands" />
          <div className="bgScanlines" />

          {/* Enemy HUD */}
          <div className="hud enemyHud">
            <div className="hudTop">
              <div>
                <div className="hudTitle">{raid?.boss_name ?? "Boss"}</div>
                <div className="hudSub">RAID BOSS</div>
              </div>
              <div className="hudSub">⏱ {endsIn ?? "—"}s</div>
            </div>

            <div className="hpRow">
              <span className="hpLabel">HP</span>
              <div className="hpOuter">
                <div
                  className="hpInner"
                  style={{
                    width: `${bossPct * 100}%`,
                    background: hpColor(bossPct),
                  }}
                />
              </div>
            </div>

            <div className="hudSub" style={{ marginTop: 8 }}>
              {raid?.boss_hp}/{raid?.boss_hp_max}
            </div>
          </div>

          {/* Boss */}
          <motion.div
            className={`boss ${flashBoss ? "hitFlash" : ""}`}
            animate={{ scale: flashBoss ? 1.02 : 1 }}
            transition={{ duration: 0.15 }}
          >
            <div className="bossSprite">🍍🍕</div>
            <div className="bossNameplate">PINEAPPLE TITAN</div>
          </motion.div>

          {/* Attack FX overlay tied to real move type */}
          <AnimatePresence>
            {latestAttack && (
              <motion.div
                key={latestAttack.id}
                className={`atkFx atk-${latestAttack.anim_type}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.35 }}
              >
                <div className="atkLabel">
                  {latestAttack.player_name} used <b>{latestAttack.move_name}</b>{" "}
                  <span className={latestAttack.crit ? "critTag" : ""}>
                    -{latestAttack.damage} {latestAttack.crit ? "CRIT!" : ""}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Player HUD */}
          <div className="hud playerHud">
            <div className="hudTop">
              <div>
                <div className="hudTitle">{player?.display_name ?? "You"}</div>
                {player?.wallet && (
                  <CopyableAddress address={player.wallet} style={{ marginTop: 4, padding: "4px 8px", fontSize: 11 }} />
                )}
                <div className="hudSub">ENERGY</div>
              </div>
              <div className="hudSub">Players: {players.length}</div>
            </div>

            <div className="hpRow">
              <span className="hpLabel">EN</span>
              <div className="hpOuter">
                <div
                  className="hpInner"
                  style={{
                    width: `${clamp(localEnergy, 0, 100)}%`,
                    background: "#8b5cf6",
                  }}
                />
              </div>
            </div>

            <div className="hudSub" style={{ marginTop: 10 }}>
              Choose 1 of 4 random attacks (costs energy)
            </div>

            <div className="moveGrid">
              {moves.map((m) => (
                <button
                  key={m.id}
                  className="moveBtn"
                  onClick={() => doMove(m)}
                  disabled={!player || localEnergy < m.cost || raid?.status !== "live"}
                  title={`Cost ${m.cost} | Dmg ${m.minDmg}-${m.maxDmg}`}
                >
                  <div className="moveName">{m.name}</div>
                  <div className="moveMeta">
                    <span>Cost {m.cost}</span>
                    <span>
                      Dmg {m.minDmg}-{m.maxDmg}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Live attacks (scroll) */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Live Attacks</h3>

        <div className="attackFeed">
          {attacks.slice(0, 200).map((a: any) => (
            <div key={a.id} className="attackRow">
              <div className="attackName">{a.player_name}</div>
              <div className="attackMove">{a.move_name}</div>
              <div className={`attackDmg ${a.crit ? "crit" : ""}`}>-{a.damage}</div>
            </div>
          ))}

          {(!attacks || attacks.length === 0) && (
            <div className="muted">No attacks yet.</div>
          )}
        </div>

        <div style={{ marginTop: 12 }} className="muted">
          Room: <b>{code}</b> — Boss HP updates live (when Realtime is enabled).
        </div>
      </div>
    </div>
  );
}
