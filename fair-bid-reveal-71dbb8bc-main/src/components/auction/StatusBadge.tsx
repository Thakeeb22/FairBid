// src/components/auction/StatusBadge.tsx - FIXED ✅
import React from "react";

// ✅ Define type locally (no import needed)
export type AuctionStatus = "active" | "reveal" | "finalized" | "closed" | (string & {});

const StatusBadge: React.FC<{ status: AuctionStatus }> = ({ status }) => {
  // ✅ Handle all possible statuses including "closed"
  const config: Record<string, { label: string; className: string }> = {
    active: { label: "Active", className: "status-active" },
    reveal: { label: "Reveal Phase", className: "status-reveal" },
    finalized: { label: "Finalized", className: "status-finalized" },
    closed: { label: "Closed", className: "status-closed" }, // ✅ Added
  };

  // ✅ Safe access with fallback
  const { label, className } = config[status] || config.finalized;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-heading font-semibold ${className}`}
    >
      {status === "active" && (
        <span className="w-1.5 h-1.5 rounded-full bg-status-active live-dot" />
      )}
      {label}
    </span>
  );
};

export default StatusBadge;