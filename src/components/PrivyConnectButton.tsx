"use client";

import { useState } from "react";
import { usePrivy, useGuestAccounts, useWallets } from "@privy-io/react-auth";
import CopyableAddress from "@/components/CopyableAddress";
import { markLoggedOut, clearLoggedOut } from "@/components/GuestAccountCreator";

export default function PrivyConnectButton() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { createGuestAccount } = useGuestAccounts();
  const { wallets } = useWallets();
  const [guestLoading, setGuestLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const wallet = wallets.find((w) => w.walletClientType === "privy");

  if (!ready) {
    return (
      <div style={{ padding: "8px 14px", borderRadius: 12, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
        Loading...
      </div>
    );
  }

  if (authenticated && user) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {wallet?.address && (
          <CopyableAddress address={wallet.address} label="wallet" />
        )}
        <button
          type="button"
          onClick={async () => {
            if (logoutLoading) return;
            setLogoutLoading(true);
            markLoggedOut();
            try {
              await logout();
            } catch {
              clearLoggedOut();
            } finally {
              setLogoutLoading(false);
            }
          }}
          className="btn"
          style={{ padding: "8px 12px", fontSize: 12 }}
          disabled={logoutLoading}
        >
          {logoutLoading ? "..." : "Disconnect"}
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
        style={{ padding: "10px 16px", fontSize: 13, background: "rgba(34,197,94,0.25)", borderColor: "rgba(34,197,94,0.5)" }}
        disabled={guestLoading}
      >
        {guestLoading ? "..." : "Continue as Guest"}
      </button>
    </div>
  );
}
