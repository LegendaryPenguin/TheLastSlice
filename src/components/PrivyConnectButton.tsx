"use client";

import { useState, useEffect } from "react";
import { usePrivy, useGuestAccounts } from "@privy-io/react-auth";
import { formatUnits } from "viem";

/** Shorten Privy user ID for display (e.g. "did:privy:abc123xyz" -> "abc123") */
function shortUserId(id: string): string {
  const parts = id.split(":");
  const last = parts[parts.length - 1];
  if (last && last.length >= 6) return last.slice(-8);
  return id.slice(-8) || id;
}

/** Get first EVM wallet address from Privy linked accounts */
function getWalletAddress(user: { linkedAccounts?: Array<{ type?: string; address?: string }> }): string | null {
  const accounts = user?.linkedAccounts ?? [];
  const evm = accounts.find(
    (a) => a?.address && /^0x[a-fA-F0-9]{40}$/.test(String(a.address))
  );
  return evm?.address ?? null;
}

export default function PrivyConnectButton() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { createGuestAccount } = useGuestAccounts();
  const [guestLoading, setGuestLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [monBalance, setMonBalance] = useState<string | null>(null);

  const walletAddress = user ? getWalletAddress(user) : null;

  useEffect(() => {
    if (!walletAddress) {
      setMonBalance(null);
      return;
    }
    let cancelled = false;
    fetch(`/api/balance?address=${encodeURIComponent(walletAddress)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || data.error) return;
        const wei = BigInt(data.wei ?? "0");
        const formatted = parseFloat(formatUnits(wei, 18)).toFixed(4);
        setMonBalance(formatted);
      })
      .catch(() => setMonBalance(null));
    return () => { cancelled = true; };
  }, [walletAddress]);

  if (!ready) {
    return (
      <div
        style={{
          padding: "8px 14px",
          borderRadius: 12,
          background: "rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.6)",
          fontSize: 12,
        }}
      >
        Loading…
      </div>
    );
  }

  if (authenticated && user) {
    const displayId = shortUserId(user.id);
    const label = user.isGuest ? `Guest #${displayId}` : displayId;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            padding: "8px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(0,0,0,0.25)",
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.92)",
          }}
          title={user.id}
        >
          {user.isGuest ? "👤 " : "🔗 "}
          {label}
        </div>
        {walletAddress && (
          <div
            style={{
              padding: "8px 12px",
              borderRadius: 12,
              border: "1px solid rgba(139,92,246,0.4)",
              background: "rgba(139,92,246,0.15)",
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(255,255,255,0.95)",
            }}
            title="MON balance on Monad Testnet"
          >
            {monBalance !== null ? `${monBalance} MON` : "…"}
          </div>
        )}
        <button
          type="button"
          onClick={async () => {
            if (logoutLoading) return;
            setLogoutLoading(true);
            try {
              await logout();
            } finally {
              setLogoutLoading(false);
            }
          }}
          className="btn"
          style={{ padding: "8px 12px", fontSize: 12 }}
          disabled={logoutLoading}
        >
          {logoutLoading ? "…" : "Disconnect"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <button
        type="button"
        onClick={() => login()}
        className="btnPrimary"
        style={{ padding: "10px 16px", fontSize: 13 }}
      >
        Connect Wallet
      </button>
      <button
        type="button"
        onClick={async () => {
          if (guestLoading) return;
          setGuestLoading(true);
          try {
            await createGuestAccount();
          } catch (e) {
            console.error(e);
            alert("Could not create guest account. Try Connect Wallet instead.");
          } finally {
            setGuestLoading(false);
          }
        }}
        className="btn"
        style={{
          padding: "10px 16px",
          fontSize: 13,
          background: "rgba(34,197,94,0.25)",
          borderColor: "rgba(34,197,94,0.5)",
        }}
        disabled={guestLoading}
      >
        {guestLoading ? "…" : "Continue as Guest"}
      </button>
    </div>
  );
}
