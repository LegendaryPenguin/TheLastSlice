"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

function normalizeCode(raw: string) {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
}

export default function HomePage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const canJoin = useMemo(() => normalizeCode(code).length >= 4, [code]);

  async function onHost() {
  try {
    const res = await fetch("/api/raid/create", { method: "POST" });
    const json = await res.json();
    if (!res.ok || json?.error) return alert(json?.error || "Create raid failed.");
    router.push(`/host/${json.raid.code}`);
  } catch (e: any) {
    alert(e?.message || "Create raid failed.");
  }
}



function onJoin() {
  const c = normalizeCode(code);
  if (!c) return;
  router.push(`/raid/${c}`);
}


  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "20px",
      }}
    >
      <motion.section
        initial={{ opacity: 0, y: 14, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        style={{
          width: "min(880px, 100%)",
          borderRadius: 22,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(0,0,0,0.35)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
          backdropFilter: "blur(10px)",
          padding: "22px",
        }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div
            aria-hidden
            style={{
              width: 58,
              height: 58,
              borderRadius: 16,
              display: "grid",
              placeItems: "center",
              border: "1px solid rgba(255,255,255,0.14)",
              background:
                "radial-gradient(120px 120px at 30% 20%, rgba(139,92,246,0.45), rgba(0,0,0,0.35))",
              boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
              flex: "0 0 auto",
            }}
          >
            <span style={{ fontSize: 28 }}>🍕</span>
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 44,
                lineHeight: 1,
                fontWeight: 900,
                letterSpacing: 1,
                color: "rgba(255,255,255,0.95)",
              }}
            >
              Pizza Raid
            </div>
            <div style={{ marginTop: 6, color: "rgba(255,255,255,0.70)" }}>
              Create a room or join with a code.
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.12)",
            background:
              "radial-gradient(700px 260px at 30% 30%, rgba(139,92,246,0.22), rgba(0,0,0,0.25))",
            padding: 18,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 14,
            overflow: "hidden",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: 1,
                color: "rgba(255,255,255,0.92)",
              }}
            >
              PINEAPPLE PIZZA TITAN
            </div>
            <div style={{ marginTop: 6, color: "rgba(255,255,255,0.65)" }}>
              Raid Boss
            </div>
          </div>

          <motion.div
            aria-hidden
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              display: "grid",
              placeItems: "center",
              width: 120,
              height: 74,
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(0,0,0,0.22)",
              boxShadow: "0 16px 30px rgba(0,0,0,0.35)",
              flex: "0 0 auto",
            }}
          >
            <div style={{ fontSize: 34 }}>🍍🍕</div>
          </motion.div>
        </div>

        <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
          <button
            onClick={onHost}
            style={{
              width: "100%",
              padding: "16px 18px",
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,0.14)",
              background:
                "linear-gradient(180deg, rgba(168,85,247,0.95), rgba(88,28,135,0.85))",
              color: "rgba(255,255,255,0.95)",
              fontWeight: 900,
              letterSpacing: 1,
              textTransform: "uppercase",
              boxShadow: "0 18px 36px rgba(0,0,0,0.45)",
              cursor: "pointer",
            }}
          >
            Host a Raid
          </button>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              gap: 12,
              color: "rgba(255,255,255,0.65)",
              fontWeight: 900,
              letterSpacing: 2,
            }}
          >
            <div style={{ height: 1, background: "rgba(255,255,255,0.12)" }} />
            <div>OR</div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.12)" }} />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 12,
            }}
          >
            <div style={{ display: "grid", gap: 8 }}>
              <div
                style={{
                  fontWeight: 900,
                  letterSpacing: 1,
                  color: "rgba(255,255,255,0.80)",
                  textTransform: "uppercase",
                  fontSize: 12,
                }}
              >
                Room Code
              </div>

              <input
                placeholder="e.g. WFB6PZ"
                value={code}
                onChange={(e) => setCode(normalizeCode(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onJoin();
                }}
                inputMode="text"
                autoCapitalize="characters"
                autoCorrect="off"
                style={{
                  width: "100%",
                  padding: "14px 14px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(0,0,0,0.32)",
                  color: "rgba(255,255,255,0.92)",
                  outline: "none",
                  fontSize: 16,
                }}
              />
            </div>

            <button
              onClick={onJoin}
              disabled={!canJoin}
              style={{
                alignSelf: "end",
                padding: "14px 20px",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "linear-gradient(180deg, rgba(34,197,94,0.40), rgba(0,0,0,0.25))",
                color: "rgba(255,255,255,0.92)",
                fontWeight: 900,
                letterSpacing: 1,
                textTransform: "uppercase",
                boxShadow: "0 18px 36px rgba(0,0,0,0.35)",
                cursor: canJoin ? "pointer" : "not-allowed",
                opacity: canJoin ? 1 : 0.55,
                minWidth: 120,
              }}
            >
              Join
            </button>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
