// src/pages/Dashboard.tsx - FINAL WORKING VERSION ✅
import React, { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import AuctionCard, { Auction } from "@/components/auction/AuctionCard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, TrendingUp, Gavel, Star } from "lucide-react";
import { getAuctions } from "@/lib/api";
import { useWallet } from "@/context/WalletContext";

const tabs = ["Active Auctions", "My Bids", "Created Auctions"];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

// ✅ Type-safe: Omit 'status' from Auction, then add our own
type EnrichedAuction = Omit<Auction, 'status'> & {
  status: string;
  bidCount?: number;
  participantCount?: number;
  myBid?: boolean;
};

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [auctions, setAuctions] = useState<EnrichedAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { account, address, connectWallet } = useWallet();

  // -----------------------------
  // Fetch Auctions with Auto-Refresh
  // -----------------------------
  useEffect(() => {
    let mounted = true;
    
    const fetchAuctions = async () => {
      if (!mounted) return;
      
      try {
        const data = await getAuctions(address);
        
        const formatted: EnrichedAuction[] = data.map((a: any) => ({
          ...a,
          endtime: new Date(a.endtime),
          revealTime: new Date(a.revealTime),
          bidCount: a.bidCount ?? 0,
          participantCount: a.participantCount ?? 0,
          myBid: a.myBid ?? false,
          status: a.status ?? a.currentPhase ?? "commit",
        }));
        
        setAuctions(formatted);
      } catch (err) {
        console.error("Failed to fetch auctions:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAuctions();
    const interval = setInterval(fetchAuctions, 15000);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [address]);

  // -----------------------------
  // Filter auctions (type-safe string comparison)
  // -----------------------------
  const filteredAuctions = auctions.filter((a) => {
    const status = (a.status || "").toLowerCase();
    
    switch (activeTab) {
      case 0: // Active Auctions
        return !["finalized", "closed"].includes(status);
      case 1: // My Bids
        return a.myBid === true;
      case 2: // Created Auctions
        return a.creatorWallet?.toLowerCase() === address?.toLowerCase();
      default:
        return true;
    }
  });

  // -----------------------------
  // Stats calculations
  // -----------------------------
  const totalBids = auctions.reduce((sum, a) => sum + (a.bidCount ?? 0), 0);
  const totalParticipants = auctions.reduce((sum, a) => sum + (a.participantCount ?? 0), 0);
  const activeCount = auctions.filter((a) => 
    !["finalized", "closed"].includes((a.status || "").toLowerCase())
  ).length;

  const stats = [
    { label: "Active Auctions", value: activeCount, icon: Gavel, trend: "Live" },
    { label: "Total Bids", value: totalBids, icon: TrendingUp, trend: "All time" },
    { label: "Participants", value: totalParticipants, icon: Star, trend: "Unique bidders" },
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <p className="font-body text-sm text-muted-foreground mb-1">Welcome back,</p>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Guest"} 👋
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (!account) connectWallet();
              else navigate("/create");
            }}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-gold rounded-xl font-heading font-semibold text-accent-foreground gold-glow"
          >
            <Plus size={18} />
            {account ? "Create Auction" : "Connect Wallet"}
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map(({ label, value, icon: Icon, trend }) => (
            <div key={label} className="card-glass p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className="text-gold" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <p className="font-heading font-bold text-lg">{value}</p>
              <p className="text-xs text-muted-foreground">{trend}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-lg text-sm font-heading font-medium ${
                activeTab === i
                  ? "bg-card text-foreground border border-border"
                  : "text-muted-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12 text-muted-foreground animate-pulse">
            Loading auctions...
          </div>
        )}

        {/* Auctions */}
        {!loading && filteredAuctions.length > 0 && (
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredAuctions.map((auction) => (
              <AuctionCard 
                key={auction._id} 
                auction={auction} 
              />
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && filteredAuctions.length === 0 && (
          <div className="card-glass p-12 text-center">
            <Gavel size={40} className="text-muted-foreground mx-auto mb-3" />
            <p className="font-heading font-semibold mb-1">
              {activeTab === 1 ? "No bids yet" : "No auctions found"}
            </p>
            <p className="text-sm text-muted-foreground">
              {activeTab === 1 ? "Place a bid to see it here!" : "Check back later or create your first auction."}
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Dashboard;