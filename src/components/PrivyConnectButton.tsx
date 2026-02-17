"use client";

import { usePrivy, useGuestAccounts } from "@privy-io/react-auth";

/** Shorten Privy user ID for display (e.g. "did:privy:abc123xyz" -> "abc123") */
function shortUserId(id: string): string {
  const parts = id.split(":");
  const last = parts[parts.length - 1];
  if (last && last.length >= 6) return last.slice(-8);
  return id.slice(-8) || id;
}

export default function PrivyConnectButton() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { createGuestAccount } = useGuestAccounts();

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
        <button
          type="button"
          onClick={() => logout()}
          className="btn"
          style={{ padding: "8px 12px", fontSize: 12 }}
        >
          Disconnect
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
          try {
            await createGuestAccount();
          } catch (e) {
            console.error(e);
            alert("Could not create guest account. Try Connect Wallet instead.");
          }
        }}
        className="btn"
        style={{
          padding: "10px 16px",
          fontSize: 13,
          background: "rgba(34,197,94,0.25)",
          borderColor: "rgba(34,197,94,0.5)",
        }}
      >
        Continue as Guest
      </button>
    </div>
  );
}
