import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Auction } from "@/data/mockAuctions";
import StatusBadge from "./StatusBadge";
import CountdownTimer from "./CountdownTimer";
import { Users, TrendingUp } from "lucide-react";

interface AuctionCardProps {
  auction: Auction;
  index?: number;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction, index = 0 }) => {
  const navigate = useNavigate();

  const getCtaConfig = () => {
    switch (auction.status) {
      case "active":
        return { label: "Place Sealed Bid", route: `/commit/${auction.id}`, variant: "gold" };
      case "reveal":
        return { label: "Reveal Bid", route: `/reveal/${auction.id}`, variant: "outline" };
      case "finalized":
        return { label: "View Results", route: `/finalized/${auction.id}`, variant: "ghost" };
    }
  };

  const cta = getCtaConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card-glass overflow-hidden group cursor-pointer"
      style={{ borderRadius: "var(--radius)" }}
      onClick={() => navigate(`/auction/${auction.id}`)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <motion.img
          src={auction.image}
          alt={auction.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={auction.status} />
        </div>
        {auction.status === "active" && (
          <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-border">
            <CountdownTimer deadline={auction.commitDeadline} compact />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-heading font-semibold text-foreground truncate">{auction.title}</h3>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground font-body">Floor Price</p>
            <p className="font-heading font-bold text-gold">{auction.floorPrice} STRK</p>
          </div>
          {auction.highestBid ? (
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-body">Highest Bid</p>
              <p className="font-heading font-bold text-foreground flex items-center gap-1">
                <TrendingUp size={12} className="text-gold" />
                {auction.highestBid} STRK
              </p>
            </div>
          ) : (
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-body">Participants</p>
              <p className="font-heading font-semibold text-foreground flex items-center gap-1 justify-end">
                <Users size={12} className="text-muted-foreground" />
                {auction.participants}
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-2.5 rounded-xl font-heading font-semibold text-sm transition-colors duration-200 ${
            cta.variant === "gold"
              ? "bg-gradient-gold text-accent-foreground gold-glow"
              : cta.variant === "outline"
              ? "border border-gold text-gold hover:bg-accent/10"
              : "border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
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
