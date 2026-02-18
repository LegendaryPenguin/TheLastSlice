"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import CopyableAddress from "@/components/CopyableAddress";

/**
 * PizzaAuth
 *
 * Silently creates a guest account and embedded wallet on first load.
 * No login/logout UI -- just displays the single Privy wallet address (copyable).
 *
 * To get the address anywhere else in the app:
 *   const { wallets } = useWallets();
 *   const address = wallets.find(w => w.walletClientType === "privy")?.address;
 */
export default function PizzaAuth() {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();

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
    <div style={{ marginBottom: 20 }}>
      <CopyableAddress address={wallet.address} label="wallet" />
    </div>
  );
}