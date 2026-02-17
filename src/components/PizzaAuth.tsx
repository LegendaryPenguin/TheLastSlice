"use client";

import { useEffect } from "react";
import { usePrivy, useWallets, useGuestAccounts } from "@privy-io/react-auth";

function shortAddr(addr: string) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

/**
 * PizzaAuth
 *
 * Silently creates a guest account and embedded wallet on first load.
 * No login/logout UI -- just displays the single Privy wallet address.
 *
 * To get the address anywhere else in the app:
 *   const { wallets } = useWallets();
 *   const address = wallets.find(w => w.walletClientType === "privy")?.address;
 */
export default function PizzaAuth() {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { createGuestAccount } = useGuestAccounts();

  // Silently create a guest account on first load
  useEffect(() => {
    if (ready && !authenticated) {
      createGuestAccount().catch((err: unknown) =>
        console.warn("[PizzaAuth] createGuestAccount error:", err)
      );
    }
  }, [ready, authenticated, createGuestAccount]);

  // The one wallet we care about -- the Privy embedded wallet
  const wallet = wallets.find((w) => w.walletClientType === "privy");

  if (!ready || !authenticated || !wallet) {
    return (
      <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 20 }}>
        Creating wallet...
      </div>
    );
  }

  return (
    <div
      style={{
        marginBottom: 20,
        padding: "10px 14px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 8,
        fontSize: 12,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span
        style={{
          background: "#e63946",
          color: "#fff",
          padding: "2px 8px",
          borderRadius: 4,
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        wallet
      </span>
      <code title={wallet.address} style={{ fontSize: 13 }}>
        {shortAddr(wallet.address)}
      </code>
    </div>
  );
}