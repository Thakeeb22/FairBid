// src/controllers/auctionController.js - FULLY FIXED ✅
const Auction = require("../models/Auction");
const Bid = require("../models/Bid");
const { commitBid, revealBid, getHighestBid, getHighestBidder } = require("../utils/starknetService");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");

// -----------------------------
// Multer setup for image uploads
// -----------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// -----------------------------
// Create Auction
// -----------------------------
const createAuction = async (req, res) => {
  try {
    const { title, description, startingPrice, commitDeadline, revealDeadline, creatorWallet } = req.body;

    if (!title || !startingPrice || !commitDeadline || !revealDeadline || !creatorWallet) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const auction = new Auction({
      title,
      description,
      startingPrice,
      creatorWallet,
      endtime: new Date(commitDeadline),
      revealTime: new Date(revealDeadline),
      status: "commit",
      // ✅ Fixed: Single clean image assignment
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await auction.save();
    res.status(201).json({ message: "Auction created successfully", auction });
  } catch (error) {
    console.error("Create auction error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------
// Get All Auctions (Enriched with bid stats)
// -----------------------------
const getAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find().sort({ createdAt: -1 });
    
    // ✅ Enrich each auction with bid stats
    const enriched = await Promise.all(auctions.map(async (auction) => {
      const bidCount = await Bid.countDocuments({ auctionId: auction._id });
      const uniqueBidders = await Bid.distinct('bidderWallet', { auctionId: auction._id });
      
      return {
        ...auction.toObject(),
        status: auction.currentPhase, // ✅ Virtual field
        bidCount,                      // ✅ Total bids
        participantCount: uniqueBidders.length, // ✅ Unique bidders
      };
    }));
    
    res.json(enriched);
  } catch (error) {
    console.error("Get auctions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------
// Get Single Auction
// -----------------------------
const getSingleAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.auctionId);
    if (!auction) return res.status(404).json({ message: "Auction not found" });
    
    res.json({
      ...auction.toObject(),
      status: auction.currentPhase, // ✅ Virtual field
    });
  } catch (error) {
    console.error("Get single auction error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------
// Place Bid (Commit Phase) - FIXED ✅
// -----------------------------
const placeBid = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { bidderWallet, bidAmount, secret } = req.body;
    
    if (!bidderWallet || !bidAmount || !secret) {
      return res.status(400).json({ message: "Missing bidderWallet, bidAmount, or secret" });
    }

    const auction = await Auction.findById(auctionId);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    // ✅ Use virtual field for phase check
    if (auction.currentPhase !== "commit") {
      return res.status(400).json({ 
        message: `Auction is not in commit phase. Current phase: ${auction.currentPhase}` 
      });
    }

    // ✅ Clean commitment hash (no spaces in keywords!)
    const commitment = BigInt(
      "0x" + crypto.createHash("sha256").update(bidAmount + secret).digest("hex")
    );

    // Commit to StarkNet
    await commitBid(commitment, BigInt(bidAmount));

    // Save bid locally
    const bid = new Bid({
      auctionId,
      bidderWallet,
      commitment: commitment.toString(), // ✅ No space in toString()
      deposit: bidAmount,
      revealed: false,
    });
    await bid.save();

    // ✅ Update auction to trigger virtual field recalc
    auction.lastBidTime = new Date();
    await auction.save();

    res.status(200).json({ message: "Bid committed successfully" });
  } catch (error) {
    console.error("Place bid error:", error);
    res.status(500).json({ message: "Commit failed: " + error.message });
  }
};

// -----------------------------
// Reveal Bid - FIXED ✅
// -----------------------------
const revealBidController = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { bidderWallet, bidAmount, secret } = req.body;

    if (!bidderWallet || !bidAmount || !secret) {
      return res.status(400).json({ message: "Missing bidderWallet, bidAmount, or secret" });
    }

    const auction = await Auction.findById(auctionId);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    // ✅ Use virtual phase for accurate timing
    if (auction.currentPhase !== "reveal") {
      return res.status(400).json({ message: `Reveal phase not active. Current phase: ${auction.currentPhase}` });
    }

    // Reveal on StarkNet
    await revealBid(BigInt(bidAmount), secret);

    // Update local bid
    const bid = await Bid.findOne({ auctionId, bidderWallet });
    if (!bid) return res.status(404).json({ message: "Bid not found locally" });

    bid.revealed = true;
    await bid.save();

    res.status(200).json({ message: "Bid revealed successfully" });
  } catch (error) {
    console.error("Reveal bid error:", error);
    res.status(500).json({ message: "Reveal failed: " + error.message });
  }
};

// -----------------------------
// Get Bid History - FIXED ✅
// -----------------------------
const getBidHistory = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const auction = await Auction.findById(auctionId);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    // ✅ Fixed: Check virtual phase, not invalid "bidding" status
    if (auction.currentPhase !== "reveal" && auction.currentPhase !== "finalized") {
      return res.status(403).json({ message: "Bids are hidden until reveal phase" });
    }

    const bids = await Bid.find({ auctionId, revealed: true }).sort({ amount: -1 });
    res.json({ totalBids: bids.length, bids });
  } catch (error) {
    console.error("Get bid history error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------
// Fairness Metrics - FIXED ✅
// -----------------------------
const getFairnessMetrics = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const auction = await Auction.findById(auctionId);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    const bids = await Bid.find({ auctionId });
    const uniqueBidders = new Set(bids.map(b => b.bidderWallet)).size;
    const totalBids = bids.length;

    // ✅ Fixed: Pass auctionId to helper functions
    const highestBid = await getHighestBid(auctionId);
    const highestBidder = await getHighestBidder(auctionId);

    res.json({
      totalBids,
      participation: uniqueBidders,
      winner: highestBidder,
      finalPrice: highestBid,
    });
  } catch (error) {
    console.error("Get fairness metrics error:", error);
    res.status(500).json({ message: "Metrics error: " + error.message });
  }
};

module.exports = {
  createAuction,
  upload, // multer middleware
  getAuctions,
  getSingleAuction,
  placeBid,
  revealBidController,
  getBidHistory,
  getFairnessMetrics,
};