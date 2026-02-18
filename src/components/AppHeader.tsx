"use client";

import Image from "next/image";
import Link from "next/link";
import PrivyConnectButton from "./PrivyConnectButton";
import PzzaBalance from "./PzzaBalance";

export default function AppHeader() {
  return (
    <header
      className="appHeader"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "8px 12px",
        marginBottom: 0,
        background: "rgba(0,0,0,0.4)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Link
        href="/"
        className="appHeaderLink"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "inherit",
          textDecoration: "none",
          fontWeight: 800,
        }}
      >
        <Image src="/PizzaMan.svg" alt="" width={20} height={20} className="object-contain" />
        <span>Pizza Raid</span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <PzzaBalance />
        <PrivyConnectButton />
      </div>
    </header>
  );
}