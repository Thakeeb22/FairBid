const mongoose = require("mongoose");
const auctionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    startingPrice: {
      type: Number,
      required: true,
    },
    creatorWallet: {
      type: String,
      required: true,
    },
    endtime: {
      type: Date,
      required: true,
    },
    revealTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["commit", "reveal", "finalized"],
      default: "commit",
    },
    winner: {
      type: String,
      default: null,
    },
    finalPrice: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Auction", auctionSchema);
