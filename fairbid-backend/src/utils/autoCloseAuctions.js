// src/utils/autoCloseAuctions.js
const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const { getHighestBid, getHighestBidder } = require("./starknetService");

// Function to auto-close auctions
const autoCloseAuctions = async () => {
  try {
    // Find auctions that are still open but their endtime has passed
    const auctionsToClose = await Auction.find({
      status: "open",
      endtime: { $lt: new Date() },
    });

    for (const auction of auctionsToClose) {
      // Get highest bid & bidder from StarkNet
      const highestBid = await getHighestBid();
      const highestBidder = await getHighestBidder();

      // Mark auction as closed locally
      auction.status = "closed";
      auction.winner = highestBidder || null;
      auction.finalPrice = highestBid || null;
      await auction.save();

      console.log(
        `Auction ${auction._id} closed. Winner: ${highestBidder}, Final Price: ${highestBid}`
      );
    }
  } catch (err) {
    console.error("Auto close auctions error:", err);
  }
};

// Run every minute
setInterval(autoCloseAuctions, 60 * 1000);

module.exports = autoCloseAuctions;