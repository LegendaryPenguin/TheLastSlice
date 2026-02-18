"use client";

import { useEffect } from "react";
import { usePrivy, useGuestAccounts } from "@privy-io/react-auth";

/**
 * Silently creates a guest account and embedded wallet on first load.
 * Mounted in layout so wallet is ready on any page (e.g. direct link to raid).
 */
export default function GuestAccountCreator() {
  const { ready, authenticated } = usePrivy();
  const { createGuestAccount } = useGuestAccounts();

  useEffect(() => {
    if (ready && !authenticated) {
      createGuestAccount().catch((err: unknown) =>
        console.warn("[GuestAccountCreator] createGuestAccount error:", err)
      );
    }
  }, [ready, authenticated, createGuestAccount]);

  return null;
}
