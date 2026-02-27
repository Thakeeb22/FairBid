const { Contract } = require("starknet");
const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const { account } = require("../config/starknet");
const auctionAbi = require("../abi/auction.json");

const AUCTION_CONTRACT_ADDRESS = process.env.FAIRBID_CONTRACT_ADDRESS;
if (!AUCTION_CONTRACT_ADDRESS) {
  throw new Error("❌ FAIRBID_CONTRACT_ADDRESS not set");
}

const auctionContract = new Contract(auctionAbi, AUCTION_CONTRACT_ADDRESS, account);

// 🔄 Retry helper with exponential backoff
async function withRetry(fn, maxRetries = 3, delayMs = 1000) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ Attempt ${attempt} failed: ${error.message}`);
      if (attempt < maxRetries) {
        await new Promise(res => setTimeout(res, delayMs * attempt));
      }
    }
  }
  throw lastError;
}

// ----------------------------
// Commit Bid Function
// ----------------------------
async function commitBid(commitment, bidAmount) {
  try {
    console.log("🔄 Committing bid:", {
      commitment: commitment.toString(),
      bidAmount: bidAmount.toString(),
      contract: AUCTION_CONTRACT_ADDRESS,
    });

    const result = await withRetry(async () => {
      // ✅ starknet v9+: args as ARRAY in parameter order
      return await auctionContract.invoke("commit_bid", [
        commitment.toString(),
        bidAmount.toString()
      ]);
    });

    console.log("✅ Commit transaction sent:", result.transaction_hash);

    const receipt = await withRetry(() =>
      account.provider.waitForTransaction(result.transaction_hash)
    );
    
    console.log("✅ Commit confirmed:", receipt.status);
    return receipt.status;
    
  } catch (error) {
    console.error("❌ Commit failed:", {
      message: error.message,
      name: error.name,
      cause: error.cause?.message,
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

    const result = await withRetry(async () => {
      return await auctionContract.invoke("reveal_bid", [
        bidAmount.toString(),
        secret.toString()
      ]);
    });

    console.log("✅ Reveal transaction sent:", result.transaction_hash);

    const receipt = await withRetry(() =>
      account.provider.waitForTransaction(result.transaction_hash)
    );
    
    console.log("✅ Reveal confirmed:", receipt.status);
    return receipt.status;
    
  } catch (error) {
    console.error("❌ Reveal failed:", {
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