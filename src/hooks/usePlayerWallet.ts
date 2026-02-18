import { useWallets } from "@privy-io/react-auth";

export function usePlayerWallet() {
  const { wallets } = useWallets();
  const wallet = wallets.find(w => w.walletClientType === "privy");
  return {
    address: wallet?.address ?? null,
    wallet: wallet ?? null,
  };
}