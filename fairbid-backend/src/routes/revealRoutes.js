const express = require("express")
const router = express.Router()
const {revealBidController } = require("../controllers/auctionController")
// POST/api/reveal/:auctionId
router.post("/auctionId", revealBidController)
module.exports = router