import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageTransition from "./components/layout/PageTransition";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Market from "./pages/Market";
import CreateAuction from "./pages/CreateAuction";
import AuctionDetails from "./pages/AuctionDetails";
import CommitPhase from "./pages/CommitPhase";
import RevealPhase from "./pages/RevealPhase";
import Finalized from "./pages/Finalized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
  </QueryClientProvider>
);

export default App;
