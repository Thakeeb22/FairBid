const express = require("express");
const router = express.Router();
const {
  createAuction,
  getAuctions,
  getSingleAuction,
  getFairnessMetrics,
} = require("../controllers/auctionController");

// ✅ Static / specific routes first
router.post("/create",upload.single("image"), createAuction);
router.get("/:auctionId/fairness", getFairnessMetrics);

// ✅ General routes last
router.get("/", getAuctions);
router.get("/:auctionId", getSingleAuction);

module.exports = router;