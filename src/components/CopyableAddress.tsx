"use client";

import { useState } from "react";
import { shortAddr } from "@/lib/utils";

export default function CopyableAddress({
  address,
  label,
  className,
  style,
}: {
  address: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = address;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={className}
      style={{
        cursor: "pointer",
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.05)",
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 12,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        color: "inherit",
        fontFamily: "inherit",
        ...style,
      }}
      title={`Click to copy: ${address}`}
    >
      {label && (
        <span
          style={{
            background: "#e63946",
            color: "#fff",
            padding: "2px 8px",
            borderRadius: 4,
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {label}
        </span>
      )}
      <code style={{ fontSize: 13 }}>{shortAddr(address)}</code>
      <span style={{ opacity: 0.6, fontSize: 10 }}>
        {copied ? "Copied!" : "Copy"}
      </span>
    </button>
  );
}
