"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { defineChain } from "viem";

/**
 * Monad Testnet chain definition
 * Chain ID : 10143
 * RPC      : https://testnet-rpc.monad.xyz
 * Explorer : https://testnet.monadexplorer.com
 */
const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "Monad Explorer",
      url: "https://testnet.monadexplorer.com",
    },
  },
  testnet: true,
});

/**
 * PrivyProviderWrapper
 *
 * Wrap your layout.tsx (or page.tsx) with this component.
 * Set NEXT_PUBLIC_PRIVY_APP_ID in your .env.local.
 *
 * Example usage in layout.tsx:
 *
 *   import PrivyProviderWrapper from "@/components/PrivyProviderWrapper";
 *
 *   export default function RootLayout({ children }: { children: React.ReactNode }) {
 *     return (
 *       <html lang="en">
 *         <body>
 *           <PrivyProviderWrapper>
 *             {children}
 *           </PrivyProviderWrapper>
 *         </body>
 *       </html>
 *     );
 *   }
 */
export default function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? ""}
      config={{
        // Default to Monad Testnet
        defaultChain: monadTestnet,
        supportedChains: [monadTestnet],

        // Auto-create an EVM embedded wallet for every new user
        // (Privy v2 nests this under the chain namespace)
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },

        // Login methods - adjust to taste
        loginMethods: ["email", "wallet", "google"],

        appearance: {
          theme: "dark",
          accentColor: "#e63946",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}