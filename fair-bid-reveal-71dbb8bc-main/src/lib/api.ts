import axios from "axios";

const BASE_URL = "https://fairbid-backend.onrender.com/api"; // adjust if deployed

// Auctions
export const getAuctions = async () => {
  const { data } = await axios.get(`${BASE_URL}/auctions`);
  return data;
};

export const getSingleAuction = async (id: string) => {
  const { data } = await axios.get(`${BASE_URL}/auctions/${id}`);
  return data;
};

export const createAuction = async (auction: any) => {
  const { data } = await axios.post(`${BASE_URL}/auctions/create`, auction);
  return data;
};

// Bids
export const commitBidAPI = async (auctionId: string, payload: any) => {
  const { data } = await axios.post(`${BASE_URL}/bid/${auctionId}/commit`, payload);
  return data;
};

export const revealBidAPI = async (auctionId: string, payload: any) => {
  const { data } = await axios.post(`${BASE_URL}/bid/${auctionId}/reveal`, payload);
  return data;
};

export const getBidHistory = async (auctionId: string) => {
  const { data } = await axios.get(`${BASE_URL}/bid/history/${auctionId}`);
  return data;
};

// Fairness / metrics
export const getFairnessMetrics = async (auctionId: string) => {
  const { data } = await axios.get(`${BASE_URL}/auctions/${auctionId}/fairness`);
  return data;
};