"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Move } from "@/lib/moves";
import { clamp } from "@/lib/utils";

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

  const [localEnergy, setLocalEnergy] = useState<number>(player?.energy ?? 100);

  useEffect(() => {
    setLocalEnergy(player?.energy ?? 100);
  }, [player?.energy]);

  // Smooth regen animation (client-only UI)
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

  // Live timer tick (updates every second)
  const [nowTick, setNowTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setNowTick((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const endsIn = useMemo(() => {
    if (!raid?.ends_at || !raid?.started_at) return null;
    const t0 = new Date(raid.started_at).getTime();
    const dt = Date.now() - t0;
    // Don't start timer until countdown + boss intro ends (4.2s)
    if (dt < 4200) return null;
    const ms = new Date(raid.ends_at).getTime() - Date.now();
    return Math.max(0, Math.floor(ms / 1000));
  }, [raid?.ends_at, raid?.started_at, nowTick]);

  // Deduplicate attacks
  const attacksDeduped = useMemo(() => {
    const seen = new Set<string>();
    const out: any[] = [];
    for (const a of attacks ?? []) {
      const k = String(a.id);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(a);
    }
    return out;
  }, [attacks]);

  // Boss reaction animation
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

    // optimistic energy drop
    setLocalEnergy((e) => Math.max(0, e - m.cost));

    try {
      await onAttack(m.id);
    } catch {}
  }

  /**
   * ✅ Synced "Raid Starting" countdown using started_at.
   * Everyone sees the same countdown because it’s based on server time stored in DB.
   */
  const startOverlay = useMemo(() => {
    if (!raid?.started_at) return { show: false, phase: "none" as const, n: 0 };
    const t0 = new Date(raid.started_at).getTime();
    const dt = Date.now() - t0;

    // Countdown window: first 3000ms
    if (dt < 3000) {
      const remaining = 3 - Math.floor(dt / 1000); // 3,2,1
      return { show: true, phase: "countdown" as const, n: clamp(remaining, 1, 3) };
    }

    // Boss intro window: next 1200ms
    if (dt >= 3000 && dt < 4200) {
      return { show: true, phase: "boss" as const, n: 0 };
    }

    return { show: false, phase: "none" as const, n: 0 };
  }, [raid?.started_at, nowTick]);

  return (
    <div className="grid2">
      {/* LEFT — BATTLE */}
      <div className={`battleShell ${shake ? "shake" : ""}`}>
        <div className="battleField">
          <div className="bgBands" />
          <div className="bgScanlines" />

          {/* ✅ START OVERLAY (countdown + boss intro) */}
          <AnimatePresence>
            {startOverlay.show && (
              <motion.div
                key={startOverlay.phase}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 10,
                  display: "grid",
                  placeItems: "center",
                  pointerEvents: "none",
                  background: "radial-gradient(700px 280px at 50% 40%, rgba(139,92,246,0.25), rgba(0,0,0,0.55))",
                }}
              >
                {startOverlay.phase === "countdown" ? (
                  <div
                    style={{
                      display: "grid",
                      placeItems: "center",
                      gap: 10,
                      textAlign: "center",
                      padding: 18,
                      borderRadius: 18,
                      border: "1px solid rgba(255,255,255,0.14)",
                      background: "rgba(0,0,0,0.35)",
                      boxShadow: "0 18px 48px rgba(0,0,0,0.55)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div style={{ opacity: 0.8, letterSpacing: 2, fontWeight: 900 }}>
                      RAID STARTING
                    </div>
                    <motion.div
                      key={startOverlay.n}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.18 }}
                      style={{
                        fontSize: 74,
                        fontWeight: 900,
                        letterSpacing: 2,
                        textShadow: "0 10px 30px rgba(0,0,0,0.55)",
                      }}
                    >
                      {startOverlay.n}
                    </motion.div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      placeItems: "center",
                      gap: 12,
                      textAlign: "center",
                      padding: 18,
                      borderRadius: 18,
                      border: "1px solid rgba(255,255,255,0.14)",
                      background: "rgba(0,0,0,0.35)",
                      boxShadow: "0 18px 48px rgba(0,0,0,0.55)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div style={{ fontSize: 44 }}>🍍🍕</div>
                    <div style={{ fontWeight: 900, letterSpacing: 1 }}>
                      PINEAPPLE TITAN APPEARS
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enemy HUD */}
          <div className="hud enemyHud">
            <div className="hudTop">
              <div>
                <div className="hudTitle">{raid?.boss_name ?? "Boss"}</div>
                <div className="hudSub">RAID BOSS</div>
              </div>

              <div className="hudSub">⏱ {endsIn !== null ? `${endsIn}s` : "—"}</div>
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

          {/* BOSS + ATTACK FX (stacked so animations appear on top of sprite) */}
          <div className="bossRow">
            <motion.div
              className={`boss ${flashBoss ? "hitFlash" : ""}`}
              animate={{ scale: flashBoss ? 1.02 : 1 }}
              transition={{ duration: 0.15 }}
            >
              <div className="bossSprite">🍍🍕</div>
              <div className="bossNameplate">PINEAPPLE TITAN</div>
            </motion.div>

            {/* ATTACK FX — positioned over the boss */}
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
          </div>

          {/* PLAYER HUD */}
          <div className="hud playerHud">
            <div className="hudTop">
              <div>
                <div className="hudTitle">{player?.display_name ?? "You"}</div>
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
              Choose 1 of 4 random attacks
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

      {/* RIGHT — LIVE ATTACKS */}
      <div className="card cardCol">
        <h3 style={{ marginTop: 0 }}>Live Attacks</h3>

        <div className="attackFeed">
          {attacksDeduped.slice(0, 200).map((a: any) => (
            <div key={`${a.id}-${a.created_at ?? ""}`} className="attackRow">
              <div className="attackName">{a.player_name}</div>
              <div className="attackMove">{a.move_name}</div>
              <div className={`attackDmg ${a.crit ? "crit" : ""}`}>-{a.damage}</div>
            </div>
          ))}

          {attacksDeduped.length === 0 && <div className="muted">No attacks yet.</div>}
        </div>

        <div style={{ marginTop: 12 }} className="muted">
          Room: <b>{code}</b> — Boss HP updates live.
        </div>
      </div>
    </div>
  );
}
