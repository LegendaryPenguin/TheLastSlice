"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useWallets } from "@privy-io/react-auth";

export default function PzzaBalance() {
  const { wallets } = useWallets();
  const wallet = wallets.find((w) => w.walletClientType === "privy");
  const address = wallet?.address ?? null;

  const [display, setDisplay] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) {
      setDisplay(null);
      return;
    }

    let cancelled = false;

    async function fetchBalance() {
      setLoading(true);
      try {
        const res = await fetch("/api/balance?address=" + address);
        const json = await res.json();
        if (!cancelled && json.display != null) {
          setDisplay(json.display);
        }
      } catch {
        // silently ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBalance();
    const id = setInterval(fetchBalance, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [address]);

  if (!address || display === null) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "6px 10px",
        borderRadius: 10,
        border: "1px solid rgba(251,191,36,0.35)",
        background: "rgba(251,191,36,0.1)",
        fontSize: 11,
        fontWeight: 700,
        color: "rgba(251,191,36,0.95)",
        whiteSpace: "nowrap",
        opacity: loading ? 0.7 : 1,
        transition: "opacity 0.2s",
      }}
      title="Your PZZA token balance"
    >
      <Image src="/PizzaMan.svg" alt="" width={14} height={14} className="object-contain" style={{ opacity: 0.9 }} />
      {display} PZZA
    </div>
  );
}