"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [code, setCode] = useState("");
  const router = useRouter();

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 30, marginBottom: 8 }}>🍍🍕 Pizza Raid</h1>
      <p style={{ opacity: 0.8, marginBottom: 20 }}>
        Create a room or join with a code.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          className="btnPrimary"
          onClick={() => router.push("/host")}
        >
          Host a Raid
        </button>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter room code (e.g. WFBB6PZ)"
            style={{ width: 260 }}
          />
          <button
            className="btn"
            onClick={() => {
              const c = code.trim().toUpperCase();
              if (!c) return;
              router.push(`/raid/${c}`);
            }}
          >
            Join
          </button>
        </div>
      </div>
    </main>
  );
}
