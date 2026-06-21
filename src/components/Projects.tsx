"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, stagger, viewportConfig } from "@/lib/animations";

type Project = {
  name: string;
  description: string;
  github: string;
  tech: string[];
  category: "web3" | "fullstack" | "ai";
  highlight?: string;
};

const projects: Project[] = [
  {
    name: "Decentralized Exchange",
    description: "A full DEX for Solana tokens — swap, liquidity pools, and on-chain order book.",
    github: "https://github.com/Ragnar20-03/decentralized-exhange",
    tech: ["TypeScript", "Solana", "React", "Anchor"],
    category: "web3",
    highlight: "DeFi",
  },
  {
    name: "On-Chain TicTacToe",
    description: "Fully on-chain TicTacToe game on Solana. Game state lives on the blockchain.",
    github: "https://github.com/Ragnar20-03/on-chain-ox",
    tech: ["TypeScript", "Solana", "Anchor", "React"],
    category: "web3",
    highlight: "On-Chain",
  },
  {
    name: "EduCred",
    description: "Reputation coin system for education — earn tokens for learning achievements.",
    github: "https://github.com/Ragnar20-03/educred",
    tech: ["TypeScript", "Blockchain", "React", "Node.js"],
    category: "web3",
    highlight: "EdTech",
  },
  {
    name: "Solana Token Launchpad",
    description: "Launch your own SPL tokens on Solana with this no-code launchpad interface.",
    github: "https://github.com/Ragnar20-03/solana-token-launchpad",
    tech: ["TypeScript", "Solana", "Web3.js", "React"],
    category: "web3",
  },
  {
    name: "SOL Faucet",
    description: "Airdrop SOL tokens to devnet/testnet wallets. Built for Solana developers.",
    github: "https://github.com/Ragnar20-03/web3_sol_faucet",
    tech: ["TypeScript", "Solana", "React"],
    category: "web3",
  },
  {
    name: "Solana Donate",
    description: "Anyone can donate SOL to a wallet address — on-chain crowdfunding made simple.",
    github: "https://github.com/Ragnar20-03/solana-donate",
    tech: ["TypeScript", "Solana", "React"],
    category: "web3",
  },
  {
    name: "Whisper",
    description: "Real-time chat application with WebSocket, rooms, and message persistence.",
    github: "https://github.com/Ragnar20-03/Whisper",
    tech: ["TypeScript", "WebSocket", "Node.js", "React"],
    category: "fullstack",
    highlight: "Real-time",
  },
  {
    name: "Minimi",
    description: "A social media platform — posts, follows, likes, feed algorithm.",
    github: "https://github.com/Ragnar20-03/Minimi",
    tech: ["JavaScript", "Node.js", "MongoDB", "React"],
    category: "fullstack",
    highlight: "Social",
  },
  {
    name: "Chess.com Replica",
    description: "Online multiplayer chess — real-time moves via WebSocket, full chess logic.",
    github: "https://github.com/Ragnar20-03/Chess.com",
    tech: ["TypeScript", "WebSocket", "React", "Node.js"],
    category: "fullstack",
    highlight: "WebSocket",
  },
  {
    name: "Omegle Clone",
    description: "Random video chat using WebRTC — peer-to-peer video calls between strangers.",
    github: "https://github.com/Ragnar20-03/Omegle",
    tech: ["TypeScript", "WebRTC", "Node.js", "React"],
    category: "fullstack",
    highlight: "WebRTC",
  },
  {
    name: "GarageKeeperX",
    description: "Full-stack garage management platform — bookings, inventory, and billing.",
    github: "https://github.com/Ragnar20-03/GarageKeeperX",
    tech: ["TypeScript", "Next.js", "Node.js", "MongoDB"],
    category: "fullstack",
  },
  {
    name: "SpotLight",
    description: "The musician app — artists showcase their work, fans discover local talent.",
    github: "https://github.com/Ragnar20-03/SpotLight-The-Musician-App",
    tech: ["TypeScript", "React", "Node.js"],
    category: "fullstack",
  },
  {
    name: "Product Recommendation AI",
    description: "ML-based product recommendation system using collaborative filtering.",
    github: "https://github.com/Ragnar20-03/Product-Recommendation-System",
    tech: ["Python", "Jupyter", "Pandas", "Scikit-learn"],
    category: "ai",
    highlight: "ML",
  },
  {
    name: "Worker Safety App",
    description: "AI-powered worker safety monitoring app with real-time alerts.",
    github: "https://github.com/Ragnar20-03/Worker_Saftey_App",
    tech: ["TypeScript", "React Native", "Node.js"],
    category: "ai",
    highlight: "Safety AI",
  },
];

const tabs = [
  { id: "all", label: "All" },
  { id: "web3", label: "Web3 / Blockchain" },
  { id: "fullstack", label: "Full Stack" },
  { id: "ai", label: "AI / ML" },
] as const;

type TabId = typeof tabs[number]["id"];

const techColors: Record<string, string> = {
  TypeScript: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  JavaScript: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Python: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Solana: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  React: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Node.js": "bg-green-500/10 text-green-400 border-green-500/20",
  WebRTC: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  WebSocket: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Anchor: "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

const defaultTechColor = "bg-white/5 text-white/50 border-white/10";

export default function Projects() {
  const [active, setActive] = useState<TabId>("all");

  const filtered = active === "all" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="py-28 px-4 relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={stagger}
        >
          {/* Heading */}
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-violet-400 uppercase mb-4">Projects</p>
            <h2 className="section-heading text-white">
              Things I&apos;ve <span className="gradient-text">Built</span>
            </h2>
            <p className="text-white/40 mt-4 text-sm max-w-md mx-auto">
              63+ repos on GitHub. Here are the ones worth showing off.
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={fadeUp} className="flex justify-center mb-10">
            <div className="glass rounded-xl p-1 border border-white/8 flex gap-1 flex-wrap justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active === tab.id
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Grid */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((project) => (
                <motion.div
                  key={project.name}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="glass rounded-2xl p-5 border border-white/5 card-hover flex flex-col group"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm">
                        {project.category === "web3" ? "🔗" : project.category === "ai" ? "🤖" : "⚡"}
                      </div>
                      {project.highlight && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 font-medium">
                          {project.highlight}
                        </span>
                      )}
                    </div>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white/40 hover:text-white"
                      aria-label="GitHub"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    </a>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-white text-sm mb-1.5">{project.name}</h3>
                  <p className="text-xs text-white/40 leading-relaxed flex-1 mb-4">{project.description}</p>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className={`text-[10px] px-2 py-1 rounded-md border font-medium ${techColors[t] ?? defaultTechColor}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* GitHub CTA */}
          <motion.div variants={fadeUp} className="text-center mt-12">
            <a
              href="https://github.com/Ragnar20-03"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium glass border border-white/10 hover:border-violet-500/30 text-white/60 hover:text-white transition-all duration-200"
            >
              View all 63 repos on GitHub →
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
