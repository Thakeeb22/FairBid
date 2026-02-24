const express = require("express");
const router = express.Router();
const {
  createAuction,
  getAuctions,
  getSingleAuction,
  getFairnessMetrics,
} = require("../controllers/auctionController");
/**
 * Public route:
*/
router.post("/create", createAuction);
/**
 * Public routes
*/
router.get("/", getAuctions);
router.get("/:auctionId", getSingleAuction)
/**
 * transparency / fairness dashboard
*/
router.get("/:auctionId/fairness", getFairnessMetrics);

module.exports = router;
