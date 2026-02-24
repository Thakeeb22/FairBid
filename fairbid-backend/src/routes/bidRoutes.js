const express = require("express");
const router = express.Router();
const { placeBid, revealBidController, getBidHistory } = require("../controllers/auctionController");
/**
 * ============================
 * SEALED BID FLOW ROUTES
 * ============================
*/
/**
 * Commit bid (hidden phase)
 * POST /api/bid/:auctionId/commit
 * body:
 * {
 * bidderWallet,
 * bidAmount,
 * secret
 * }
*/
router.post("/:auctionId/commit", placeBid)
/**
 * reveal bid (reveal phase)
 * POST /api/bid/:auctionId/reveal
 * Body:
 * {
 * biddderWallet,
 * bidAmount,
 * secret
 * }
*/
router.post("/:auctionId/reveal", revealBidController)
/**
 * view revealed bids only
 * GET /api/bid/history/:auctionId
*/
router.get("/history/:auctionId", getBidHistory);
router.post("/:auctionId", placeBid);

module.exports = router;
