// src/utils/starknetService.js
const { Contract } = require("starknet");
const crypto = require("crypto");
const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const { account } = require("../config/starknet");
const auctionAbi = require("../abi/auction.json");

const AUCTION_CONTRACT_ADDRESS = process.env.FAIRBID_CONTRACT_ADDRESS;
if (!AUCTION_CONTRACT_ADDRESS) {
  throw new Error("❌ FAIRBID_CONTRACT_ADDRESS not set in environment variables");
}

// Contract instance
const auctionContract = new Contract(auctionAbi, AUCTION_CONTRACT_ADDRESS, account);

// ----------------------------
// Commit Bid Function
// ----------------------------
async function commitBid(commitment, bidAmount) {
  try {
    const tx = await auctionContract.invoke("commit_bid", {
      commitment: commitment.toString(),
      bid_amount: bidAmount.toString(),
    });

    console.log("Commit transaction sent:", tx.transaction_hash);

    const receipt = await account.provider.waitForTransaction(tx.transaction_hash);
    console.log("Commit transaction confirmed:", receipt.status);

    return receipt.status;
  } catch (error) {
    console.error("Error committing bid on StarkNet:", error);
    throw new Error("Commit failed on StarkNet");
  }
}

// ----------------------------
// Reveal Bid Function
// ----------------------------
async function revealBid(bidAmount, secret) {
  try {
    const tx = await auctionContract.invoke("reveal_bid", {
      bid_amount: bidAmount.toString(),
      secret: secret.toString(),
    });

    console.log("Reveal transaction sent:", tx.transaction_hash);

    const receipt = await account.provider.waitForTransaction(tx.transaction_hash);
    console.log("Reveal transaction confirmed:", receipt.status);

    return receipt.status;
  } catch (error) {
    console.error("Error revealing bid on StarkNet:", error);
    throw new Error("Reveal failed on StarkNet");
  }
}

// ----------------------------
// Get Highest Bid & Bidder
// ----------------------------
async function getHighestBid(auctionId) {
  const bids = await Bid.find({ auctionId, revealed: true });
  if (bids.length === 0) return null;

  const highestBid = bids.reduce((prev, curr) =>
    curr.amount > prev.amount ? curr : prev
  );

  return highestBid.amount;
}

async function getHighestBidder(auctionId) {
  const bids = await Bid.find({ auctionId, revealed: true });
  if (bids.length === 0) return null;

  const highestBid = bids.reduce((prev, curr) =>
    curr.amount > prev.amount ? curr : prev
  );

  return highestBid.bidderWallet;
}

// ----------------------------
// Export everything
// ----------------------------
module.exports = {
  commitBid,
  revealBid,
  getHighestBid,
  getHighestBidder,
  auctionContract,
};
