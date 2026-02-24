const mongoose = require("mongoose");
const bidSchema = new mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
    bidderWallet: {
      type: String,
      required: true,
    },
    commitment: {
      type: String,
      required: true,
    },
    deposit: {
      type: Number,
      required: false,
    },
    revealed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Bid", bidSchema);
