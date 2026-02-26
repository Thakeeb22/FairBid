import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield, Lock, Eye, Zap, Globe, Users,
  Twitter, Github, Send, ArrowRight, ChevronRight,
  Hash, TrendingUp, Award, CheckCircle
} from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import nft1 from "@/assets/nft-1.jpg";
import nft2 from "@/assets/nft-2.jpg";
import nft3 from "@/assets/nft-3.jpg";
// import logo from "@/assets/logo.jpg";
import logo2 from "@/assets/logo2.jpg";
import {useWallet} from "@/context/WalletContext"
const {connectWallet, account, address} = useWallet();
const FadeUp: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className = "",
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-body overflow-x-hidden">
      {/* ── NAVBAR ─────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center shadow-gold">
              <span className="font-heading font-black text-accent-foreground text-sm">F</span>
            </div>
            <span className="font-heading font-bold text-lg text-foreground">
              Fair<span className="text-gold">Bid</span>
            </span> */}
            <img 
              src={logo2} 
              alt="FairBid Logo" 
              className="h-15 w-10 rounded-lg object-cover"
            />
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {["How It Works", "Features", "Market", "Docs"].map((item) => (
              <button
                key={item}
                onClick={() => item === "Market" && navigate("/market")}
                className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={async () =>{
                if(!account){
                  await connectWallet()
                }
                navigate("/dashboard")
              }}
              className="px-4 py-2 rounded-xl bg-gradient-gold text-accent-foreground font-heading font-semibold text-sm gold-glow"
            >
              {account? `Connected: ${address.slice(0,6)}...${address.slice(-4)}`:"Connect Wallet"}
            </motion.button>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────── */}
      <section className="relative pt-24 pb-20 sm:pt-36 sm:pb-32 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img src={heroBanner} alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </div>

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-accent/8 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-primary-glow/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-muted bg-accent/8 mb-6"
          > */}
            {/* <span className="w-2 h-2 rounded-full bg-gold live-dot" />
            <span className="font-body text-xs text-gold font-semibold uppercase tracking-wider">
              Live on Starknet
            </span>
          </motion.div> */}

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black text-foreground leading-tight mb-6"
          >
            Sealed Bids.{" "}
            <span className="gradient-text-gold">Fair Wins.</span>
            <br />
            <span className="gradient-text-teal">Zero Frontrunning.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="font-body text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            FairBid is a Starknet-powered commit–reveal auction platform for NFTs. Every bid is cryptographically sealed until the reveal phase — guaranteeing privacy, fairness, and zero manipulation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/market")}
              className="px-7 py-3.5 bg-gradient-gold rounded-xl font-heading font-bold text-accent-foreground text-base gold-glow flex items-center justify-center gap-2"
            >
              Explore Market <ArrowRight size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/create")}
              className="px-7 py-3.5 rounded-xl border-2 border-border font-heading font-semibold text-foreground text-base hover:border-gold/50 transition-colors flex items-center justify-center gap-2"
            >
              Create Auction <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        </div>

        {/* Floating NFT cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="relative z-10 max-w-4xl mx-auto px-4 mt-16 flex justify-center gap-4 flex-wrap sm:flex-nowrap"
        >
          {[
            { img: nft1, title: "Circuit Genesis #001", price: "12.5 STRK", status: "Active" },
            { img: nft2, title: "Crystal Epoch #047", price: "22.4 STRK", status: "Reveal Phase" },
            { img: nft3, title: "Phoenix Protocol #12", price: "34.8 STRK", status: "Finalized" },
          ].map(({ img, title, price, status }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              whileHover={{ y: -6 }}
              className="card-glass overflow-hidden w-full sm:w-48 shrink-0 cursor-pointer"
              onClick={() => navigate("/market")}
            >
              <img src={img} alt={title} className="w-full aspect-square object-cover" />
              <div className="p-3">
                <p className="font-heading text-xs font-semibold text-foreground truncate">{title}</p>
                <p className="font-heading text-sm font-bold text-gold mt-0.5">{price}</p>
                <span className={`inline-block mt-1.5 text-[10px] font-heading font-semibold px-2 py-0.5 rounded-full ${
                  status === "Active" ? "status-active" : status === "Reveal Phase" ? "status-reveal" : "status-finalized"
                }`}>{status}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── STATS TICKER ───────────────────────── */}
      <section className="border-y border-border bg-card/50 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "2,841", label: "Total Bids Placed" },
              { value: "412 STRK", label: "Volume Traded" },
              { value: "189", label: "NFTs Auctioned" },
              { value: "1,042", label: "Unique Bidders" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-heading text-2xl sm:text-3xl font-black gradient-text-gold">{value}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────── */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 space-y-3">
          <FadeUp>
            <p className="font-body text-xs font-semibold text-gold uppercase tracking-widest">The Protocol</p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-foreground">How FairBid Works</h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="font-body text-muted-foreground max-w-xl mx-auto">
              A trustless, commit–reveal mechanism that keeps every bid private until the reveal phase.
            </p>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Hash, step: "01", title: "List Your NFT", desc: "Creators deploy a sealed-bid auction smart contract with a floor price and timeline." },
            { icon: Lock, step: "02", title: "Commit Phase", desc: "Bidders submit a cryptographic hash of their bid amount + secret phrase. Funds are locked." },
            { icon: Eye, step: "03", title: "Reveal Phase", desc: "After the commit deadline, bidders reveal their original bid and secret to be validated on-chain." },
            { icon: Award, step: "04", title: "Winner Decided", desc: "The smart contract automatically awards the NFT to the highest verified bid. Zero trust required." },
          ].map(({ icon: Icon, step, title, desc }, i) => (
            <FadeUp key={step} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                className="card-glass p-5 space-y-3 group hover:border-gold-muted transition-colors duration-300 h-full"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center gold-glow">
                    <Icon size={18} className="text-accent-foreground" />
                  </div>
                  <span className="font-heading text-3xl font-black text-border group-hover:text-accent-muted transition-colors">{step}</span>
                </div>
                <h3 className="font-heading font-bold text-foreground">{title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────── */}
      <section className="py-20 border-t border-border bg-card/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 space-y-3">
            <FadeUp>
              <p className="font-body text-xs font-semibold text-gold uppercase tracking-widest">Why FairBid</p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="font-heading text-3xl sm:text-4xl font-black text-foreground">
                Built for a Fair NFT Market
              </h2>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: "Zero Frontrunning", desc: "Bids are sealed as cryptographic hashes. Validators and other bidders cannot see your amount." },
              { icon: Lock, title: "Non-Custodial", desc: "Funds are held by the smart contract only. No centralized escrow or admin keys." },
              { icon: Zap, title: "Starknet Speed", desc: "ZK-rollup scalability means near-instant finality and ultra-low fees for every bid." },
              { icon: Globe, title: "Permissionless", desc: "Anyone can create or participate in auctions. No KYC. No gatekeeping. Truly open." },
              { icon: Users, title: "Transparent Results", desc: "Once revealed, all bids and the winner are publicly verifiable on-chain by anyone." },
              { icon: TrendingUp, title: "True Price Discovery", desc: "Sealed bids remove anchoring bias and shill bidding — resulting in genuinely fair prices." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <FadeUp key={title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="card-glass p-5 space-y-3 group hover:border-gold-muted transition-colors duration-300 h-full"
                >
                  <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent-muted flex items-center justify-center">
                    <Icon size={16} className="text-gold" />
                  </div>
                  <h3 className="font-heading font-bold text-foreground">{title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── STARKNET BADGE STRIP ────────────────── */}
      <section className="py-14 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-body text-xs text-muted-foreground uppercase tracking-widest"
          >
            Powered by
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {["Starknet", "Cairo Smart Contracts", "STARK Proofs",].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full border border-border bg-card/60 font-body text-sm text-muted-foreground hover:border-gold/40 hover:text-foreground transition-colors cursor-default"
              >
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────── */}
      <section className="py-20 border-t border-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl mx-auto px-4 text-center"
        >
          <div className="card-glass p-10 sm:p-14 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/6 via-transparent to-primary-glow/5 pointer-events-none" />
            <div className="relative space-y-6">
              <h2 className="font-heading text-3xl sm:text-4xl font-black text-foreground">
                Ready to bid <span className="gradient-text-gold">fairly</span>?
              </h2>
              <p className="font-body text-muted-foreground max-w-md mx-auto">
                Join thousands of collectors and creators using FairBid's sealed-bid protocol for trustless NFT auctions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/market")}
                  className="px-8 py-3.5 bg-gradient-gold rounded-xl font-heading font-bold text-accent-foreground gold-glow flex items-center justify-center gap-2"
                >
                  Browse Market <ArrowRight size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/dashboard")}
                  className="px-8 py-3.5 rounded-xl border-2 border-border font-heading font-semibold text-foreground hover:border-gold/50 transition-colors"
                >
                  Go to Dashboard
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ─────────────────────────────── */}
      <footer className="border-t border-border bg-card/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center shadow-gold">
                  <span className="font-heading font-black text-accent-foreground text-sm">F</span>
                </div>
                <span className="font-heading font-bold text-lg text-foreground">
                  Fair<span className="text-gold">Bid</span>
                </span>
              </div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                The only NFT auction platform that mathematically guarantees fairness using Starknet's ZK-rollup technology.
              </p>
              {/* Socials */}
              <div className="flex items-center gap-2">
                {[
                  { icon: Twitter, label: "Twitter", href: "https://x.com/_FairBid" },
                  { icon: Github, label: "GitHub", href: "https://github.com/Mettle-X/FairBid.git" },
                  { icon: Send, label: "Telegram", href: "https://t.me" },
                ].map(({ icon: Icon, label, href }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-xl border border-border bg-muted flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/40 transition-colors"
                    aria-label={label}
                  >
                    <Icon size={15} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div className="space-y-4">
              <p className="font-heading font-semibold text-foreground text-sm">Platform</p>
              <ul className="space-y-2.5">
                {["Market", "Dashboard", "Create Auction", "How It Works"].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => {
                        if (item === "Market") navigate("/market");
                        else if (item === "Dashboard") navigate("/dashboard");
                        else if (item === "Create Auction") navigate("/create");
                      }}
                      className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <p className="font-heading font-semibold text-foreground text-sm">Resources</p>
              <ul className="space-y-2.5">
                {["Documentation", "Whitepaper", "Smart Contracts", "Audit Report", "Bug Bounty"].map((item) => (
                  <li key={item}>
                    <a href="#" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group">
                      {item}
                      {(item === "Audit Report" || item === "Smart Contracts") && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold/10 text-gold font-heading font-semibold border border-gold/20">Live</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community */}
            <div className="space-y-4">
              <p className="font-heading font-semibold text-foreground text-sm">Community</p>
              <ul className="space-y-2.5">
                {["Discord", "Twitter / X", "Telegram", "Mirror Blog", "Governance Forum"].map((item) => (
                  <li key={item}>
                    <a href="#" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-body text-xs text-muted-foreground">
              © 2026 FairBid Protocol. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5">
              <CheckCircle size={13} className="text-status-active" />
              <span className="font-body text-xs text-muted-foreground">
                All systems operational · Built on Starknet
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
