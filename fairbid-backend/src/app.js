// src/app.js - FULLY FIXED ✅
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// ✅ Import models needed for debug endpoints
const Bid = require("./models/Bid");

const bidRoutes = require("./routes/bidRoutes");
const auctionRoutes = require("./routes/auctionRoutes");
const revealRoutes = require("./routes/revealRoutes");
const autoCloseAuctions = require("./utils/autoCloseAuctions");
const updateStatus = require("./jobs/updateAuctionStatus");

const app = express();

// Uploads folder setup
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("'uploads folder created'");
}
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(cors());
app.use(express.json());

// ✅ API Routes (must come BEFORE catch-all)
app.use("/api/auctions/", auctionRoutes);
app.use("/api/bid", bidRoutes);
app.use("/api/reveal", revealRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("FairBid Backend Running");
});

// Debug test-bid endpoint (for mock testing)
app.post('/api/debug/test-bid', async (req, res) => {
  const { commitment, bidAmount } = req.body;
  console.log('🧪 Debug test bid:', { commitment, bidAmount });
  
  const bid = new Bid({
    auctionId: req.body.auctionId,
    bidderWallet: req.body.bidderWallet,
    commitment: commitment.toString(),
    deposit: bidAmount,
    revealed: false,
    testMode: true,
  });
  await bid.save();
  
  res.json({ 
    success: true, 
    message: 'Test bid saved (mock mode)',
    bidId: bid._id 
  });
});

// ✅ SPA Fallback Route - MUST BE LAST, use /* syntax for newer Express
app.get('/*', (req, res) => {
  // Skip API and static file routes
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return res.status(404).json({ message: 'Not found' });
  }
  
  // Serve frontend index.html for React Router
  // Adjust path to match your actual frontend build location
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

// ✅ Run status update job immediately on startup, then every 60 seconds
updateStatus(); // Run now
setInterval(autoCloseAuctions, 60000); // Then every 60s

module.exports = app;