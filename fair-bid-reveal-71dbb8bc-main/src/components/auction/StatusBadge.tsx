import React from "react";
import { AuctionStatus } from "@/data/mockAuctions";

const StatusBadge: React.FC<{ status: AuctionStatus }> = ({ status }) => {
  const config = {
    active: { label: "Active", className: "status-active" },
    reveal: { label: "Reveal Phase", className: "status-reveal" },
    finalized: { label: "Finalized", className: "status-finalized" },
  };

  const { label, className } = config[status];

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
