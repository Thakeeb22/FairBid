import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import AuctionCard from "@/components/auction/AuctionCard";
import { getAuctions } from "@/lib/api";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, TrendingUp, Clock, ChevronDown } from "lucide-react";

type StatusFilter = "all" | "active" | "reveal" | "finalized";
type SortKey = "time" | "price-asc" | "price-desc" | "participants";

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All Auctions" },
  { value: "active", label: "Active" },
  { value: "reveal", label: "Reveal Phase" },
  { value: "finalized", label: "Finalized" },
];

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "time", label: "Time Remaining" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "participants", label: "Most Participants" },
];

const Market: React.FC = () => {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [search, setSearch] = useState("");
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAuctions();
        setAuctions(data);
      } catch (err) {
        console.error("Error fetching auctions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = auctions
    .filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortKey) {
        case "time":
          return new Date(a.commitDeadline).getTime() - new Date(b.commitDeadline).getTime();
        case "price-asc":
          return a.floorPrice - b.floorPrice;
        case "price-desc":
          return b.floorPrice - a.floorPrice;
        case "participants":
          return b.participants - a.participants;
        default:
          return 0;
      }
    });

  const activeCount = auctions.filter((a) => a.status === "active").length;
  const revealCount = auctions.filter((a) => a.status === "reveal").length;

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-1"
        >
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Live <span className="gradient-text-gold">Market</span>
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            Browse sealed-bid auctions — bid privately, win fairly.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="flex flex-wrap gap-3">
          <div className="card-glass px-4 py-2.5">
            Total Auctions: {auctions.length}
          </div>
          <div className="card-glass px-4 py-2.5">
            Active Now: {activeCount}
          </div>
          <div className="card-glass px-4 py-2.5">
            Reveal Phase: {revealCount}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-10">Loading auctions...</div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((auction, i) => (
              <AuctionCard key={auction.id} auction={auction} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            No auctions found
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Market;