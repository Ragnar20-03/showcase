"use client";

import { motion } from "framer-motion";
import { fadeUp, slideLeft, stagger, viewportConfig } from "@/lib/animations";

const experiences = [
  {
    role: "Salesforce Developer",
    company: "Skillsmind LLP — Nashik",
    period: "2025 — Present · 1 yr",
    current: true,
    description: [
      "Building Salesforce solutions using Apex and Lightning Web Components (LWC)",
      "Intermediate knowledge of core Salesforce platform, automation, and integrations",
      "Exploring Salesforce AI / Agentforce integration",
    ],
    tech: ["Apex", "LWC", "Salesforce", "SOQL", "Agentforce"],
  },
  {
    role: "Full Stack Web Developer",
    company: "Cosmic Solutions — Goa",
    period: "2024 — 2025 · 1 yr",
    current: false,
    description: [
      "Built and maintained full stack web applications for clients",
      "Worked across the MERN stack — React frontend, Node.js/Express backend, MongoDB",
      "Delivered end-to-end features from UI to database and deployment",
    ],
    tech: ["React", "Node.js", "MongoDB", "Express.js", "JavaScript", "TypeScript"],
  },
  {
    role: "Web3 / Solana Builder",
    company: "Open Source / Projects",
    period: "2025",
    current: false,
    description: [
      "Built 6+ Solana-based dApps — DEX, on-chain games, token launchpad",
      "Used Anchor framework for smart contract development",
      "Shipped donation dApp, SOL faucet, and reputation coin system",
    ],
    tech: ["Solana", "Anchor", "TypeScript", "Web3.js"],
  },
];

const evolution = [
  {
    layer: "AI & Agents",
    period: "2025 — Now",
    color: "border-violet-500",
    bg: "bg-violet-500/10",
    dot: "bg-violet-400",
    textColor: "text-violet-300",
    skills: ["LLM APIs", "RAG", "AI Agents", "n8n", "Agentforce", "Prompt Eng", "Vector DBs"],
    desc: "Building intelligent systems — the primary focus",
    highlight: true,
  },
  {
    layer: "Salesforce Platform",
    period: "2025 — 2026",
    color: "border-blue-500",
    bg: "bg-blue-500/10",
    dot: "bg-blue-400",
    textColor: "text-blue-300",
    skills: ["Apex", "LWC", "SOQL", "Flows", "REST Integration", "Einstein AI"],
    desc: "Professional platform engineering",
    highlight: true,
  },
  {
    layer: "Web3 / Blockchain",
    period: "2025",
    color: "border-orange-500",
    bg: "bg-orange-500/8",
    dot: "bg-orange-400",
    textColor: "text-orange-300",
    skills: ["Solana", "Anchor", "Smart Contracts", "DeFi", "SPL Tokens"],
    desc: "On-chain application development",
  },
  {
    layer: "Full Stack & Cloud",
    period: "2023 — 2025",
    color: "border-emerald-500",
    bg: "bg-emerald-500/8",
    dot: "bg-emerald-400",
    textColor: "text-emerald-300",
    skills: ["Next.js", "React", "Node.js", "Docker", "AWS", "CI/CD", "MongoDB", "PostgreSQL"],
    desc: "End-to-end product development",
  },
  {
    layer: "Systems & DevOps",
    period: "2023 — 2024",
    color: "border-yellow-500",
    bg: "bg-yellow-500/8",
    dot: "bg-yellow-400",
    textColor: "text-yellow-300",
    skills: ["Linux", "Kernel Modules", "Device Drivers", "System Calls", "C/C++", "Git", "Nginx"],
    desc: "Low-level systems and infrastructure",
  },
  {
    layer: "CS Foundation",
    period: "2023",
    color: "border-white/20",
    bg: "bg-white/3",
    dot: "bg-white/40",
    textColor: "text-white/40",
    skills: ["C", "C++", "Java", "Data Structures", "Algorithms", "OS", "DBMS", "Networking"],
    desc: "Where it all started",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-28 px-4 relative">
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewportConfig}>

          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest text-violet-400 uppercase mb-4">Experience</p>
            <h2 className="section-heading text-white">
              My <span className="gradient-text">Journey</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">

            {/* Left — Work Timeline */}
            <motion.div variants={slideLeft} className="space-y-0">
              {experiences.map((exp, i) => (
                <div key={exp.role} className="relative pl-8">
                  {i < experiences.length - 1 && (
                    <div className="absolute left-2.75 top-8 bottom-0 w-px bg-linear-to-b from-violet-500/40 to-transparent" />
                  )}
                  <div className={`absolute left-0 top-1.5 w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center ${exp.current ? "border-violet-500 bg-violet-500/20" : "border-white/20 bg-white/5"}`}>
                    {exp.current && <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />}
                  </div>

                  <div className="pb-10">
                    <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
                      <div>
                        <h3 className="font-bold text-white text-sm">{exp.role}</h3>
                        <p className="text-xs text-violet-400">{exp.company}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-medium shrink-0 ${exp.current ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-white/30 border border-white/10"}`}>
                        {exp.period}
                      </span>
                    </div>
                    <ul className="space-y-1.5 mb-3">
                      {exp.description.map((d) => (
                        <li key={d} className="text-xs text-white/40 flex gap-2">
                          <span className="text-violet-500 mt-0.5 shrink-0">▸</span>
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

            {/* Right — Bottom-up Tech Evolution */}
            <motion.div variants={fadeUp}>
              <div className="glass rounded-2xl p-6 border border-white/8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center text-sm">📈</div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Tech Evolution</h3>
                    <p className="text-xs text-white/30">Built from the ground up</p>
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-2">
                  {evolution.map((layer, i) => (
                    <motion.div
                      key={layer.layer}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={viewportConfig}
                      transition={{ delay: i * 0.07 }}
                      className={`relative rounded-xl border-l-2 ${layer.color} ${layer.bg} p-3 ${layer.highlight ? "shadow-lg" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${layer.dot}`} />
                          <span className={`text-xs font-semibold ${layer.textColor}`}>{layer.layer}</span>
                          {layer.highlight && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/20 text-violet-400">
                              Focus
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-white/20 font-mono">{layer.period}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {layer.skills.map((s) => (
                          <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 border border-white/5">
                            {s}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <p className="text-[10px] text-white/15 mt-4 text-center">
                  ↑ current focus &nbsp;·&nbsp; foundation ↓
                </p>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
