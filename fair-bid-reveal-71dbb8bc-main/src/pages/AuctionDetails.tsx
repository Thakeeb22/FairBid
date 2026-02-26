import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import StatusBadge from "@/components/auction/StatusBadge";
import CountdownTimer from "@/components/auction/CountdownTimer";
import {
  getSingleAuction,
  getBidHistory,
  getFairnessMetrics,
} from "@/lib/api";
import { ArrowLeft, Shield, Lock, Eye, Users, Hash } from "lucide-react";
import { useWallet } from "@/context/WalletContext"; // new wallet hook

// Type definitions
interface Bid {
  bidderWallet: string;
  amount: number;
  revealed: boolean;
  createdAt: string;
}

interface RecentActivity {
  address: string;
  action: string;
  hash: string;
  time: string;
}

interface Auction {
  _id: string;
  title: string;
  description: string;
  image?: string;
  creatorWallet: string;
  status: "active" | "reveal" | "finalized";
  startingPrice: number;
  endtime: string; // commit deadline
  revealTime: string; // reveal deadline
}

// Optional metrics type
interface Metrics {
  participation: number;
}

const AuctionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { address: connectedWallet } = useWallet(); // use dynamic wallet

  const [auction, setAuction] = useState<Auction | null>(null);
  const [bidHistory, setBidHistory] = useState<Bid[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAuction = async () => {
      try {
        const data = await getSingleAuction(id);
        setAuction(data);

        // Fetch bid history if in reveal/finalized
        let history: Bid[] = [];
        if (data.status === "reveal" || data.status === "finalized") {
          history = await getBidHistory(id);
          setBidHistory(history);
        }

        // Fetch metrics
        const auctionMetrics = await getFairnessMetrics(id);
        setMetrics(auctionMetrics);

        // Build recent activity from bid history
        const activity: RecentActivity[] = history.map((b) => ({
          address: b.bidderWallet,
          action: b.revealed ? "Bid Revealed" : "Bid Committed",
          hash: "-", // optional
          time: new Date(b.createdAt).toLocaleString(),
        }));
        setRecentActivity(activity);
      } catch (err) {
        console.error("Failed to fetch auction:", err);
      }
    };

    fetchAuction();
  }, [id]);

  if (!auction) {
    return (
      <PageLayout>
        <div className="text-center py-20 text-muted-foreground">
          Loading auction...
        </div>
      </PageLayout>
    );
  }

  const isOwner = auction.creatorWallet === connectedWallet; // dynamic owner check

  const getCtaRoute = () => {
    switch (auction.status) {
      case "active":
        return `/commit/${auction._id}`;
      case "reveal":
        return `/reveal/${auction._id}`;
      case "finalized":
        return `/finalized/${auction._id}`;
      default:
        return "#";
    }
  };

  const getCtaLabel = () => {
    switch (auction.status) {
      case "active":
        return "Place Sealed Bid";
      case "reveal":
        return "Reveal My Bid";
      case "finalized":
        return "View Results";
      default:
        return "N/A";
    }
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
        {/* Back + Title */}
        <div className="flex items-start gap-3 mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-xl border border-border hover:border-gold/50 text-muted-foreground hover:text-foreground transition-all mt-0.5"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                {auction.title}
              </h1>
              <StatusBadge status={auction.status} />
            </div>
            <p className="font-body text-sm text-muted-foreground mt-1">
              Created by {auction.creatorWallet}
              {isOwner && " (You)"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Image + Timer */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card-glass overflow-hidden">
              <img
                src={auction.image || "/placeholder.png"}
                alt={auction.title}
                className="w-full aspect-square object-cover"
              />
            </div>

            {auction.status !== "finalized" && (
              <div className="card-glass p-4 space-y-3">
                <p className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {auction.status === "active"
                    ? "Commit Phase Ends"
                    : "Reveal Phase Ends"}
                </p>
                <CountdownTimer
                  deadline={
                    auction.status === "active"
                      ? new Date(auction.endtime)
                      : new Date(auction.revealTime)
                  }
                />
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="card-glass p-3 text-center">
                <p className="font-heading text-lg font-bold text-gold">
                  {auction.startingPrice}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  Starting Price (STRK)
                </p>
              </div>
              <div className="card-glass p-3 text-center">
                <p className="font-heading text-lg font-bold text-foreground flex items-center justify-center gap-1">
                  <Users size={14} className="text-muted-foreground" />
                  {metrics?.participation || 0}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  Participants
                </p>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-3 space-y-4">
            {/* Description */}
            <div className="card-glass p-5 space-y-3">
              <h2 className="font-heading font-semibold text-foreground">
                About this NFT
              </h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {auction.description}
              </p>
            </div>

            {/* Bidding Instructions */}
            <div className="card-glass p-5 space-y-4">
              <h2 className="font-heading font-semibold text-foreground">
                How to Bid
              </h2>
              <div className="space-y-3">
                {[
                  {
                    icon: Hash,
                    step: "1",
                    label: "Enter your bid",
                    desc: "Choose your bid amount in STRK tokens.",
                  },
                  {
                    icon: Lock,
                    step: "2",
                    label: "Sign & Hash",
                    desc: "Your bid is hashed with a secret phrase. Nobody sees your amount.",
                  },
                  {
                    icon: Eye,
                    step: "3",
                    label: "Reveal Phase",
                    desc: "After the commit deadline, reveal your bid to be eligible to win.",
                  },
                ].map(({ icon: Icon, step, label, desc }) => (
                  <div key={step} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center shrink-0 mt-0.5">
                      <span className="font-heading text-xs font-bold text-accent-foreground">
                        {step}
                      </span>
                    </div>
                    <div>
                      <p className="font-heading text-sm font-semibold text-foreground">
                        {label}
                      </p>
                      <p className="font-body text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="card-glass p-3 flex items-center gap-2">
                <Shield size={16} className="text-gold shrink-0" />
                <div>
                  <p className="font-heading text-xs font-semibold text-foreground">
                    Starknet Secured
                  </p>
                  <p className="font-body text-[10px] text-muted-foreground">
                    ZK-rollup protection
                  </p>
                </div>
              </div>
              <div className="card-glass p-3 flex items-center gap-2">
                <Lock size={16} className="text-gold shrink-0" />
                <div>
                  <p className="font-heading text-xs font-semibold text-foreground">
                    Smart Contract
                  </p>
                  <p className="font-body text-[10px] text-muted-foreground">
                    Enforced on-chain
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card-glass p-5 space-y-3">
              <h2 className="font-heading font-semibold text-foreground">
                Recent Activity
              </h2>
              <div className="space-y-2">
                {recentActivity.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-[9px] font-heading font-bold text-primary-foreground">
                          {item.address.slice(2, 4)}
                        </span>
                      </div>
                      <div>
                        <p className="font-body text-xs text-foreground">
                          {item.address}
                        </p>
                        <p className="font-body text-[10px] text-muted-foreground">
                          {item.action}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-body text-[10px] text-gold">{item.hash}</p>
                      <p className="font-body text-[10px] text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom CTA */}
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-xl border-t border-border md:relative md:p-0 md:bg-transparent md:border-0 md:mt-6 md:backdrop-blur-0">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate(getCtaRoute())}
              className={`w-full py-4 rounded-xl font-heading font-bold text-base transition-all duration-200 ${
                auction.status === "active"
                  ? "bg-gradient-gold text-accent-foreground gold-glow hover:opacity-90 animate-gold-pulse"
                  : auction.status === "reveal"
                  ? "border-2 border-gold text-gold hover:bg-accent/10"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {getCtaLabel()}
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AuctionDetails;