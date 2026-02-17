"use client";

import { useEffect } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";

function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}â€¦${addr.slice(-4)}`;
}



export default function PizzaAuth() {
  const { ready, authenticated, user, login, logout, createWallet } =
    usePrivy();
  const { wallets } = useWallets();

  useEffect(() => {
    if (!ready || !authenticated || !user) return;

    const hasEmbedded = wallets.some(
      (w) => w.walletClientType === "privy"
    );

    if (!hasEmbedded) {
      createWallet().catch((err) =>
        console.warn("[PizzaAuth] createWallet error:", err)
      );
    }
  }, [ready, authenticated, user, wallets, createWallet]);

  // â”€â”€ Not ready yet â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (!ready) {
    return (
      <div className="pizza-auth pizza-auth--loading">
        <span className="pizza-auth__spinner" aria-label="Loading..." />
      </div>
    );
  }

  // â”€â”€ Signed-out state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (!authenticated) {
    return (
      <div className="pizza-auth">
        <button className="pizza-auth__btn pizza-auth__btn--login" onClick={login}>
          Login
        </button>
      </div>
    );
  }

  // â”€â”€ Signed-in state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div className="pizza-auth pizza-auth--signed-in">
      {/* User ID */}
      <div className="pizza-auth__row">
        <span className="pizza-auth__label">User ID</span>
        <code className="pizza-auth__value pizza-auth__value--id">
          {user?.id ?? "â€”"}
        </code>
      </div>

      {/* Wallet list */}
      <div className="pizza-auth__wallets">
        <span className="pizza-auth__label">
          Wallets ({wallets.length})
        </span>

        {wallets.length === 0 ? (
          <p className="pizza-auth__empty">No wallets linked yet.</p>
        ) : (
          <ul className="pizza-auth__wallet-list">
            {wallets.map((w) => (
              <li key={w.address} className="pizza-auth__wallet-item">
                <span
                  className={
                    w.walletClientType === "privy"
                      ? "pizza-auth__wallet-badge pizza-auth__wallet-badge--embedded"
                      : "pizza-auth__wallet-badge pizza-auth__wallet-badge--external"
                  }
                >
                  {w.walletClientType === "privy" ? "embedded" : w.walletClientType}
                </span>
                <code className="pizza-auth__value">{shortAddr(w.address)}</code>
                <span className="pizza-auth__chain">chain {w.chainId}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Logout */}
      <button
        className="pizza-auth__btn pizza-auth__btn--logout"
        onClick={() => logout()}
      >
        Logout
      </button>
    </div>
  );
}
