import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { ArrowLeft, Hash, Lock, RefreshCw, Shield, Info } from "lucide-react";
import { getSingleAuction, commitBidAPI } from "@/lib/api";
import { useWallet } from "@/context/WalletContext"; // <-- wallet context

const phases = ["Product", "Commit", "Reveal", "Finalized"];

const CommitPhase: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { account, address, connectWallet } = useWallet(); // <-- dynamic wallet

  const [auction, setAuction] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [secret, setSecret] = useState("");
  const [hash, setHash] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ bid?: string; secret?: string }>({});
  const [loading, setLoading] = useState(true);

  const isActive = auction?.status === "active";

  useEffect(() => {
    if (!id) return;
    const fetchAuction = async () => {
      try {
        const data = await getSingleAuction(id);
        setAuction(data);
      } catch (err) {
        console.error("Failed to fetch auction:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuction();
  }, [id]);

  const generateHash = () => {
    if (!bidAmount || !secret) return;
    const fakeHash =
      "0x" +
      Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
    setHash(fakeHash);
  };

  const handleSubmit = async () => {
    if (!account) {
      alert("Please connect your Argent X wallet first!");
      return;
    }

    const errs: { bid?: string; secret?: string } = {};
    if (!bidAmount || parseFloat(bidAmount) <= 0)
      errs.bid = "Enter a valid bid amount.";
    if (!secret || secret.length < 4)
      errs.secret = "Secret phrase must be at least 4 characters.";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (!hash) {
      generateHash();
      return;
    }

    try {
      await commitBidAPI(auction._id, {
        commitment: hash,
        bidder: address, // <-- dynamic wallet address
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit bid:", err);
      setErrors({ bid: "Failed to submit. Try again." });
    }
  };

  if (loading)
    return (
      <PageLayout>
        <div className="text-center py-20 text-muted-foreground">
          Loading auction...
        </div>
      </PageLayout>
    );

  if (!auction)
    return (
      <PageLayout>
        <div className="text-center py-20 text-destructive">Auction not found.</div>
      </PageLayout>
    );

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <button
          onClick={() => navigate(`/auction/${auction._id}`)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Back to Auction
        </button>

        {!account ? (
          <div className="card-glass p-6 text-center">
            <p className="mb-4 text-sm text-muted-foreground">
              Connect your Argent X wallet to participate.
            </p>
            <button
              onClick={connectWallet}
              className="py-3 px-6 bg-gradient-gold rounded-xl font-heading font-bold text-accent-foreground hover:opacity-90 transition-all"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div
            className={`card-glass p-6 space-y-5 ${
              !isActive ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            {/* Bid Form */}
            <div className="space-y-4">
              <div>
                <label className="font-body text-sm text-muted-foreground">
                  Bid Amount (STRK)
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl border border-border focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                  placeholder="Enter your bid"
                />
                {errors.bid && (
                  <p className="text-xs text-destructive mt-1">{errors.bid}</p>
                )}
              </div>

              <div>
                <label className="font-body text-sm text-muted-foreground">
                  Secret Phrase
                </label>
                <input
                  type="text"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl border border-border focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                  placeholder="Enter secret phrase"
                />
                {errors.secret && (
                  <p className="text-xs text-destructive mt-1">{errors.secret}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={generateHash}
                  className="flex-1 py-3 bg-accent/10 hover:bg-accent/20 rounded-xl font-body font-semibold transition-all"
                >
                  Generate Hash
                </button>
                <span className="font-body text-sm text-muted-foreground break-all">
                  {hash || "-"}
                </span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitted}
                className="w-full py-3 bg-gradient-gold rounded-xl font-heading font-bold text-accent-foreground hover:opacity-90 transition-all"
              >
                {submitted ? "Submitted" : "Commit Bid"}
              </button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default CommitPhase;