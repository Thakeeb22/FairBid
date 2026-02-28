// src/components/auction/AuctionCard.tsx - Top section ✅
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge"; // ✅ Import the fixed StatusBadge
import CountdownTimer from "./CountdownTimer";
import { Users, TrendingUp } from "lucide-react";

// ✅ Define types locally (no external imports)
export type AuctionPhase = "commit" | "reveal" | "finalized" | "closed" | (string & {});
export type AuctionStatus = "active" | "reveal" | "finalized" | "closed" | (string & {});

export interface Auction {
  _id: string;
  id?: string;
  title: string;
  startingPrice: number;
  creatorWallet: string;
  endtime: string | Date;
  revealTime: string | Date;
  status: AuctionPhase;
  highestBid?: number | null;
  participants?: number;
  image?: string;
  bidCount?: number;
  participantCount?: number;
  myBid?: boolean;
  currentPhase?: string;
}

// -----------------------------
// Map backend -> frontend status
// -----------------------------
const mapStatus = (status: AuctionPhase): AuctionStatus => {
  const s = status?.toLowerCase();
  if (s === "commit") return "active";
  if (s === "reveal") return "reveal";
  return "finalized";
};

// -----------------------------
// Backend URL - FIXED: No trailing spaces! ✅
// -----------------------------
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL?.trim() || "https://fairbid-backend.onrender.com";

// -----------------------------
// Props
// -----------------------------
interface AuctionCardProps {
  auction: Auction;
  index?: number;
}

// -----------------------------
// Component
// -----------------------------
const AuctionCard: React.FC<AuctionCardProps> = ({ auction, index = 0 }) => {
  const navigate = useNavigate();

  const endtime = new Date(auction.endtime);
  const revealTime = new Date(auction.revealTime);

  // -----------------------------
  // CTA Logic - Type-safe switch
  // -----------------------------
  const getCtaConfig = () => {
    const status = auction.status?.toLowerCase();
    
    switch (status) {
      case "commit":
        return {
          label: "Place Sealed Bid",
          route: `/commit/${auction._id}`,
          variant: "gold" as const,
        };
      case "reveal":
        return {
          label: "Reveal Bid",
          route: `/reveal/${auction._id}`,
          variant: "outline" as const,
        };
      default: // "finalized", "closed", or unknown
        return {
          label: "View Results",
          route: `/finalized/${auction._id}`,
          variant: "ghost" as const,
        };
    }
  };

  const cta = getCtaConfig();

  // -----------------------------
  // Resolve Image URL - FIXED ✅
  // -----------------------------
  const imageSrc = auction.image
    ? `${BACKEND_URL}${auction.image}`
    : "https://via.placeholder.com/400x400?text=Auction";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -4 }}
      className="card-glass overflow-hidden group cursor-pointer"
      style={{ borderRadius: "var(--radius)" }}
      onClick={() => navigate(`/auction/${auction._id}`)}
    >
      {/* ---------------- IMAGE ---------------- */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <motion.img
          src={imageSrc}
          alt={auction.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5 }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/400x400?text=Auction";
          }}
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={mapStatus(auction.status)} />
        </div>

        {/* Countdown (only commit phase) */}
        {auction.status?.toLowerCase() === "commit" && (
          <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-border">
            <CountdownTimer deadline={endtime} compact />
          </div>
        )}
      </div>

      {/* ---------------- CONTENT ---------------- */}
      <div className="p-4 space-y-3">
        <h3 className="font-heading font-semibold text-foreground truncate">
          {auction.title}
        </h3>

        <div className="flex justify-between items-center">
          {/* Floor Price */}
          <div>
            <p className="text-xs text-muted-foreground">Floor Price</p>
            <p className="font-bold text-gold">
              {auction.startingPrice} STRK
            </p>
          </div>

          {/* ✅ Show bidCount if available, else participants */}
          {auction.bidCount !== undefined ? (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Bids</p>
              <p className="font-bold flex items-center gap-1 justify-end">
                <TrendingUp size={12} className="text-gold" />
                {auction.bidCount}
              </p>
            </div>
          ) : auction.participants !== undefined ? (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Participants</p>
              <p className="font-semibold flex items-center gap-1 justify-end">
                <Users size={12} />
                {auction.participantCount ?? auction.participants ?? 0}
              </p>
            </div>
          ) : null}
        </div>

        {/* ---------------- CTA ---------------- */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-2.5 rounded-xl font-semibold text-sm transition ${
            cta.variant === "gold"
              ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black"
              : cta.variant === "outline"
              ? "border border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
              : "border border-gray-600 text-gray-400 hover:text-white"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            navigate(cta.route);
          }}
        >
          {cta.label}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AuctionCard;