const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    startingPrice: { type: Number, required: true },
    creatorWallet: { type: String, required: true },
    endtime: { type: Date, required: true },
    revealTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["commit", "reveal", "finalized"],
      default: "commit",
    },
    winner: { type: String, default: null },
    finalPrice: { type: Number, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual field to calculate current phase dynamically
auctionSchema.virtual("currentPhase").get(function () {
  const now = new Date();
  if (now < this.endtime) return "commit";
  if (now >= this.endtime && now <= this.revealTime) return "reveal";
  return "finalized";
});
// At the END of your schema definition, BEFORE module.exports:

// ✅ Enable virtuals in toJSON and toObject
auctionSchema.set('toJSON', { virtuals: true });
auctionSchema.set('toObject', { virtuals: true });

// ✅ Ensure currentPhase virtual is defined correctly
auctionSchema.virtual('currentPhase').get(function() {
  const now = new Date();
  const endTime = new Date(this.endtime);
  const revealTime = new Date(this.revealTime);
  
  if (now < endTime) return 'commit';
  if (now < revealTime) return 'reveal';
  return 'closed';
});
module.exports = mongoose.model("Auction", auctionSchema);
