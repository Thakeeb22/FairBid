// import nft1 from "@/assets/nft-1.jpg";
// import nft2 from "@/assets/nft-2.jpg";
// import nft3 from "@/assets/nft-3.jpg";
// import nft4 from "@/assets/nft-4.jpg";

// export type AuctionStatus = "active" | "reveal" | "finalized";

// export interface Auction {
//   id: string;
//   title: string;
//   description: string;
//   image: string;
//   status: AuctionStatus;
//   floorPrice: number;
//   highestBid?: number;
//   participants: number;
//   commitDeadline: Date;
//   revealDeadline: Date;
//   creator: string;
//   winner?: string;
//   winningBid?: number;
//   commitments: number;
//   reveals: number;
// }

// export const MOCK_WALLET = "0x04aB3...f8e2";
// export const MOCK_WALLET_FULL = "0x04aB3f19c7d2E8a6B14d5c9F2e7A3b6D8c1E4f9e2";

// export const mockAuctions: Auction[] = [
//   {
//     id: "1",
//     title: "Circuit Genesis #001",
//     description:
//       "A generative masterpiece from the Circuit Genesis collection. This piece captures the intersection of organic forms and digital precision — a pioneering NFT on Starknet.",
//     image: nft1,
//     status: "active",
//     floorPrice: 12.5,
//     participants: 24,
//     commitDeadline: new Date(Date.now() + 1000 * 60 * 60 * 5 + 1000 * 60 * 23),
//     revealDeadline: new Date(Date.now() + 1000 * 60 * 60 * 8),
//     creator: "0x04aB3...f8e2",
//     commitments: 24,
//     reveals: 0,
//   },
//   {
//     id: "2",
//     title: "Crystal Epoch #047",
//     description:
//       "Born from the digital deep, Crystal Epoch #047 is a rare specimen of teal and gold crystalline beauty. Each facet holds a fragment of the blockchain's history.",
//     image: nft2,
//     status: "reveal",
//     floorPrice: 8.0,
//     highestBid: 22.4,
//     participants: 31,
//     commitDeadline: new Date(Date.now() - 1000 * 60 * 60 * 2),
//     revealDeadline: new Date(Date.now() + 1000 * 60 * 47),
//     creator: "0x1Bc7...a2D4",
//     commitments: 31,
//     reveals: 18,
//   },
//   {
//     id: "3",
//     title: "Phoenix Protocol #12",
//     description:
//       "The Phoenix Protocol represents rebirth and transformation in the decentralized age. This coveted piece from the Protocol series is a testament to the power of Starknet.",
//     image: nft3,
//     status: "finalized",
//     floorPrice: 5.0,
//     highestBid: 34.8,
//     participants: 19,
//     commitDeadline: new Date(Date.now() - 1000 * 60 * 60 * 48),
//     revealDeadline: new Date(Date.now() - 1000 * 60 * 60 * 24),
//     creator: "0x9Fe2...C3b1",
//     winner: "0xA71c...8d4F",
//     winningBid: 34.8,
//     commitments: 19,
//     reveals: 19,
//   },
//   {
//     id: "4",
//     title: "Tribal Cipher #003",
//     description:
//       "Ancient wisdom encoded in digital art. The Tribal Cipher collection merges sacred geometry with cryptographic principles — a collector's defining piece.",
//     image: nft4,
//     status: "active",
//     floorPrice: 15.0,
//     participants: 8,
//     commitDeadline: new Date(Date.now() + 1000 * 60 * 60 * 11 + 1000 * 60 * 45),
//     revealDeadline: new Date(Date.now() + 1000 * 60 * 60 * 16),
//     creator: "0x04aB3...f8e2",
//     commitments: 8,
//     reveals: 0,
//   },
// ];

// export const recentActivity = [
//   { address: "0x8fA3...d1E2", action: "Submitted sealed bid", time: "2 min ago", hash: "0xc8a4...f21b" },
//   { address: "0x3Bc1...e9F4", action: "Submitted sealed bid", time: "5 min ago", hash: "0x7d31...a8c9" },
//   { address: "0xD4e7...2aB3", action: "Submitted sealed bid", time: "11 min ago", hash: "0x1f9e...bc45" },
//   { address: "0x5Ca8...f3G1", action: "Submitted sealed bid", time: "18 min ago", hash: "0x4a7d...e612" },
//   { address: "0x2Fb9...1dC7", action: "Submitted sealed bid", time: "34 min ago", hash: "0x9b3c...7f28" },
// ];

// export const revealedBids = [
//   { address: "0xA71c...8d4F", amount: 22.4, isHighest: true },
//   { address: "0x3Bc1...e9F4", amount: 19.8, isHighest: false },
//   { address: "0x8fA3...d1E2", amount: 15.5, isHighest: false },
//   { address: "0xD4e7...2aB3", amount: 14.2, isHighest: false },
//   { address: "0x5Ca8...f3G1", amount: 11.7, isHighest: false },
//   { address: "0x2Fb9...1dC7", amount: 10.0, isHighest: false },
// ];

// export const fullAuctionHistory = [
//   { rank: 1, address: "0xA71c...8d4F", bid: 34.8, status: "Winner" },
//   { rank: 2, address: "0x3Bc1...e9F4", bid: 29.1, status: "Revealed" },
//   { rank: 3, address: "0x8fA3...d1E2", bid: 24.7, status: "Revealed" },
//   { rank: 4, address: "0xD4e7...2aB3", bid: 21.3, status: "Revealed" },
//   { rank: 5, address: "0x5Ca8...f3G1", bid: 18.9, status: "Revealed" },
//   { rank: 6, address: "0x2Fb9...1dC7", bid: 16.4, status: "Revealed" },
//   { rank: 7, address: "0x7Fe3...c2A1", bid: 14.2, status: "Revealed" },
//   { rank: 8, address: "0x1Gd5...b8E9", bid: 12.0, status: "Revealed" },
//   { rank: 9, address: "0x9Ha4...d6F3", bid: 9.5, status: "Revealed" },
//   { rank: 10, address: "0x4Ib6...e1C7", bid: 7.8, status: "Revealed" },
// ];
