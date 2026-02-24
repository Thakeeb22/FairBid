const express = require("express");
const router = express.Router();
const {
  createAuction,
  getAuctions,
  getSingleAuction,
  getFairnessMetrics,
} = require("../controllers/auctionController");

// Public routes
router.post("/create", createAuction);
router.get("/", getAuctions);

// Dynamic routes: specific first, generic last
router.get("/:auctionId/fairness", getFairnessMetrics);
router.get("/:auctionId", getSingleAuction);

module.exports = router;