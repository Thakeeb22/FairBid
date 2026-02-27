// src/utils/starknetService.js - FOR starknet@9.2.1 ✅
const { Contract } = require("starknet");
const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const { account } = require("../config/starknet");
const auctionAbi = require("../abi/auction.json");

const AUCTION_CONTRACT_ADDRESS = process.env.FAIRBID_CONTRACT_ADDRESS;
if (!AUCTION_CONTRACT_ADDRESS) {
  throw new Error("❌ FAIRBID_CONTRACT_ADDRESS not set");
}

// Contract instance
const auctionContract = new Contract(auctionAbi, AUCTION_CONTRACT_ADDRESS, account);

// ----------------------------
// Commit Bid Function
// ----------------------------
async function commitBid(commitment, bidAmount) {
  try {
    console.log("🔄 Committing bid:", {
      commitment: commitment.toString(),
      bidAmount: bidAmount.toString(),
    });

    // ✅ starknet v9+: pass args as ARRAY in parameter order
    const tx = await auctionContract.invoke(
      "commit_bid",
      [commitment.toString(), bidAmount.toString()] // ← Array, not object!
    );
    
    console.log("Commit transaction sent:", tx.transaction_hash);

    const receipt = await account.provider.waitForTransaction(tx.transaction_hash);
    console.log("Commit transaction confirmed:", receipt.status);

    return receipt.status;
  } catch (error) {
    console.error("❌ Error committing bid:", {
      message: error.message,
      name: error.name,
      stack: error.stack?.split('\n')[1],
    });
    throw new Error(`Commit failed: ${error.message}`);
  }
}

// ----------------------------
// Reveal Bid Function
// ----------------------------
async function revealBid(bidAmount, secret) {
  try {
    console.log("🔄 Revealing bid:", {
      bidAmount: bidAmount.toString(),
      secret: secret.toString(),
    });

    // ✅ starknet v9+: pass args as ARRAY in parameter order
    const tx = await auctionContract.invoke(
      "reveal_bid",
      [bidAmount.toString(), secret.toString()] // ← Array, not object!
    );
    
    console.log("Reveal transaction sent:", tx.transaction_hash);

    const receipt = await account.provider.waitForTransaction(tx.transaction_hash);
    console.log("Reveal transaction confirmed:", receipt.status);

    return receipt.status;
  } catch (error) {
    console.error("❌ Error revealing bid:", {
      message: error.message,
      name: error.name,
    });
    throw new Error(`Reveal failed: ${error.message}`);
  }
}

// ----------------------------
// Get Highest Bid & Bidder (local DB only)
// ----------------------------
async function getHighestBid(auctionId) {
  const bids = await Bid.find({ auctionId, revealed: true });
  if (bids.length === 0) return null;
  const highestBid = bids.reduce((prev, curr) =>
    BigInt(curr.amount) > BigInt(prev.amount) ? curr : prev
  );
  return highestBid.amount;
}

async function getHighestBidder(auctionId) {
  const bids = await Bid.find({ auctionId, revealed: true });
  if (bids.length === 0) return null;
  const highestBid = bids.reduce((prev, curr) =>
    BigInt(curr.amount) > BigInt(prev.amount) ? curr : prev
  );
  return highestBid.bidderWallet;
}

module.exports = {
  commitBid,
  revealBid,
  getHighestBid,
  getHighestBidder,
  auctionContract,
};