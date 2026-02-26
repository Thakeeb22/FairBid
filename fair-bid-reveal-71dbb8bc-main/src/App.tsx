import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageTransition from "./components/layout/PageTransition";

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Market from "./pages/Market";
import CreateAuction from "./pages/CreateAuction";
import AuctionDetails from "./pages/AuctionDetails";
import CommitPhase from "./pages/CommitPhase";
import RevealPhase from "./pages/RevealPhase";
import Finalized from "./pages/Finalized";
import NotFound from "./pages/NotFound";

// Starknet
import {
  StarknetConfig,
  InjectedConnector,
  publicProvider,
} from "@starknet-react/core";

// -----------------------------
// React Query
// -----------------------------
const queryClient = new QueryClient();

// -----------------------------
// Connectors
// -----------------------------
const connectors = [
  new InjectedConnector({ options: { id: "argentX" } }),
  new InjectedConnector({ options: { id: "braavos" } }),
];

// -----------------------------
// Chains (plain objects)
// -----------------------------
const sepolia = {
  id: 0x53n, // bigint
  name: "Sepolia Testnet",
  network: "sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://alpha4.starknet.io/rpc"],
  blockExplorers: { default: { name: "Voyager", url: "https://sepolia.voyager.online" } },
  testnet: true,
  paymasterRpcUrls: [],
};

const mainnet = {
  id: 0x534e5f4d41494en, // bigint
  name: "Mainnet",
  network: "mainnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://alpha-mainnet.starknet.io/rpc"],
  blockExplorers: { default: { name: "Voyager", url: "https://voyager.online" } },
  testnet: false,
  paymasterRpcUrls: [],
};

// -----------------------------
// App Component
// -----------------------------
const App = () => (
  <QueryClientProvider client={queryClient}>
    <StarknetConfig
      chains={[sepolia, mainnet]}
      connectors={connectors}
      provider={publicProvider()}
      autoConnect
      defaultChainId={sepolia.id} // optional
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PageTransition>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/market" element={<Market />} />
              <Route path="/create" element={<CreateAuction />} />
              <Route path="/auction/:id" element={<AuctionDetails />} />
              <Route path="/commit/:id" element={<CommitPhase />} />
              <Route path="/reveal/:id" element={<RevealPhase />} />
              <Route path="/finalized/:id" element={<Finalized />} />
              <Route path="/portfolio" element={<Dashboard />} />
              <Route path="/settings" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </BrowserRouter>
      </TooltipProvider>
    </StarknetConfig>
  </QueryClientProvider>
);

export default App;