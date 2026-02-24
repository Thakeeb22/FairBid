const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const { fairBidContract, adminAccount } = require("../utils/starknetService");

const autoCloseAuctions = async () => {
  try {
    const now = new Date();

    // -----------------------------
    // Start Reveal Phase
    // -----------------------------
    const auctionsToReveal = await Auction.find({
      endtime: { $lt: now },
      status: "bidding",
    });

    for (const auction of auctionsToReveal) {
      const tx = await fairBidContract.invoke(
        "start_reveal_phase",
        {},
        { account: adminAccount }
      );
      await tx.wait();

      auction.status = "revealed";
      await auction.save();
    }

    // -----------------------------
    // Finalize Auctions
    // -----------------------------
    const auctionsToFinalize = await Auction.find({
      revealTime: { $lt: now },
      status: "revealed",
    });

    for (const auction of auctionsToFinalize) {
      const tx = await fairBidContract.invoke(
        "finalize_auction",
        {},
        { account: adminAccount }
      );
      await tx.wait();

      const highestBid = await fairBidContract.call("get_highest_bid");
      const highestBidder = await fairBidContract.call("get_highest_bidder");

      auction.winner = highestBidder;
      auction.finalPrice = Number(highestBid);
      auction.status = "finalized";

      await auction.save();
    }
  } catch (error) {
    console.error("Auto close auctions error:", error);
  }
};

module.exports = autoCloseAuctions;