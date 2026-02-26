import { Provider, Account } from "starknet";

const provider = new Provider({
  nodeUrl: process.env.STARKNET_RPC,
});

const adminAddress = process.env.ADMIN_ADDRESS;
const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;

if (!adminAddress) {
  throw new Error("ADMIN_ADDRESS is not set");
}

if (!adminPrivateKey) {
  throw new Error("ADMIN_PRIVATE_KEY is not set");
}

export const account = new Account(
  provider,
  adminAddress,
  adminPrivateKey
);