const { Contract } = require("starknet");
const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const { account } = require("../config/starknet");
const auctionAbi = require("../abi/auction.json");

// 🔧 MOCK MODE: Set to true to skip real blockchain calls (for testing without funds)
const MOCK_MODE = process.env.MOCK_MODE === 'true';

const AUCTION_CONTRACT_ADDRESS = process.env.FAIRBID_CONTRACT_ADDRESS;
if (!AUCTION_CONTRACT_ADDRESS && !MOCK_MODE) {
  throw new Error("❌ FAIRBID_CONTRACT_ADDRESS not set");
}

// Only create contract if not in mock mode
const auctionContract = MOCK_MODE ? null : new Contract(auctionAbi, AUCTION_CONTRACT_ADDRESS, account);

// ----------------------------
// Commit Bid Function
// ----------------------------
async function commitBid(commitment, bidAmount) {
  try {
    console.log("🔄 Committing bid:", {
      commitment: commitment.toString(),
      bidAmount: bidAmount.toString(),
      mockMode: MOCK_MODE,
    });

    if (MOCK_MODE) {
      // 🎭 Mock successful transaction
      console.log("🎭 [MOCK] Simulating successful commit transaction");
      await new Promise(res => setTimeout(res, 500)); // Simulate network delay
      return "ACCEPTED_ON_L2"; // Return expected status
    }

    // ✅ Real blockchain call
    const tx = await auctionContract.invoke("commit_bid", [
      commitment.toString(),
      bidAmount.toString()
    ]);
    
    console.log("✅ Commit transaction sent:", tx.transaction_hash);

    const receipt = await account.provider.waitForTransaction(tx.transaction_hash);
    console.log("✅ Commit confirmed:", receipt.status);
    return receipt.status;
    
  } catch (error) {
    console.error("❌ Commit failed:", {
      message: error.message,
      name: error.name,
      mockMode: MOCK_MODE,
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
      mockMode: MOCK_MODE,
    });

    if (MOCK_MODE) {
      // 🎭 Mock successful transaction
      console.log("🎭 [MOCK] Simulating successful reveal transaction");
      await new Promise(res => setTimeout(res, 500));
      return "ACCEPTED_ON_L2";
    }

    // ✅ Real blockchain call
    const tx = await auctionContract.invoke("reveal_bid", [
      bidAmount.toString(),
      secret.toString()
    ]);

    console.log("✅ Reveal transaction sent:", tx.transaction_hash);

    const receipt = await account.provider.waitForTransaction(tx.transaction_hash);
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
  MOCK_MODE, // Export for debugging
};