"use client";

import { motion } from "framer-motion";
import { fadeUp, slideLeft, stagger, viewportConfig } from "@/lib/animations";

const experiences = [
  {
    role: "Salesforce Developer",
    company: "Professional Role",
    period: "Jan 2026 — Present",
    current: true,
    description: [
      "Building Salesforce solutions using Apex and Lightning Web Components (LWC)",
      "Intermediate knowledge of core Salesforce platform, automation, and integrations",
      "Working toward Salesforce AI / Agentforce integration",
    ],
    tech: ["Apex", "LWC", "Salesforce", "SOQL"],
  },
  {
    role: "Full Stack Developer",
    company: "Freelance / Self-Directed",
    period: "2023 — 2025",
    current: false,
    description: [
      "Built 10+ full stack applications using MERN and MEAN stacks",
      "Developed real-time apps with WebSocket and WebRTC (Chess, Omegle, Whisper)",
      "Shipped social platforms, booking systems, and developer tools",
    ],
    tech: ["TypeScript", "React", "Node.js", "MongoDB", "WebRTC"],
  },
  {
    role: "Web3 / Solana Builder",
    company: "Open Source / Side Projects",
    period: "2025",
    current: false,
    description: [
      "Built 6+ Solana-based dApps including a DEX and on-chain TicTacToe",
      "Used Anchor framework for smart contract development",
      "Shipped token launchpad, SOL faucet, and donation dApp",
    ],
    tech: ["Solana", "Anchor", "TypeScript", "Web3.js"],
  },
];

const roadmap = [
  { stage: "01", label: "Python Core", status: "done", color: "bg-emerald-400" },
  { stage: "02", label: "LLM APIs", status: "active", color: "bg-violet-400" },
  { stage: "03", label: "RAG Pipelines", status: "upcoming", color: "bg-white/20" },
  { stage: "04", label: "AI Agents", status: "upcoming", color: "bg-white/20" },
  { stage: "05", label: "n8n Automation", status: "upcoming", color: "bg-white/20" },
  { stage: "06", label: "AWS Deployment", status: "upcoming", color: "bg-white/20" },
  { stage: "07", label: "Salesforce AI", status: "upcoming", color: "bg-white/20" },
];

export default function Experience() {
  return (
    <section id="experience" className="py-28 px-4 relative">
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest text-violet-400 uppercase mb-4">Experience</p>
            <h2 className="section-heading text-white">
              My <span className="gradient-text">Journey</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left — Timeline */}
            <motion.div variants={slideLeft} className="space-y-0">
              {experiences.map((exp, i) => (
                <div key={exp.role} className="relative pl-8">
                  {/* Line */}
                  {i < experiences.length - 1 && (
                    <div className="absolute left-[11px] top-8 bottom-0 w-px bg-gradient-to-b from-violet-500/40 to-transparent" />
                  )}
                  {/* Dot */}
                  <div className={`absolute left-0 top-1.5 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center ${exp.current ? "border-violet-500 bg-violet-500/20" : "border-white/20 bg-white/5"}`}>
                    {exp.current && <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />}
                  </div>

                  <div className="pb-10">
                    <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
                      <div>
                        <h3 className="font-bold text-white text-sm">{exp.role}</h3>
                        <p className="text-xs text-violet-400">{exp.company}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-medium flex-shrink-0 ${exp.current ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-white/30 border border-white/10"}`}>
                        {exp.period}
                      </span>
                    </div>

                    <ul className="space-y-1.5 mb-3">
                      {exp.description.map((d) => (
                        <li key={d} className="text-xs text-white/40 flex gap-2">
                          <span className="text-violet-500 mt-0.5 flex-shrink-0">▸</span>
                          {d}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1.5">
                      {exp.tech.map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-white/40">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Right — AI Roadmap */}
            <motion.div variants={fadeUp}>
              <div className="glass rounded-2xl p-6 border border-violet-500/10 glow-purple h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center text-sm">🗺️</div>
                  <div>
                    <h3 className="font-bold text-white text-sm">AI Learning Roadmap</h3>
                    <p className="text-xs text-white/30">Targeting FDE / AI Engineer roles</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {roadmap.map((item, i) => (
                    <motion.div
                      key={item.stage}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={viewportConfig}
                      transition={{ delay: i * 0.08 }}
                      className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-200 ${
                        item.status === "done"
                          ? "bg-emerald-500/5 border-emerald-500/15"
                          : item.status === "active"
                          ? "bg-violet-500/10 border-violet-500/25"
                          : "bg-white/2 border-white/5"
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.color}`} />
                      <span className="text-xs font-mono text-white/20">{item.stage}</span>
                      <span className={`text-sm font-medium flex-1 ${item.status === "upcoming" ? "text-white/30" : "text-white"}`}>
                        {item.label}
                      </span>
                      {item.status === "done" && <span className="text-xs text-emerald-400">✓ Done</span>}
                      {item.status === "active" && (
                        <span className="text-xs text-violet-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                          In Progress
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>

                <p className="text-xs text-white/20 mt-6 text-center">
                  After all stages → 10-15 AI projects across industries
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
