const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const {
  commitBid,
  revealBid,
  getHighestBid,
  getHighestBidder,
} = require("../utils/starknetService");
const crypto = require("crypto");

// ===================== Create Auction =====================
const createAuction = async (req, res) => {
  try {
    const {
      title,
      description,
      startingPrice,
      duration,
      revealDuration,
      creatorWallet,
    } = req.body;

    if (
      !title ||
      !startingPrice ||
      !duration ||
      !revealDuration ||
      !creatorWallet
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const endtime = new Date(Date.now() + duration * 60 * 60 * 1000);
    const revealTime = new Date(
      endtime.getTime() + revealDuration * 60 * 60 * 1000
    );

    const auction = new Auction({
      title,
      description,
      startingPrice,
      creatorWallet,
      endtime,
      revealTime,
    });

    await auction.save();

    res.status(201).json({
      message: "Auction created successfully",
      auction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== Get Auctions =====================
const getAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find().sort({ createdAt: -1 });
    res.json(auctions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== Get Single Auction =====================
const getSingleAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const auction = await Auction.findById(auctionId);
    if (!auction)
      return res.status(404).json({ message: "Auction not found" });

    res.status(200).json(auction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== Place Bid =====================
const placeBid = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { bidderWallet, bidAmount, secret } = req.body;

    if (!bidderWallet || !bidAmount || !secret) {
      return res
        .status(400)
        .json({ message: "Missing bidderWallet, bidAmount, or secret" });
    }

    const auction = await Auction.findById(auctionId);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    if (new Date() > auction.endtime) {
      return res.status(400).json({ message: "Auction has ended" });
    }

    // Compute commitment hash
    const commitment = BigInt(
      "0x" +
        crypto.createHash("sha256").update(bidAmount + secret).digest("hex")
    );

    // Commit bid on StarkNet
    await commitBid(commitment, BigInt(bidAmount));

    // Save bid locally
    const bid = new Bid({
      auctionId,
      bidderWallet,
      amount: bidAmount,
      revealed: false,
    });
    await bid.save();

    res.status(200).json({ message: "Bid committed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Commit failed" });
  }
};

// ===================== Reveal Bid =====================
const revealBidController = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { bidderWallet, bidAmount, secret } = req.body;

    if (!bidderWallet || !bidAmount || !secret) {
      return res
        .status(400)
        .json({ message: "Missing bidderWallet, bidAmount, or secret" });
    }

    const auction = await Auction.findById(auctionId);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    if (new Date() < auction.endtime) {
      return res.status(400).json({ message: "Reveal phase not started" });
    }

    if (new Date() > auction.revealTime) {
      return res.status(400).json({ message: "Reveal phase ended" });
    }

    // Reveal bid on StarkNet
    await revealBid(BigInt(bidAmount), secret);

    // Update local bid
    const bid = await Bid.findOne({ auctionId, bidderWallet });
    if (!bid) return res.status(404).json({ message: "Bid not found locally" });

    bid.revealed = true;
    await bid.save();

    res.status(200).json({ message: "Bid revealed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Reveal failed" });
  }
};

// ===================== Get Bid History =====================
const getBidHistory = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const auction = await Auction.findById(auctionId);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    if (auction.status === "commit") {
      return res
        .status(403)
        .json({ message: "Bids are hidden until reveal phase" });
    }

    const bids = await Bid.find({ auctionId, revealed: true }).sort({ amount: -1 });

    res.status(200).json({
      totalBids: bids.length,
      bids,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== Fairness Metrics =====================
const getFairnessMetrics = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const auction = await Auction.findById(auctionId);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    const bids = await Bid.find({ auctionId });
    const totalBids = bids.length;
    const uniqueBidders = new Set(bids.map((bid) => bid.bidderWallet)).size;

    const highestBid = await getHighestBid();
    const highestBidder = await getHighestBidder();

    res.status(200).json({
      totalBids,
      participation: uniqueBidders,
      winner: highestBidder,
      finalPrice: highestBid,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Metrics error" });
  }
};

module.exports = {
  createAuction,
  getAuctions,
  getSingleAuction,
  placeBid,
  commitBid,
  revealBidController,
  getBidHistory,
  getFairnessMetrics,
};