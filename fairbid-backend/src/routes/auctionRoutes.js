const express = require("express");
const router = express.Router();
const multer = require("multer")
const path = require("path")
const {
  createAuction,
  getAuctions,
  getSingleAuction,
  getFairnessMetrics,
} = require("../controllers/auctionController");

// Multer setup
const storage = multer.diskStorage({
  destination:(req, file, cb) =>{
    cb(null,path.join(__dirname, "../uploads"))
  },
  filename:(req, file, cb)=>{
    const uniqueSuffix = Date.now()+"-"+Math.round(Math.random()*1e9)
    cb(null,uniqueSuffix + path.extname(file.originalname))
  },
})
const upload = multer({storage})
// ✅ Static / specific routes first
router.post("/create",upload.single("image"), createAuction);
router.get("/:auctionId/fairness", getFairnessMetrics);

// ✅ General routes last
router.get("/", getAuctions);
router.get("/:auctionId", getSingleAuction);

module.exports = router;