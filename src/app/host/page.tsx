"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function HostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [raid, setRaid] = useState<any>(null);

  const raidUrl = useMemo(() => {
    if (!raid?.code) return "";
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/raid/${raid.code}`;
  }, [raid]);

  async function createRaid() {
    setLoading(true);
    try {
      const res = await fetch("/api/raid/create", { method: "POST" });
      const json = await res.json();

      setLoading(false);

      if (!res.ok || json?.error) {
        return alert(json?.error || "Create raid failed.");
      }

      setRaid(json.raid);

      // ✅ IMPORTANT: host must go to host lobby route, not player route
      router.push(`/host/${json.raid.code}`);
    } catch (e: any) {
      setLoading(false);
      alert(e?.message || "Create raid failed.");
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Host a Raid</h1>
      <p style={{ opacity: 0.8, marginBottom: 18 }}>
        Create a room code, then share it with everyone.
      </p>

      <button className="btnPrimary" onClick={createRaid} disabled={loading}>
        {loading ? "Creating..." : "Create Raid"}
      </button>

      {raid?.code && (
        <div style={{ marginTop: 18 }}>
          <div style={{ marginBottom: 6 }}>
            Room code: <b>{raid.code}</b>
          </div>
          <div style={{ opacity: 0.8, wordBreak: "break-all" }}>{raidUrl}</div>
        </div>
      )}
    </main>
  );
}
