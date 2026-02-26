const mongoose = require("mongoose");
const Auction = require("../models/Auction");

const updateAuctionStatuses = async () => {
  const now = new Date();

  try {
    // Commit → Reveal
    await Auction.updateMany(
      { status: "commit", endtime: { $lte: now } },
      { $set: { status: "reveal" } }
    );

    // Reveal → Finalized
    await Auction.updateMany(
      { status: "reveal", revealTime: { $lte: now } },
      { $set: { status: "finalized" } }
    );

    console.log("Auction statuses updated at", now.toISOString());
  } catch (err) {
    console.error("Failed to update auction statuses:", err);
  }
};

// Run every minute
setInterval(updateAuctionStatuses, 60 * 1000);