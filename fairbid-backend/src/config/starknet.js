import { Provider, Account } from "starknet";

const provider = new Provider({
  nodeUrl: "https://starknet-sepolia.public.blastapi.io",
});

const adminAddress = process.env.ADMIN_ADDRESS;
const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;

if (!adminAddress || !adminPrivateKey) {
  throw new Error("ADMIN_ADDRESS or ADMIN_PRIVATE_KEY not set in environment variables");
}

// Backend wallet
export const account = new Account(provider, adminAddress, adminPrivateKey);