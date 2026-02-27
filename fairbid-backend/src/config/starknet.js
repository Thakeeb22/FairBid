require('dotenv').config();
// TEMP DIAGNOSTIC - remove after debugging
console.log('🌐 PROCESS.ENV SNAPSHOT');
['STARKNET_RPC', 'ADMIN_ADDRESS', 'ADMIN_PRIVATE_KEY'].forEach(key => {
  const val = process.env[key];
  if (val) {
    console.log(`${key}:`, {
      type: typeof val,
      length: val.length,
      first10: val.substring(0, 10),
      last10: val.substring(val.length - 10),
      charCodes: val.split('').slice(0, 15).map(c => c.charCodeAt(0))
    });
  } else {
    console.log(`${key}: ❌ UNDEFINED`);
  }
});
// 🔍 DEBUG: Log env var status BEFORE any starknet calls
console.log('🔍 ENV CHECK:', {
  STARKNET_RPC: process.env.STARKNET_RPC ? '✅' : '❌',
  ADMIN_ADDRESS: process.env.ADMIN_ADDRESS ? `✅ (len=${process.env.ADMIN_ADDRESS.length})` : '❌',
  ADMIN_PRIVATE_KEY: process.env.ADMIN_PRIVATE_KEY ? '✅ (hidden)' : '❌',
  FAIRBID_CONTRACT_ADDRESS: process.env.FAIRBID_CONTRACT_ADDRESS ? '✅' : '❌',
});

// 🔒 Validate required vars
const required = ['STARKNET_RPC', 'ADMIN_ADDRESS', 'ADMIN_PRIVATE_KEY', 'FAIRBID_CONTRACT_ADDRESS'];
for (const key of required) {
  if (!process.env[key]?.trim()) {
    throw new Error(`🚨 FATAL: "${key}" is missing or empty in Render environment variables.`);
  }
}

const { Account, Provider } = require('starknet');

// 🧹 Sanitize inputs: remove quotes, whitespace, ensure 0x prefix
const sanitizeHex = (val) => {
  let cleaned = val.trim().replace(/^["']|["']$/g, ''); // Remove surrounding quotes
  if (!cleaned.startsWith('0x')) cleaned = '0x' + cleaned;
  return cleaned;
};

const provider = new Provider({
  nodeUrl: process.env.STARKNET_RPC.trim()
});

const account = new Account(
  provider,
  sanitizeHex(process.env.ADMIN_ADDRESS),
  sanitizeHex(process.env.ADMIN_PRIVATE_KEY)
);

console.log('✅ Starknet initialized. Account:', account.address);
module.exports = { account, provider };