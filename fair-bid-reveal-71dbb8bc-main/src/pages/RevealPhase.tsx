import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import CountdownTimer from "@/components/auction/CountdownTimer";
import { ArrowLeft, Eye, Trophy, Info } from "lucide-react";
import { getSingleAuction, revealBidAPI, getBidHistory } from "@/lib/api";
import { useWallet } from "@/context/WalletContext"; // <-- import wallet

const phases = ["Product", "Commit", "Reveal", "Finalized"];

const RevealPhase: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { account, address, connectWallet } = useWallet(); // <-- wallet

  const [auction, setAuction] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [secret, setSecret] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const auctionData = await getSingleAuction(id);
        setAuction(auctionData);

        const bidsData = await getBidHistory(id);
        setBids(bidsData);
      } catch (err) {
        console.error(err);
        setError("Failed to load auction data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleReveal = async () => {
    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!bidAmount || !secret) {
      setError("Enter both bid amount and secret phrase.");
      return;
    }

    try {
      setError("");
      await revealBidAPI(id!, { amount: parseFloat(bidAmount), secret, bidder: address });

      setRevealed(true);

      const updatedBids = await getBidHistory(id!);
      setBids(updatedBids);
    } catch (err) {
      console.error(err);
      setError("Failed to reveal bid. Check your amount and secret.");
    }
  };

  if (loading) return <PageLayout><div className="text-center py-20">Loading...</div></PageLayout>;
  if (!auction) return <PageLayout><div className="text-center py-20">Auction not found</div></PageLayout>;

  const highest = bids.length ? Math.max(...bids.map((b) => b.amount)) : 0;

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* Back */}
        <button onClick={() => navigate(`/auction/${auction.id}`)} className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
          <ArrowLeft size={16} /> Back to Auction
        </button>

        {!account ? (
          <div className="card-glass p-6 text-center">
            <p className="mb-4 text-sm text-muted-foreground">Connect your wallet to reveal your bid.</p>
            <button onClick={connectWallet} className="py-3 px-6 bg-gradient-gold rounded-xl font-heading font-bold text-accent-foreground hover:opacity-90 transition-all">
              Connect Wallet
            </button>
          </div>
        ) : (
          /* Original reveal form here */
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Reveal form and revealed bids as in your original code */}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default RevealPhase;