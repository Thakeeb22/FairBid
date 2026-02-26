// const Auction = require("../models/Auction");
// const Bid = require("../models/Bid");
// const { account } = require("../config/starknet");
// const { Contract } = require("starknet");
// const auctionAbi = require("../abi/auction.json");
// const crypto = require("crypto");

// // ===================== Create Auction =====================
// const createAuction = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       startingPrice,
//       duration,
//       revealDuration,
//       creatorWallet,
//     } = req.body;

//     if (
//       !title ||
//       !startingPrice ||
//       !duration ||
//       !revealDuration ||
//       !creatorWallet
//     ) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const endtime = new Date(Date.now() + duration * 60 * 60 * 1000);
//     const revealTime = new Date(
//       endtime.getTime() + revealDuration * 60 * 60 * 1000,
//     );

//     const auction = new Auction({
//       title,
//       description,
//       startingPrice,
//       creatorWallet,
//       endtime,
//       revealTime,
//     });

//     await auction.save();

//     res.status(201).json({
//       message: "Auction created successfully",
//       auction,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ===================== Get Auctions =====================
// const getAuctions = async (req, res) => {
//   try {
//     const auctions = await Auction.find().sort({ createdAt: -1 });
//     res.json(auctions);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// // src/utils/starknetService.js
// const { account } = require("../config/starknet"); // backend account
// const { Contract } = require("starknet");
// const auctionAbi = require("../abi/auction"); // import ABI directly

// const AUCTION_CONTRACT_ADDRESS = process.env.AUCTION_CONTRACT_ADDRESS;
// if (!AUCTION_CONTRACT_ADDRESS) {
//   throw new Error("AUCTION_CONTRACT_ADDRESS not set in environment variables");
// }

// // Create Contract instance
// const auctionContract = new Contract(
//   auctionAbi,
//   AUCTION_CONTRACT_ADDRESS,
//   account,
// );

// // ----------------------------
// // Commit Bid Function
// // ----------------------------
// async function commitBid(commitment, bidAmount) {
//   try {
//     const tx = await auctionContract.invoke("commit_bid", {
//       commitment: commitment.toString(),
//       bid_amount: bidAmount.toString(),
//     });

//     console.log("Commit transaction sent:", tx.transaction_hash);

//     const receipt = await account.provider.waitForTransaction(
//       tx.transaction_hash,
//     );
//     console.log("Commit transaction confirmed:", receipt.status);

//     return receipt.status;
//   } catch (error) {
//     console.error("Error committing bid on StarkNet:", error);
//     throw new Error("Commit failed on StarkNet");
//   }
// }

// // ----------------------------
// // Reveal Bid Function
// // ----------------------------
// async function revealBid(bidAmount, secret) {
//   try {
//     const tx = await auctionContract.invoke("reveal_bid", {
//       bid_amount: bidAmount.toString(),
//       secret: secret.toString(),
//     });

//     console.log("Reveal transaction sent:", tx.transaction_hash);

//     const receipt = await account.provider.waitForTransaction(
//       tx.transaction_hash,
//     );
//     console.log("Reveal transaction confirmed:", receipt.status);

//     return receipt.status;
//   } catch (error) {
//     console.error("Error revealing bid on StarkNet:", error);
//     throw new Error("Reveal failed on StarkNet");
//   }
// }

// // ===================== Get Single Auction =====================
// const getSingleAuction = async (req, res) => {
//   try {
//     const { auctionId } = req.params;
//     const auction = await Auction.findById(auctionId);
//     if (!auction) return res.status(404).json({ message: "Auction not found" });

//     res.status(200).json(auction);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ===================== Place Bid =====================
// const placeBid = async (req, res) => {
//   try {
//     const { auctionId } = req.params;
//     const { bidderWallet, bidAmount, secret } = req.body;

//     if (!bidderWallet || !bidAmount || !secret) {
//       return res
//         .status(400)
//         .json({ message: "Missing bidderWallet, bidAmount, or secret" });
//     }

//     const auction = await Auction.findById(auctionId);
//     if (!auction) return res.status(404).json({ message: "Auction not found" });

//     if (new Date() > auction.endtime) {
//       return res.status(400).json({ message: "Auction has ended" });
//     }

//     // Compute commitment hash
//     const commitment = BigInt(
//       "0x" +
//         crypto
//           .createHash("sha256")
//           .update(bidAmount + secret)
//           .digest("hex"),
//     );

//     // Commit bid on StarkNet
//     await commitBid(commitment, BigInt(bidAmount));

//     // Save bid locally
//     const bid = new Bid({
//       auctionId,
//       bidderWallet,
//       amount: bidAmount,
//       revealed: false,
//     });
//     await bid.save();

//     res.status(200).json({ message: "Bid committed successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Commit failed" });
//   }
// };

// // ===================== Reveal Bid =====================
// const revealBidController = async (req, res) => {
//   try {
//     const { auctionId } = req.params;
//     const { bidderWallet, bidAmount, secret } = req.body;

//     if (!bidderWallet || !bidAmount || !secret) {
//       return res
//         .status(400)
//         .json({ message: "Missing bidderWallet, bidAmount, or secret" });
//     }

//     const auction = await Auction.findById(auctionId);
//     if (!auction) return res.status(404).json({ message: "Auction not found" });

//     if (new Date() < auction.endtime) {
//       return res.status(400).json({ message: "Reveal phase not started" });
//     }

//     if (new Date() > auction.revealTime) {
//       return res.status(400).json({ message: "Reveal phase ended" });
//     }

//     // Reveal bid on StarkNet
//     await revealBid(BigInt(bidAmount), secret);

//     // Update local bid
//     const bid = await Bid.findOne({ auctionId, bidderWallet });
//     if (!bid) return res.status(404).json({ message: "Bid not found locally" });

//     bid.revealed = true;
//     await bid.save();

//     res.status(200).json({ message: "Bid revealed successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Reveal failed" });
//   }
// };

// // ===================== Get Bid History =====================
// const getBidHistory = async (req, res) => {
//   try {
//     const { auctionId } = req.params;
//     const auction = await Auction.findById(auctionId);
//     if (!auction) return res.status(404).json({ message: "Auction not found" });

//     if (auction.status === "commit") {
//       return res
//         .status(403)
//         .json({ message: "Bids are hidden until reveal phase" });
//     }

//     const bids = await Bid.find({ auctionId, revealed: true }).sort({
//       amount: -1,
//     });

//     res.status(200).json({
//       totalBids: bids.length,
//       bids,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ===================== Fairness Metrics =====================
// const getFairnessMetrics = async (req, res) => {
//   try {
//     const { auctionId } = req.params;
//     const auction = await Auction.findById(auctionId);
//     if (!auction) return res.status(404).json({ message: "Auction not found" });

//     const bids = await Bid.find({ auctionId });
//     const totalBids = bids.length;
//     const uniqueBidders = new Set(bids.map((bid) => bid.bidderWallet)).size;

//     const highestBid = await getHighestBid();
//     const highestBidder = await getHighestBidder();

//     res.status(200).json({
//       totalBids,
//       participation: uniqueBidders,
//       winner: highestBidder,
//       finalPrice: highestBid,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Metrics error" });
//   }
// };

// module.exports = {
//   createAuction,
//   getAuctions,
//   getSingleAuction,
//   placeBid,
//   commitBid,
//   revealBidController,
//   getBidHistory,
//   getFairnessMetrics,
// };
const { account } = require("../config/starknet"); // Backend StarkNet account
const { Contract } = require("starknet");
const auctionAbi = require("../abi/auction.json"); // Your ABI JSON

// Get contract address from environment
const AUCTION_CONTRACT_ADDRESS = process.env.AUCTION_CONTRACT_ADDRESS;
if (!AUCTION_CONTRACT_ADDRESS) {
  throw new Error("AUCTION_CONTRACT_ADDRESS not set in environment variables");
}

// Create a single contract instance
const auctionContract = new Contract(
  auctionAbi,
  AUCTION_CONTRACT_ADDRESS,
  account
);

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

    const receipt = await account.provider.waitForTransaction(
      tx.transaction_hash
    );
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

    const receipt = await account.provider.waitForTransaction(
      tx.transaction_hash
    );
    console.log("Reveal transaction confirmed:", receipt.status);

    return receipt.status;
  } catch (error) {
    console.error("Error revealing bid on StarkNet:", error);
    throw new Error("Reveal failed on StarkNet");
  }
}

// ----------------------------
// Get Highest Bid Function
// ----------------------------
async function getHighestBid() {
  try {
    const result = await auctionContract.call("get_highest_bid");
    // assuming result.highest_bid exists in contract return
    return BigInt(result.highest_bid);
  } catch (error) {
    console.error("Error fetching highest bid from StarkNet:", error);
    throw new Error("Failed to get highest bid");
  }
}

// ----------------------------
// Get Highest Bidder Function
// ----------------------------
async function getHighestBidder() {
  try {
    const result = await auctionContract.call("get_highest_bidder");
    // assuming result.highest_bidder exists in contract return
    return result.highest_bidder.toString();
  } catch (error) {
    console.error("Error fetching highest bidder from StarkNet:", error);
    throw new Error("Failed to get highest bidder");
  }
}

module.exports = {
  commitBid,
  revealBid,
  getHighestBid,
  getHighestBidder,
};