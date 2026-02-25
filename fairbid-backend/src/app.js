const express = require("express");
const cors = require("cors");
const bidRoutes = require("./routes/bidRoutes");
const auctionRoutes = require("./routes/auctionRoutes");
const autoCloseAuctions = require("./utils/autoCloseAuctions")
const revealRoutes = require("./routes/revealRoutes")
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// routes
app.use("/api/auctions/", auctionRoutes);
app.use("/api/bid", bidRoutes);
app.use("/uploads",express.static("uploads"))
// Test routes
app.get("/", (req, res) => {
  res.send("FairBid Backend Running");
});
// run auto close every 60secs
setInterval(autoCloseAuctions, 60000)
module.exports = app;