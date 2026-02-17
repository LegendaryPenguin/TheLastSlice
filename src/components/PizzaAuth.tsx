"use client";

import { useEffect } from "react";
import { usePrivy, useWallets, useGuestAccounts } from "@privy-io/react-auth";

function shortAddr(addr: string) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

/**
 * PizzaAuth
 *
 * Silently creates a guest account + embedded wallet on first load.
 * No login button or modal â€” the user gets a wallet automatically.
 * Displays the wallet address once ready.
 */
export default function PizzaAuth() {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { createGuestAccount } = useGuestAccounts();

  // Auto-create a guest account (and embedded wallet) on first load
  useEffect(() => {
    if (ready && !authenticated) {
      createGuestAccount().catch((err: unknown) =>
        console.warn("[PizzaAuth] createGuestAccount error:", err)
      );
    }
  }, [ready, authenticated, createGuestAccount]);

  // Loading â€” Privy not ready yet or guest account being created
  if (!ready || !authenticated) {
    return (
      <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 20 }}>
        Creating wallet...
      </div>
    );
  }

  const embeddedWallet = wallets.find((w) => w.walletClientType === "privy");

  return (
    <div
      style={{
        marginBottom: 20,
        padding: "12px 16px",
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

      {embeddedWallet ? (
        <code title={embeddedWallet.address} style={{ fontSize: 13 }}>
          {shortAddr(embeddedWallet.address)}
        </code>
      ) : (
        <span style={{ opacity: 0.5 }}>generating...</span>
      )}
    </div>
  );
}