"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { stagger, fadeUp } from "@/lib/animations";

const roles = [
  "Forward Deployed Engineer",
  "AI Solutions Engineer",
  "Salesforce Developer",
  "AI Integration Engineer",
  "AI Agent Builder",
];

const stats = [
  { value: "63+", label: "GitHub Repos" },
  { value: "300+", label: "LeetCode Solved" },
  { value: "10+", label: "Web3 Projects" },
  { value: "Ninja", label: "Dominator — CN" },
];

function TypingText({ texts }: { texts: string[] }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[index];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
    } else if (deleting && displayed.length === 0) {
      timeout = setTimeout(() => {
        setDeleting(false);
        setIndex((i) => (i + 1) % texts.length);
      }, 0);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, index, texts]);

  return (
    <span className="gradient-text">
      {displayed}
      <span className="animate-pulse text-violet-400">|</span>
    </span>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-violet-900/5 rounded-full blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-5xl mx-auto mb-20"
      >
        {/* Badge */}
        <motion.div variants={fadeUp} className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium glass border border-violet-500/20 text-violet-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Open to AI & FDE Roles
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1 variants={fadeUp} className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-4 leading-none">
          Roshan Patil
        </motion.h1>

        {/* Typing role */}
        <motion.div variants={fadeUp} className="text-2xl sm:text-4xl font-bold mb-6 h-12 flex items-center justify-center">
          <TypingText texts={roles} />
        </motion.div>

        {/* Tagline */}
        <motion.p variants={fadeUp} className="text-base sm:text-lg text-white/40 max-w-xl mx-auto mb-10 leading-relaxed">
          Salesforce Developer turned AI Engineer. Building intelligent agents,
          RAG pipelines, and AI-powered Salesforce solutions — targeting{" "}
          <span className="text-violet-400">FDE</span> and{" "}
          <span className="text-blue-400">Salesforce</span>{" "}+{" "}
          <span className="text-violet-400">AI</span> roles.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center mb-20">
          <a
            href="#projects"
            className="px-7 py-3 rounded-xl font-semibold text-sm bg-linear-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-lg shadow-violet-900/30 hover:shadow-violet-900/50 transition-all duration-300 hover:-translate-y-0.5"
          >
            View Projects
          </a>
          <a
            href="https://github.com/Ragnar20-03"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3 rounded-xl font-semibold text-sm glass border border-white/10 hover:border-violet-500/30 text-white/80 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
          >
            GitHub Profile
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-4 border border-white/5">
              <div className="text-2xl font-black gradient-text">{s.value}</div>
              <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-white/20">scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-linear-to-b from-violet-500/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
