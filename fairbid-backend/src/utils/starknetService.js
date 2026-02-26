const { account } = require("../config/starknet");
const { Contract } = require("starknet");
const auctionAbi = require("../abi/auction.json");

const AUCTION_CONTRACT_ADDRESS = process.env.AUCTION_CONTRACT_ADDRESS;

if (!AUCTION_CONTRACT_ADDRESS) {
  throw new Error("AUCTION_CONTRACT_ADDRESS not set in environment variables");
}

// Create contract instance once
const auctionContract = new Contract(
  auctionAbi,
  AUCTION_CONTRACT_ADDRESS,
  account
);

// ================= COMMIT BID =================
async function commitBid(commitment, bidAmount) {
  try {
    const tx = await auctionContract.invoke("commit_bid", {
      commitment: commitment.toString(),
      bid_amount: bidAmount.toString(),
    });

    console.log("Commit tx:", tx.transaction_hash);

    await account.provider.waitForTransaction(tx.transaction_hash);
    return tx.transaction_hash;
  } catch (err) {
    console.error("Commit error:", err);
    throw new Error("Commit failed on StarkNet");
  }
}

// ================= REVEAL BID =================
async function revealBid(bidAmount, secret) {
  try {
    const tx = await auctionContract.invoke("reveal_bid", {
      bid_amount: bidAmount.toString(),
      secret: secret.toString(),
    });

    console.log("Reveal tx:", tx.transaction_hash);

    await account.provider.waitForTransaction(tx.transaction_hash);
    return tx.transaction_hash;
  } catch (err) {
    console.error("Reveal error:", err);
    throw new Error("Reveal failed on StarkNet");
  }
}

// ================= VIEW: HIGHEST BID =================
async function getHighestBid() {
  try {
    const res = await auctionContract.call("get_highest_bid");
    return res.highest_bid?.toString() || "0";
  } catch (err) {
    console.error("Highest bid error:", err);
    return "0";
  }
}

// ================= VIEW: HIGHEST BIDDER =================
async function getHighestBidder() {
  try {
    const res = await auctionContract.call("get_highest_bidder");
    return res.highest_bidder?.toString() || null;
  } catch (err) {
    console.error("Highest bidder error:", err);
    return null;
  }
}

module.exports = {
  commitBid,
  revealBid,
  getHighestBid,
  getHighestBidder,
};