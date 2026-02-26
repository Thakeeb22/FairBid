const express = require("express");
const cors = require("cors");
const bidRoutes = require("./routes/bidRoutes");
const auctionRoutes = require("./routes/auctionRoutes");
const autoCloseAuctions = require("./utils/autoCloseAuctions")
const revealRoutes = require("./routes/revealRoutes")
const app = express();
const fs = require("fs")
const path = require("path")
const updateStatus = require("./jobs/updateAuctionStatus")
// Define uploads floder path
const uploadsPath = path.join(__dirname, "uploads")
// check if uploads floder exists, create if not
if(!fs.existsSync(uploadsPath)){
  fs.mkdirSync(uploadsPath, {recursive:true})
  console.log("'uploads folder created'")
}else{
  console.log("'uploads' folder already exists")
}
app.use("/uploads", express.static(path.join(__dirname,"uploads")))
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