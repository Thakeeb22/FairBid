require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const PORT = process.env.PORT || 5000;

// Connect MONGODB
connectDB();
// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Add to server.js or a debug route
app.get('/debug/rpc', async (req, res) => {
  try {
    const { Provider } = require('starknet');
    const rpc = process.env.STARKNET_RPC;
    
    console.log('🔍 Testing RPC:', rpc);
    
    const provider = new Provider({ nodeUrl: rpc });
    const block = await provider.getBlock('latest');
    
    res.json({
      success: true,
      rpc,
      blockNumber: block.block_number,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      rpc: process.env.STARKNET_RPC,
    });
  }
});