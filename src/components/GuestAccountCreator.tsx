"use client";

import { useEffect } from "react";
import { usePrivy, useGuestAccounts } from "@privy-io/react-auth";

const LOGGED_OUT_KEY = "privy:explicitly_logged_out";

export function markLoggedOut() {
  if (typeof window !== "undefined") localStorage.setItem(LOGGED_OUT_KEY, "1");
}

export function clearLoggedOut() {
  if (typeof window !== "undefined") localStorage.removeItem(LOGGED_OUT_KEY);
}

/**
 * Auto-creates a guest account on first visit so the user has a wallet ready.
 * Skips auto-creation if the user explicitly logged out.
 * Clears the logged-out flag automatically once the user is authenticated again.
 */
export default function GuestAccountCreator() {
  const { ready, authenticated } = usePrivy();
  const { createGuestAccount } = useGuestAccounts();

  // Once the user is authenticated (by any means), clear the logged-out flag
  // so future sessions work normally.
  useEffect(() => {
    if (authenticated) {
      clearLoggedOut();
    }
  }, [authenticated]);

  // Auto-create guest only on first visit (no explicit logout flag set)
  useEffect(() => {
    if (!ready || authenticated) return;
    if (typeof window !== "undefined" && localStorage.getItem(LOGGED_OUT_KEY) === "1") return;

    createGuestAccount().catch((err: unknown) =>
      console.warn("[GuestAccountCreator] createGuestAccount error:", err)
    );
  }, [ready, authenticated, createGuestAccount]);

  return null;
}
