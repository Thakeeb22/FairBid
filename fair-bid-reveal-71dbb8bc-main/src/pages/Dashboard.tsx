import React, { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import AuctionCard from "@/components/auction/AuctionCard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, TrendingUp, Gavel, Star } from "lucide-react";
import { getAuctions } from "@/lib/api";

// Tabs
const tabs = ["Active Auctions", "My Bids", "Created Auctions"];

// Framer motion container variants
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

// TypeScript interface for auctions
interface Auction {
  _id: string;             // MongoDB ID
  title: string;
  status: string;          // e.g., "active", "finalized"
  creatorWallet: string;   // matches WALLET
  bids?: { bidderWallet: string; amount: number }[]; // optional bids
  myBid?: boolean;         // computed for frontend convenience
  [key: string]: any;      // any additional fields
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const WALLET = "0xYourWallet"; // 🔁 replace with actual Starknet wallet

  // Fetch auctions on mount
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const data: Auction[] = await getAuctions();

        // Compute `myBid` for each auction
        const enriched = data.map((a) => ({
          ...a,
          myBid: a.bids?.some((b) => b.bidderWallet === WALLET) ?? false,
        }));

        setAuctions(enriched);
      } catch (err) {
        console.error("Failed to fetch auctions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  // Filter auctions based on active tab
  const filteredAuctions = (() => {
    switch (activeTab) {
      case 0: // Active Auctions
        return auctions.filter((a) => a.status !== "finalized");
      case 1: // Auctions where current wallet has bid
        return auctions.filter((a) => a.myBid);
      case 2: // Auctions created by current wallet
        return auctions.filter((a) => a.creatorWallet === WALLET);
      default:
        return auctions;
    }
  })();

  // Dashboard stats
  const stats = [
    {
      label: "Active Auctions",
      value: auctions.filter((a) => a.status !== "finalized").length,
      icon: Gavel,
      trend: "Live",
    },
    {
      label: "Total Auctions",
      value: auctions.length,
      icon: TrendingUp,
      trend: "All time",
    },
    {
      label: "My Bids",
      value: auctions.filter((a) => a.myBid).length,
      icon: Star,
      trend: "Participating",
    },
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
            <p className="font-body text-sm text-muted-foreground mb-1">
              Welcome back,
            </p>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              {WALLET} 👋
            </h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/create")}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-gold rounded-xl font-heading font-semibold text-accent-foreground gold-glow"
          >
            <Plus size={18} />
            Create Auction
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
          <div className="text-center py-12 text-muted-foreground">
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
            {filteredAuctions.map((auction, i) => (
              <AuctionCard key={auction._id} auction={auction} index={i} />
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && filteredAuctions.length === 0 && (
          <div className="card-glass p-12 text-center">
            <Gavel size={40} className="text-muted-foreground mx-auto mb-3" />
            <p className="font-heading font-semibold mb-1">No auctions found</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Dashboard;