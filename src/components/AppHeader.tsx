"use client";

import Link from "next/link";
import PrivyConnectButton from "./PrivyConnectButton";

export default function AppHeader() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "12px 16px",
        marginBottom: 0,
        background: "rgba(0,0,0,0.4)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "inherit",
          textDecoration: "none",
          fontWeight: 800,
          fontSize: 18,
        }}
      >
        <span>🍕</span>
        <span>Pizza Raid</span>
      </Link>
      <PrivyConnectButton />
    </header>
  );
}
