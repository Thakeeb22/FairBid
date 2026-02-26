import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { ArrowLeft, Trophy, Users, Clock } from "lucide-react";
import { getSingleAuction, getBidHistory } from "@/lib/api";
import { useWallet } from "@/context/WalletContext"; // <-- use WalletContext

interface AuctionHistoryRow {
  address: string;
  bid: number;
}

interface AuctionData {
  _id: string;
  title: string;
  image?: string;
  winner?: string;
  winningBid?: number;
  participants?: number;
  reveals?: number;
  creator: string;
}

const Finalized: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { account, address, connectWallet } = useWallet(); // ✅ Wallet context

  const [auction, setAuction] = useState<AuctionData | null>(null);
  const [history, setHistory] = useState<AuctionHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadAuction = async () => {
      try {
        const data = await getSingleAuction(id);
        setAuction(data);

        try {
          const bidHistory = await getBidHistory(id);
          setHistory(bidHistory);
        } catch {
          console.warn("No bid history available for this auction");
        }
      } catch (err) {
        console.error("Failed to load auction:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAuction();
  }, [id]);

  if (loading) {
    return (
      <PageLayout>
        <div className="text-center py-20 text-muted-foreground">Loading auction...</div>
      </PageLayout>
    );
  }

  if (!auction) {
    return (
      <PageLayout>
        <div className="text-center py-20 text-muted-foreground">Auction not found</div>
      </PageLayout>
    );
  }

  const isOwner = auction.creator === address; // <-- use address from WalletContext

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-muted-foreground text-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Winner Card */}
        <div className="card-glass p-6 flex flex-col sm:flex-row items-center gap-6">
          {auction.image && (
            <img
              src={auction.image}
              alt={auction.title}
              className="w-28 h-28 rounded-xl object-cover"
            />
          )}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm text-muted-foreground">🏆 Winner</p>
            <h2 className="text-xl font-bold">{auction.title}</h2>
            <p className="text-sm">{auction.winner || "N/A"}</p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-xs text-muted-foreground">Winning Bid</p>
            <p className="text-3xl font-bold text-gold">
              {auction.winningBid ?? 0} STRK
            </p>
          </div>
        </div>

        {/* Auction Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card-glass p-4 text-center">
            <Clock className="mx-auto mb-1 text-gold" />
            <p className="font-bold">48h</p>
            <p className="text-xs text-muted-foreground">Duration</p>
          </div>
          <div className="card-glass p-4 text-center">
            <Users className="mx-auto mb-1 text-gold" />
            <p className="font-bold">{auction.participants ?? 0}</p>
            <p className="text-xs text-muted-foreground">Participants</p>
          </div>
          <div className="card-glass p-4 text-center">
            <Trophy className="mx-auto mb-1 text-gold" />
            <p className="font-bold">{auction.reveals ?? 0}</p>
            <p className="text-xs text-muted-foreground">Reveals</p>
          </div>
        </div>

        {/* Bid History */}
        {history.length > 0 && (
          <div className="card-glass overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-bold">Full Auction History</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="px-4 py-2 text-left">Rank</th>
                  <th className="px-4 py-2 text-left">Address</th>
                  <th className="px-4 py-2 text-left">Bid</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">{row.address}</td>
                    <td className="px-4 py-2">{row.bid} STRK</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Finalized;